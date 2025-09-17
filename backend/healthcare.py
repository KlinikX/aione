import openai
import os
import json
import secrets
from fastapi import HTTPException, Depends
from pydantic import BaseModel
from utils import generate_openai_response, generate_openai_response_stream, client_openai  # Add client_openai import here
from db import get_user_by_email, insert_user, update_user
import random
import smtplib
from email.mime.text import MIMEText
from dotenv import load_dotenv
from pymongo import MongoClient


# Load environment variables from .env file
load_dotenv()

# MongoDB connection
MONGO_CONNECTION_STRING = os.getenv("MONGO_CONNECTION_STRING")
client = MongoClient(MONGO_CONNECTION_STRING)
db = client["AI-Linkedin"]
users_collection = db["users"]

# Email credentials
EMAIL_ADDRESS = os.getenv("EMAIL_ADDRESS")
EMAIL_PASSWORD = os.getenv("EMAIL_PASSWORD")

# OTP store - Add in-memory OTP store for password reset
otp_store = {}  # {email: otp}

# Models for user and login
class HookRequest(BaseModel):
    user_input: str

class User(BaseModel):
    name: str
    email: str
    password: str
    mobile: str

class Login(BaseModel):
    email: str
    password: str

class Template:
    def __init__(self, number, name, description, style, post_length):
        self.number = number
        self.name = name
        self.description = description
        self.style = style
        self.post_length = post_length

# Healthcare class to handle templates
class Healthcare:
    def __init__(self):
        self.templates = {
            "Standard": Template(1, "Standard", "This template focuses on employee retention in healthcare, addressing the revolving door problem in the healthcare industry. The content should emphasize the importance of retaining top healthcare professionals and why it's crucial to avoid burnout.", "Standard", 300),
            "Formatted": Template(2, "Formatted", "This template addresses toxic work cultures in healthcare. It should highlight the negative effects of toxic work environments on healthcare professionals and suggest ways to mitigate them, such as promoting work-life balance and offering proper support.", "Formatted", 500),
            "Chunky": Template(3, "Chunky", "This template is centered on healthcare branding. It should emphasize that a healthcare brand is not just about the logo, but the emotional connection with patients and professionals, and the values the organization promotes.", "Chunky", 400),
            "Short": Template(4, "Short", "This template is for brief but impactful messages, focusing on employee retention and ways to keep top healthcare talent motivated and engaged in their work.", "Short", 150),
            "Emojis": Template(5, "Emojis", "This template incorporates emojis to make the content more engaging and lighthearted. The focus should be on the key qualities needed in healthcare professionals and why long-term investment in talent matters.", "Emojis", 200),
        }
        self.selected_template = None
        # Add a dictionary to store user hooks
        self.user_hooks = {}  # {email: {"hooks": [...], "user_input": "...", "selected_hook_number": n}}

    def select_template(self, template_number: int):
        selected_template = list(self.templates.values())[template_number - 1]
        self.selected_template = selected_template
        return f"Template '{selected_template.name}' selected successfully."

    async def generate_linkedin_post(self, user_input: str, selected_hook: str):
        if not self.selected_template:
            raise HTTPException(status_code=400, detail="No template selected")

        system_prompt = f"""
        Generate a LinkedIn post based on the following template: '{self.selected_template.description}',
        with the following selected hook: '{selected_hook}'.
        The post should be SEO-friendly, engaging, and relevant to healthcare professionals.
        The post should be approximately {self.selected_template.post_length} words long.
        """

        post = await generate_openai_response(system_prompt, user_input)
        try:
            return json.loads(post)
        except json.JSONDecodeError:
            return {"error": "Failed to parse response into valid JSON format", "raw_response": post}

    async def generate_hooks(self, user_input, user_email=None):
        """Generate hooks and optionally store them for a specific user"""
        system_prompt = "You are an AI assistant for generating catchy hooks for healthcare-specific LinkedIn posts."
        user_prompt = f"""
        Based solely on the following user input: '{user_input}',
        generate 5 catchy hooks that are engaging, relevant, and tailored for healthcare professionals.
        Output only the hooks in a valid JSON array format: ({{"hooks":["hook1", "hook2", "hook3", "hook4", "hook5"]}}).
        Do not include any explanation, leading/trailing quotes, or extra text—just the JSON array.
        """
        
        # Generate hooks using OpenAI
        hooks = []
        try:
            response = await client_openai.chat.completions.create(
                model="gpt-4o",
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt}
                ],
                temperature=0.7,
                max_tokens=300
            )
            # Parse hooks from response
            text = response.choices[0].message.content.strip().split("(")[-1].split(")")[0]

            hooks = json.loads(text).get("hooks", [])
            hooks = hooks[:5]  # Ensure we don't return more than 5 hooks
            
            # Store hooks if user_email is provided
            if user_email:
                self.user_hooks[user_email] = {
                    "hooks": hooks,
                    "user_input": user_input
                }
                
        except Exception as e:
            # Handle any errors
            print(f"Error generating hooks: {str(e)}")
            
        return hooks
    
    def select_hook(self, user_email, hook_number):
        """Select a hook for a specific user"""
        if user_email not in self.user_hooks:
            return False
        
        hooks = self.user_hooks[user_email]["hooks"]
        if hook_number < 1 or hook_number > len(hooks):
            return False
            
        self.user_hooks[user_email]["selected_hook_number"] = hook_number
        return True
    
    def get_user_hooks(self, user_email):
        """Get hooks stored for a specific user"""
        return self.user_hooks.get(user_email, None)

# Function to send email for OTP
# def send_email(to_email, otp):
#     subject = "Your OTP for Password Reset"
#     body = f"Your OTP is: {otp}"
#     msg = MIMEText(body)
#     msg['Subject'] = subject
#     msg['From'] = EMAIL_ADDRESS
#     msg['To'] = to_email

#     with smtplib.SMTP_SSL('smtp.gmail.com', 467) as smtp:
#         smtp.login(EMAIL_ADDRESS, EMAIL_PASSWORD)
#         smtp.send_message(msg)
        
# (Remove it when otp working)
def send_email(to_email, otp):
    """
    Bypassed version - doesn't actually send emails
    but prints the OTP to console and always succeeds
    """
    print(f"[BYPASSED EMAIL] To: {to_email}, OTP: {otp}")
    # No actual email is sent, but the function returns successfully
    return True

# MongoDB Operations (add/update user, etc.)
def get_user_by_email(email):
    return users_collection.find_one({"email": email})

def insert_user(user_data):
    users_collection.insert_one(user_data)

def update_user(email, update_data):
    users_collection.update_one({"email": email}, {"$set": update_data})


