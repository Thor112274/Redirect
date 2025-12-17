import os
import time
import requests
from pymongo import MongoClient


# 🔥 DIRECT MongoDB connection (NO bot imports)
client = MongoClient(os.environ["DATABASE_URL"])
db = client.get_default_database()
short_col = db["shortener_tokens"]


def handler(request):
    try:
        token = request.args.get("token")
        if not token:
            return {"statusCode": 403, "body": "Missing token"}

        data = short_col.find_one({"token": token})
        if not data:
            return {"statusCode": 403, "body": "Invalid token"}

        if time.time() > data["expires_at"]:
            short_col.delete_one({"token": token})
            return {"statusCode": 403, "body": "Token expired"}

        if data.get("used"):
            return {"statusCode": 403, "body": "Token already used"}

        # one-time token
        short_col.update_one(
            {"token": token},
            {"$set": {"used": True}}
        )

        # follow shortener redirect
        r = requests.get(data["url"], allow_redirects=True, timeout=10)

        return {
            "statusCode": 302,
            "headers": {"Location": r.url}
        }

    except Exception as e:
        return {
            "statusCode": 500,
            "body": f"Internal error"
}
