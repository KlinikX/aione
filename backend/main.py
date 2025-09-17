import openai
import os
import json
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException, Depends, Body, File, UploadFile, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from healthcare import Healthcare, User, Login, send_email
from db import get_user_by_email, insert_user, update_user
from fastapi.security import HTTPBasic, HTTPBasicCredentials
from fastapi.security import HTTPBasic, HTTPBasicCredentials
from pydantic import BaseModel
import secrets
import random
from fastapi.responses import StreamingResponse
from pymongo import MongoClient
from fastapi import APIRouter
from utils import (
    generate_openai_response_stream,
    speech_to_text_with_vad,
    pcm_to_wav, 
    combine_audio_streams_with_vad
)
from fastapi import Depends, HTTPException
from fastapi import Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import time
from pathlib import Path
import shutil
from fastapi.staticfiles import StaticFiles
from google.cloud import storage
from datetime import datetime, timedelta
from typing import List, Optional
from bson import ObjectId
import uuid
import base64
import asyncio

from pydantic import BaseModel, Field
from typing import List, Optional


from prometheus_fastapi_instrumentator import Instrumentator
from prometheus_client import Counter, Histogram, generate_latest
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.responses import Response


class UserProfileForm(BaseModel):
    # 1. Personal Information
    full_name: str
    current_position: str
    industry_specialty: str
    years_experience: int
    location: str
    
    # 2. Company/Practice Information
    company_name: str
    company_size: str  # "1-10", "11-50", "51-200", "200+"
    company_usp: str
    target_audience: str
    services_offered: str
    
    # 3. Communication Style & Tone
    communication_style: str  # "casual", "professional", "inspiring", "expert"
    writing_style: str  # "first_person", "team_voice"
    
    # 4. LinkedIn Goals
    linkedin_goals: List[str]
    linkedin_goals_other: Optional[str] = None
    
    # 5. Content Preferences
    content_preferences: List[str]
    content_preferences_other: Optional[str] = None
    
    # 6. Do's & Don'ts
    topics_to_include: str
    topics_to_avoid: str
    
    # 7. Practical Details
    posting_frequency: str  # "once_week", "2-3_times_week", "several_times_week"
    preferred_post_length: str  # "short", "medium", "long"
    post_language: str  # "english", "german", "both"

# Add these near the top of your file with other imports and configure
GCS_BUCKET_NAME = os.getenv("GCS_BUCKET_NAME")
storage_client = storage.Client()
bucket = storage_client.bucket(GCS_BUCKET_NAME)

# OTP store - In-memory store for OTPs
otp_store = {}  # {email: otp}
OTP_EXPIRY_SECONDS = 300  # 5 minutes

# Load environment variables from the .env file
load_dotenv()

# MongoDB connection
MONGO_CONNECTION_STRING = os.getenv("MONGO_CONNECTION_STRING")
client = MongoClient(MONGO_CONNECTION_STRING)
db = client["AI-Linkedin"]
users_collection = db["users"]
saved_posts_collection = db["saved_posts"]
session_collection = db["sessions"]
transcription_collection = db["transcriptions"]

# database indexes
def setup_post_indexes():
    """Run once to create database indexes for better performance"""
    saved_posts_collection.create_index("user_email")
    saved_posts_collection.create_index([("user_email", 1), ("status", 1)])
    saved_posts_collection.create_index([("user_email", 1), ("created_at", -1)])
    saved_posts_collection.create_index([("content", "text")])

# Uncomment this line and run once, then comment it back
# setup_post_indexes()


# OpenAI API Key
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
client_openai = openai.AsyncOpenAI(api_key=OPENAI_API_KEY)

# Security dependencies
security_bearer = HTTPBearer()

# Instantiate the Healthcare class
healthcare = Healthcare()

# Define HookRequest
class HookRequest(BaseModel):
    user_input: str 
    
# Define the request models for saving and updating posts
class SavePostRequest(BaseModel):
    content: str
    tags: Optional[List[str]] = []

class UpdatePostRequest(BaseModel):
    content: Optional[str] = None
    tags: Optional[List[str]] = None
    status: Optional[str] = None

class PostFilter(BaseModel):
    status: Optional[str] = None
    tag: Optional[str] = None
    search: Optional[str] = None

# Define PostRequest (empty - no params needed)
class PostRequest(BaseModel):
    pass  # No fields needed as we use stored state

# Define the get_current_user function to handle authentication
def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security_bearer)):
    token = credentials.credentials
    user = users_collection.find_one({"bearer_token": token})
    if not user:
        raise HTTPException(
            status_code=401,
            detail="Invalid or expired token",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return user

# FastAPI app
app = FastAPI()

# CORS middleware setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize the healthcare router
healthcare_router = APIRouter()

# Step 1: Get available templates
@healthcare_router.get("/available_templates")
async def available_templates(current_user: dict = Depends(get_current_user)):
    """First step: Get all available templates to choose from"""
    return {"templates": [{"number": i + 1, "name": k, "description": v.description} 
                         for i, (k, v) in enumerate(healthcare.templates.items())]}

# Step 2: Select a template
@healthcare_router.post("/select_template")
def select_template(template_number: int, user=Depends(get_current_user)):
    """Second step: Select one of the available templates by number"""
    response = healthcare.select_template(template_number)
    return {"message": response}

# Step 3: Generate hooks based on user input and selected template
@healthcare_router.post("/generate_hooks")
async def generate_hooks_endpoint(request: HookRequest, current_user: dict = Depends(get_current_user)):
    """Third step: Generate hook options based on user input"""
    # Now passing the user email to store hooks in the Healthcare class
    hooks = await healthcare.generate_hooks(request.user_input, current_user["email"])
    if not hooks:
        raise HTTPException(status_code=400, detail="No hooks generated. Please try again.")
    
    numbered_hooks = [{"number": i + 1, "hook": hook} for i, hook in enumerate(hooks)]
    return {"hooks": numbered_hooks}



# Step 4: Select a hook
@healthcare_router.post("/select_hook")
def select_hook(hook_number: int, user=Depends(get_current_user)):
    """Fourth step: Select one of the generated hooks by number"""
    # Use Healthcare class method instead of accessing user_hooks_store
    success = healthcare.select_hook(user["email"], hook_number)
    if not success:
        raise HTTPException(status_code=400, detail="No hooks found or invalid hook number")
    
    return {"message": "Hook selected successfully", "hook_number": hook_number}


# Streaming version of the final post generation - UPDATED to use stored data
# @healthcare_router.post("/generate_linkedin_post/stream")
# async def generate_post_stream(current_user: dict = Depends(get_current_user)):
#     """Streaming version of the final post generation using stored state"""
#     # Check if template was selected
#     if not healthcare.selected_template:
#         raise HTTPException(status_code=400, detail="No template selected. Please select a template first.")
        
#     # Get the stored template
#     selected_template = healthcare.selected_template
    
#     # Get hooks, user_input and selected hook from Healthcare class
#     user_hooks_data = healthcare.get_user_hooks(current_user["email"])
    
#     if not user_hooks_data:
#         raise HTTPException(status_code=400, detail="No hooks generated. Please generate hooks first.")
    
#     if "selected_hook_number" not in user_hooks_data:
#         raise HTTPException(status_code=400, detail="No hook selected. Please select a hook first.")
    
#     # Use stored user input
#     user_input = user_hooks_data["user_input"]
#     selected_hook_number = user_hooks_data["selected_hook_number"]
#     hooks = user_hooks_data["hooks"]
    
#     if selected_hook_number < 1 or selected_hook_number > len(hooks):
#         raise HTTPException(status_code=400, detail="Invalid hook number")
    
#     hook = hooks[selected_hook_number - 1]
    
#     system_prompt = f"""
#     You are an AI assistant for generating healthcare-specific LinkedIn posts. Based on the following template: '{selected_template.description}',
#     and the following selected hook: '{hook}...',
#     generate LinkedIn post with specified type, tone, and hashtags.
#     """
    
#     content_generator = await generate_openai_response_stream(system_prompt, user_input)
#     return StreamingResponse(content_generator(), media_type="text/plain")

@healthcare_router.post("/generate_linkedin_post/stream")
async def generate_post_stream(current_user: dict = Depends(get_current_user)):
    """Streaming version of the final post generation using stored state"""
    # Check if template was selected
    if not healthcare.selected_template:
        raise HTTPException(status_code=400, detail="No template selected. Please select a template first.")
        
    # Get the stored template
    selected_template = healthcare.selected_template
    
    # Get hooks, user_input and selected hook from Healthcare class
    user_hooks_data = healthcare.get_user_hooks(current_user["email"])
    
    if not user_hooks_data:
        raise HTTPException(status_code=400, detail="No hooks generated. Please generate hooks first.")
    
    if "selected_hook_number" not in user_hooks_data:
        raise HTTPException(status_code=400, detail="No hook selected. Please select a hook first.")
    
    # Use stored user input
    user_input = user_hooks_data["user_input"]
    selected_hook_number = user_hooks_data["selected_hook_number"]
    hooks = user_hooks_data["hooks"]
    
    if selected_hook_number < 1 or selected_hook_number > len(hooks):
        raise HTTPException(status_code=400, detail="Invalid hook number")
    
    hook = hooks[selected_hook_number - 1]
    
    # Define post length based on user profile or default to "medium"
    post_length = "500"  # Default value
    if "profile" in current_user and "preferred_post_length" in current_user["profile"]:
        if current_user["profile"]["preferred_post_length"] == "short":
            post_length = "300"
        elif current_user["profile"]["preferred_post_length"] == "medium":
            post_length = "500"
        elif current_user["profile"]["preferred_post_length"] == "long":
            post_length = "800"
    
    # Extract template details
    template = {
        "description": selected_template.description,
        "style": getattr(selected_template, "style", "Professional")  # Default to Professional if not defined
    }
    
    # Enhanced system prompt
    system_prompt = f"""
    You are an AI assistant specialized in generating healthcare-specific LinkedIn posts that captivate and engage healthcare professionals. Use the doctor's spoken topic and the following inputs to craft each post:
    Template description: {template["description"]}
    Selected hook: {hook}
    Style: {template["style"]}
    Target length: {post_length} words
    Follow these guidelines to create a high-impact LinkedIn post:
    Hook: Start with a compelling first line (max. 8 words) that hints at a personal insight or surprising fact to spark curiosity
    Structure: Deliver immediate value in concise paragraphs or list format; keep the post to five or fewer paragraphs
    Insight: Include a credible statistic, myth‑busting fact or reference to a current health trend (e.g. #HealthyEatingWeek, #MentalHealthAwareness) that's relevant to the topic
    Engagement: End the main text with an open-ended question to invite comments and professional discussion, encouraging meaningful interaction
    Hashtags: Select exactly three relevant, timely healthcare hashtags; avoid over-tagging (3–5 hashtags is optimal)
    Tone: Maintain a professional yet conversational tone; weave in warmth or gentle humor when appropriate to humanize the message
    Sources: At the end of the post, after the call to action, include a separate line beginning with "Quellen:" followed by the sources you referenced. List each source explicitly and separate them by semicolons or line breaks.
    Compliance: Do not include any protected health information or identifiable patient details; stay compliant with privacy regulations
    
    IMPORTANT: Return the post in plain text format, not JSON. Include the hashtags at the end of the post.
    
    Use the {hook} naturally in the content and reflect the specified {template["style"]}.
    """
    
    content_generator = await generate_openai_response_stream(system_prompt, user_input)
    return StreamingResponse(content_generator(), media_type="text/plain")

#Save Generated Post
@healthcare_router.post("/posts/save")
async def save_generated_post(
    request: SavePostRequest,
    user=Depends(get_current_user)
):
    """Save the currently generated post with metadata"""
    
    # Get generation context from Healthcare class
    user_hooks_data = healthcare.get_user_hooks(user["email"])
    selected_template = healthcare.selected_template
    
    if not user_hooks_data or not selected_template:
        raise HTTPException(
            status_code=400, 
            detail="No generation context found. Please generate a post first."
        )
    
    # Create post document
    post_data = {
        "user_email": user["email"],
        "content": request.content,
        "created_at": datetime.now(),
        "updated_at": datetime.now(),
        "status": "draft",
        "generation_metadata": {
            "template_name": getattr(selected_template, 'name', 'Unknown'),
            "hook": user_hooks_data["hooks"][user_hooks_data["selected_hook_number"] - 1],
            "user_input": user_hooks_data["user_input"],
            "generated_at": datetime.now()
        },
        "tags": request.tags,
        "character_count": len(request.content)
    }
    
    result = saved_posts_collection.insert_one(post_data)
    
    return {
        "message": "Post saved successfully",
        "post_id": str(result.inserted_id),
        "character_count": len(request.content)
    }

#Update Post
@healthcare_router.put("/posts/{post_id}")
async def update_post(
    post_id: str,
    request: UpdatePostRequest,
    user=Depends(get_current_user)
):
    """Update an existing post"""
    
    try:
        update_data = {"updated_at": datetime.now()}
        
        if request.content is not None:
            update_data["content"] = request.content
            update_data["character_count"] = len(request.content)
            
        if request.tags is not None:
            update_data["tags"] = request.tags
            
        if request.status is not None:
            if request.status not in ["draft", "published", "favorite", "archived"]:
                raise HTTPException(status_code=400, detail="Invalid status")
            update_data["status"] = request.status
        
        result = saved_posts_collection.update_one(
            {"_id": ObjectId(post_id), "user_email": user["email"]},
            {"$set": update_data}
        )
        
        if result.matched_count == 0:
            raise HTTPException(status_code=404, detail="Post not found")
            
        return {"message": "Post updated successfully"}
        
    except Exception as e:
        raise HTTPException(status_code=400, detail="Invalid post ID")

#Delete Post
@healthcare_router.delete("/posts/{post_id}")
async def delete_post(
    post_id: str,
    user=Depends(get_current_user)
):
    """Delete a saved post"""
    
    try:
        result = saved_posts_collection.delete_one({
            "_id": ObjectId(post_id),
            "user_email": user["email"]
        })
        
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Post not found")
            
        return {"message": "Post deleted successfully"}
        
    except Exception as e:
        raise HTTPException(status_code=400, detail="Invalid post ID")
    
# Get all saved posts
@healthcare_router.get("/posts")
async def get_posts(
    status: Optional[str] = None,
    search: Optional[str] = None,
    limit: int = 20,
    offset: int = 0,
    user=Depends(get_current_user)
):
    """Get posts with filtering and pagination"""
    
    # Build query
    query = {"user_email": user["email"]}
    
    if status and status in ["draft", "published", "favorite", "archived"]:
        query["status"] = status
        
    if search:
        query["content"] = {"$regex": search, "$options": "i"}
    
    # Get total count
    total = saved_posts_collection.count_documents(query)
    
    # Get posts with pagination
    cursor = saved_posts_collection.find(query).sort("created_at", -1).skip(offset).limit(limit)
    
    posts = []
    for post in cursor:
        post["_id"] = str(post["_id"])
        posts.append(post)
    
    return {
        "posts": posts,
        "pagination": {
            "total": total,
            "limit": limit,
            "offset": offset,
            "has_more": offset + limit < total
        }
    }
    
# Get Post by ID
@healthcare_router.get("/posts/{post_id}")
async def get_post_by_id(
    post_id: str,
    user=Depends(get_current_user)
):
    """Get a specific post by ID"""
    
    try:
        post = saved_posts_collection.find_one({
            "_id": ObjectId(post_id),
            "user_email": user["email"]
        })
        
        if not post:
            raise HTTPException(status_code=404, detail="Post not found")
        
        post["_id"] = str(post["_id"])
        return post
        
    except Exception as e:
        raise HTTPException(status_code=400, detail="Invalid post ID")

#post status update
@healthcare_router.patch("/posts/{post_id}/status")
async def update_post_status(
    post_id: str,
    status: str = Body(..., embed=True),  # embed=True for single field
    user=Depends(get_current_user)
):
    """Quick status update for a post"""
    
    # Validate status
    valid_statuses = ["draft", "published", "favorite", "archived"]
    if status not in valid_statuses:
        raise HTTPException(
            status_code=400, 
            detail=f"Invalid status. Must be one of: {valid_statuses}"
        )
    
    try:
        result = saved_posts_collection.update_one(
            {"_id": ObjectId(post_id), "user_email": user["email"]},
            {"$set": {"status": status, "updated_at": datetime.now()}}
        )
        
        if result.matched_count == 0:
            raise HTTPException(status_code=404, detail="Post not found")
            
        return {"message": f"Post marked as {status}"}
        
    except Exception as e:
        raise HTTPException(status_code=400, detail="Invalid post ID")

# API Routes for user management
@app.post("/signup")
def signup(user: User):
    user_data = user.dict()
    user_data["bearer_token"] = secrets.token_hex(32)
    if get_user_by_email(user.email):
        raise HTTPException(status_code=400, detail="Email already exists")
    insert_user(user_data)
    return {"message": "User created successfully", "bearer_token": user_data["bearer_token"]}

@app.post("/user-profile")
async def save_user_profile(
    profile_data: UserProfileForm,
    user=Depends(get_current_user)
):
    """Save user profile and preferences for content generation"""
    
    # Update the user document with profile data
    result = users_collection.update_one(
        {"email": user["email"]},
        {"$set": {"profile": profile_data.dict()}}
    )
    
    if result.modified_count == 0:
        raise HTTPException(status_code=400, detail="Failed to save profile data")
    
    return {
        "message": "Profile information saved successfully",
        "email": user["email"]
    }

@app.get("/user-profile")
async def get_user_profile(user=Depends(get_current_user)):
    """Get user's saved profile data"""
    
    if "profile" not in user:
        raise HTTPException(
            status_code=404, 
            detail="Profile not found. Please complete your profile first."
        )
    
    return {
        "profile": user["profile"]
    }
    
@app.post("/login")
def login(login_data: Login):
    user = get_user_by_email(login_data.email)
    if not user or user["password"] != login_data.password:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    # Check if user has a bearer token, generate one if not
    if "bearer_token" not in user or not user["bearer_token"]:
        bearer_token = secrets.token_hex(32)
        users_collection.update_one({"email": login_data.email}, {"$set": {"bearer_token": bearer_token}})
    else:
        bearer_token = user["bearer_token"]
        
    return {"message": "Login successful", "bearer_token": bearer_token}


# @app.post("/Speech-to-text")
# async def STT(audio: UploadFile = File(...)):
#     ALLOWED_AUDIO_EXTENSIONS = ['flac', 'm4a', 'mp3', 'mp4', 'mpeg', 'mpga', 'oga', 'ogg', 'wav', 'webm']
#     if not any(audio.filename.lower().endswith(f".{ext}") for ext in ALLOWED_AUDIO_EXTENSIONS):
#         raise HTTPException(status_code=400, detail=f"Invalid file format. Allowed formats: {ALLOWED_AUDIO_EXTENSIONS}")
#     try:
#         result = speech_to_text(audio)
#         return {"result": result}
#     except Exception as e:
#         return {"error": str(e)}

@app.post("/forgot-password")
def forgot_password(email: str = Body(...)):
    user = users_collection.find_one({"email": email})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    otp = str(random.randint(100000, 999999))
    otp_store[email] = {
        "otp": otp,
        "purpose": "reset_password",
        "created_at": time.time()
    }
    try:
        send_email(email, otp)
    except Exception:
        raise HTTPException(status_code=500, detail="Failed to send email")
    return {"message": "OTP sent to your email"}

@app.post("/reset-password")
def reset_password(email: str = Body(...), new_password: str = Body(...)):
    """
    Reset a user's password after OTP verification.
    
    This endpoint assumes the OTP was already verified using /verify-otp.
    """
    # Look up the user
    user = users_collection.find_one({"email": email})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Generate new bearer token (invalidates all existing sessions)
    new_token = secrets.token_hex(32)
    
    # Update password and token
    users_collection.update_one(
        {"email": email}, 
        {"$set": {"password": new_password, "bearer_token": new_token}}
    )
    
    return {
        "message": "Password reset successful. All devices have been logged out.",
        "bearer_token": new_token
    }
    
@app.post("/change-password")
def change_password(
    old_password: str = Body(...), 
    new_password: str = Body(...), 
    user=Depends(get_current_user)
):
    """Change password endpoint for authenticated users that invalidates all existing sessions"""
    # Verify old password first
    if user["password"] != old_password:
        raise HTTPException(status_code=401, detail="Incorrect current password")
    
    # Generate new bearer token (invalidates all existing sessions)
    new_token = secrets.token_hex(32)
    
    # Update password and token in database
    users_collection.update_one(
        {"email": user["email"]}, 
        {"$set": {"password": new_password, "bearer_token": new_token}}
    )
    
    return {
        "message": "Password changed successfully. All other sessions have been logged out.",
        "bearer_token": new_token
    }

@app.post("/generate-otp")
def generate_otp(email: str = Body(...), purpose: str = Body(...)):
    """
    Generate and send OTP for various purposes.
    """
    # Add validation based on purpose
    if purpose == "signup":
        # For signup, the email should NOT exist in database
        if get_user_by_email(email):
            raise HTTPException(status_code=400, detail="Email already registered. Please login instead.")
    elif purpose in ["login", "reset_password"]:
        # For login or password reset, the email SHOULD exist
        if not get_user_by_email(email):
            raise HTTPException(status_code=404, detail="Account not found. Please sign up first.")
    
    # Generate a 6-digit OTP
    otp = str(random.randint(100000, 999999))
    
    # Store OTP with its purpose and expiration timestamp
    otp_store[email] = {
        "otp": otp,
        "purpose": purpose,
        "created_at": time.time()
    }
    
    # Send OTP via email
    try:
        send_email(email, otp)
        return {"message": f"OTP sent to your email", "purpose": purpose, "expires_in": "5 minutes"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to send email: {str(e)}")

# Actual verify otp logic

# @app.post("/verify-otp")
# def verify_otp(email: str = Body(...), otp: str = Body(...), purpose: str = Body(...)):
#     """
#     Verify an OTP for a specific purpose.
    
#     This endpoint only verifies the OTP but doesn't take any action.
#     Frontend should call appropriate endpoint after successful verification.
    
#     - email: User's email
#     - otp: The OTP to verify
#     - purpose: Why the OTP was sent ("login", "signup", "reset_password", etc.)
#     """
#     # Check if we have an OTP for this email
#     if email not in otp_store:
#         raise HTTPException(status_code=400, detail="No OTP was sent to this email")
    
#     otp_data = otp_store[email]
    
#     # Check if OTP has expired (5 minutes)
#     current_time = time.time()
#     if current_time - otp_data["created_at"] > OTP_EXPIRY_SECONDS:
#         # Remove expired OTP
#         del otp_store[email]
#         raise HTTPException(status_code=400, detail="OTP has expired. Please request a new one.")
    
#     # Check if the purpose matches
#     if otp_data["purpose"] != purpose:
#         raise HTTPException(status_code=400, detail="Invalid OTP purpose")
    
#     # Check if OTP matches
#     if otp_data["otp"] != otp:
#         raise HTTPException(status_code=400, detail="Incorrect OTP")
    
#     # OTP is verified successfully!
#     # Remove the OTP from store (one-time use only)
#     del otp_store[email]
    
#     # Return success response
#     return {
#         "verified": True, 
#         "message": f"OTP verification successful",
#         "purpose": purpose
#     }
    
# fake otp just remove when working
@app.post("/verify-otp")
def verify_otp(email: str = Body(...), otp: str = Body(...), purpose: str = Body(...)):
    """Always verify OTP as successful"""
    # No actual verification - always succeed
    return {
        "verified": True,
        "message": "OTP verification bypassed",
        "purpose": purpose
    }

@app.post("/User-info")
def submit_info(info: str = Body(...), user=Depends(get_current_user)):
    users_collection.update_one({"email": user["email"]}, {"$set": {"user_info": info}})
    updated_user = users_collection.find_one({"email": user["email"]})
    if not updated_user or "bearer_token" not in updated_user:
        raise HTTPException(status_code=404, detail="Bearer token not found")
    return {"message": "Information saved successfully", "bearer_token": updated_user["bearer_token"]}


@app.post("/upload-profile-picture")
async def upload_profile_picture(
    profile_picture: UploadFile = File(...),
    user=Depends(get_current_user)
):
    """Upload a profile picture to Google Cloud Storage"""
    # Validate file type
    ALLOWED_IMAGE_EXTENSIONS = ['jpg', 'jpeg', 'png', 'gif', 'webp']
    file_extension = profile_picture.filename.split(".")[-1].lower()
    
    if file_extension not in ALLOWED_IMAGE_EXTENSIONS:
        raise HTTPException(
            status_code=400, 
            detail=f"Invalid file format. Allowed formats: {', '.join(ALLOWED_IMAGE_EXTENSIONS)}"
        )
    
    # Check if user already has a profile picture in GCS
    if "profile_picture" in user and user["profile_picture"]:
        try:
            # Extract the blob name from the URL
            old_url = user["profile_picture"]
            if "storage.googleapis.com" in old_url:
                # URL format: https://storage.googleapis.com/bucket-name/path/to/file
                old_blob_name = "/".join(old_url.split("/")[4:])
                old_blob = bucket.blob(old_blob_name)
                if old_blob.exists():
                    old_blob.delete()
        except Exception as e:
            print(f"Failed to delete old profile picture: {str(e)}")
    
    # Create a unique filename
    unique_filename = f"{user['email'].split('@')[0]}_{int(time.time())}.{file_extension}"
    blob_name = f"profile_pictures/{unique_filename}"
    
    # Create a new blob in GCS
    blob = bucket.blob(blob_name)
    
    try:
        # Read the file content
        content = await profile_picture.read()
        
        # Check file size
        if len(content) > 5 * 1024 * 1024:  # 5MB
            raise HTTPException(
                status_code=400, 
                detail=f"File too large. Maximum size: 5MB"
            )
        
        # Upload to GCS
        blob.upload_from_string(
            content,
            content_type=f"image/{file_extension}"
        )
        
        # Try to make the blob publicly accessible
        try:
            blob.make_public()
            # Get the public URL from GCS
            gcs_url = blob.public_url
        except Exception as e:
            print(f"Failed to make blob public: {str(e)}")
            # Construct URL manually if make_public fails
            gcs_url = f"https://storage.googleapis.com/{GCS_BUCKET_NAME}/{blob_name}"
        
        # Update user's profile in the database with the GCS URL
        users_collection.update_one(
            {"email": user["email"]}, 
            {"$set": {"profile_picture": gcs_url}}
        )
        
        return {
            "message": "Profile picture uploaded successfully",
            "profile_picture_url": gcs_url
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to upload file: {str(e)}")
    finally:
        await profile_picture.close()

@app.delete("/delete-profile-picture")
async def delete_profile_picture(user=Depends(get_current_user)):
    """Delete the user's profile picture"""
    # Check if user has a profile picture
    if "profile_picture" not in user or not user["profile_picture"]:
        return {"message": "No profile picture to delete"}
    
    # Get the profile picture URL
    profile_picture = user["profile_picture"]
    
    # Delete from GCS - no conditional check needed
    try:
        # Extract the blob name from the URL
        # URL format: https://storage.googleapis.com/bucket-name/path/to/file
        blob_name = "/".join(profile_picture.split("/")[4:])
        blob = bucket.blob(blob_name)
        if blob.exists():
            blob.delete()
    except Exception as e:
        print(f"Failed to delete profile picture from GCS: {str(e)}")
    
    # Remove the profile picture field from the user's record
    users_collection.update_one(
        {"email": user["email"]}, 
        {"$unset": {"profile_picture": ""}}
    )
    
    return {"message": "Profile picture deleted successfully"}

@app.get("/verify-token")
def verify_token(credentials: HTTPAuthorizationCredentials = Depends(security_bearer)):
    """Verify if a bearer token is valid and return basic user information"""
    # Extract token from credentials
    token = credentials.credentials
    
    # Look for a user with this token
    user = users_collection.find_one({"bearer_token": token})
    
    if not user:
        raise HTTPException(
            status_code=401,
            detail="Invalid or expired token",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Get profile picture URL
    profile_picture = user.get("profile_picture", "")
    
    # If profile picture URL is not from GCS but is a local path, create a GCS URL
    if profile_picture and not profile_picture.startswith("http"):
        # Extract just the filename from the path
        filename = profile_picture.split("/")[-1]
        
        # Construct a proper GCS URL with the correct path structure
        profile_picture = f"https://storage.googleapis.com/{GCS_BUCKET_NAME}/profile_pictures/{filename}"
        
        # Also update the database with the correct URL for future requests
        users_collection.update_one(
            {"email": user["email"]},
            {"$set": {"profile_picture": profile_picture}}
        )
    
    # Return user info
    return {
        "valid": True,
        "user": {
            "email": user["email"],
            "name": user.get("name", ""),
            "user_info": user.get("user_info", ""),
            "profile_picture": profile_picture
        }
    }

@app.websocket("/ws/audio")
async def websocket_audio_endpoint(websocket: WebSocket):
    await websocket.accept()
    audio_streams = []
    
    async def ping_client():
        while True:
            try:
                await asyncio.sleep(10)
                await websocket.send_json({"message": "ping"})
            except Exception as e:
                print(f"Ping error: {e}")
                break

    ping_task = asyncio.create_task(ping_client())
    
    try:
        while True:
            try:
                message = await asyncio.wait_for(websocket.receive_json(), timeout=5.0)
                t = time.time()
                stream_bytes = message.get("stream_bytes")
                
                
                if stream_bytes:
                    audio_stream = base64.b64decode(stream_bytes)
                    pcm_data = await pcm_to_wav(audio_stream)
                    audio_streams.append(pcm_data)

                    combined_audio = await combine_audio_streams_with_vad(audio_streams)

                    if combined_audio is not None:
                        transcription = await speech_to_text_with_vad(combined_audio)
                        transcription = transcription.replace("\n", " ").strip()
                        await websocket.send_json({
                            "message": "Transcriptions Generated",
                            "transcription": transcription
                        })
                        print(f"Transcription time: {time.time() - t} seconds")
    
            except asyncio.TimeoutError:
                continue   
            
            except WebSocketDisconnect:
                print("Client disconnected")
                break
            
    except Exception as e:
        print(f"Error in websocket loop: {e}")
        try:
            await websocket.close()
        except:
            pass
    finally:
        ping_task.cancel() 
        audio_streams.clear()

# Include healthcare router
app.include_router(healthcare_router, prefix="/healthcare", tags=["Healthcare"])

REQUEST_COUNT = Counter(
    "http_requests_total", "Total HTTP requests", ["method", "endpoint", "http_status"]
)
REQUEST_LATENCY = Histogram(
    "http_request_duration_seconds", "Request latency", ["method", "endpoint"]
)

@app.middleware("http")
async def prometheus_middleware(request, call_next):
    import time
    start = time.time()
    response = await call_next(request)
    REQUEST_COUNT.labels(request.method, request.url.path, response.status_code).inc()
    REQUEST_LATENCY.labels(request.method, request.url.path).observe(time.time() - start)
    return response

Instrumentator().instrument(app).expose(app, endpoint="/metrics", include_in_schema=False)


# Run app
if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=False)

