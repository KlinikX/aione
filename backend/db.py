# db.py
from pymongo import MongoClient
import os

# MongoDB connection
MONGO_CONNECTION_STRING = os.getenv("MONGO_CONNECTION_STRING")
client = MongoClient(MONGO_CONNECTION_STRING)
db = client["AI-Linkedin"]
users_collection = db["users"]

# Helper function to fetch user from the database
def get_user_by_email(email: str):
    return users_collection.find_one({"email": email})


# Helper function to insert a user into the database
def insert_user(user_data: dict):
    users_collection.insert_one(user_data)

# Helper function to update user data
def update_user(email: str, update_data: dict):
    users_collection.update_one({"email": email}, {"$set": update_data})

