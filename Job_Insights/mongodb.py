from pymongo import MongoClient

client = MongoClient("mongodb://localhost:27017/")
db = client["jobinsight"]

# jobs collection
collection = db["newjobs"]

# users collection
users_collection = db["users"]

def insert_jobs(jobs):
    if not jobs:
        return
    if isinstance(jobs, list):
        collection.insert_many(jobs)
    else:
        collection.insert_one(jobs)

def find_jobs(title=None, company=None, limit=10):
    query = {}
    if title:
        query["title"] = {"$regex": title, "$options": "i"}
    if company:
        query["company"] = {"$regex": company, "$options": "i"}
    cursor = (
        collection
        .find(query, {"_id": 0})
        .sort([("_id", -1)])
        .limit(limit)
    )
    return list(cursor)

def insert_user(user):
    users_collection.update_one(
        {"email": user["email"]},
        {"$set": {"name": user["name"], "email": user["email"]}},
        upsert=True
    )

def get_user(email):
    return users_collection.find_one({"email": email}, {"_id": 0})
