import os
import time
from pymongo import MongoClient


# MongoDB connection (direct, no bot imports)
client = MongoClient(os.environ.get("DATABASE_URL"))
db = client.get_default_database()
short_col = db["shortener_tokens"]


def handler(request):
    token = request.args.get("token")

    if not token:
        return {
            "statusCode": 403,
            "body": "Missing token"
        }

    data = short_col.find_one({"token": token})
    if not data:
        return {
            "statusCode": 403,
            "body": "Invalid token"
        }

    # expiry check
    if time.time() > data.get("expires_at", 0):
        short_col.delete_one({"token": token})
        return {
            "statusCode": 403,
            "body": "Token expired"
        }

    # one-time usage
    if data.get("used"):
        return {
            "statusCode": 403,
            "body": "Token already used"
        }

    short_col.update_one(
        {"token": token},
        {"$set": {"used": True}}
    )

    # 🚀 IMPORTANT: redirect directly to shortener
    return {
        "statusCode": 302,
        "headers": {
            "Location": data["url"]
        }
    }
