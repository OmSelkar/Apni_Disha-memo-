from flask import Blueprint, request, jsonify
from services.connectDB import connect_db
from bson import ObjectId

college_routes = Blueprint("college_routes", __name__)

def serialize(doc):
    doc["_id"] = str(doc["_id"])
    return doc

@college_routes.route("/colleges", methods=["GET"])
def get_colleges():
    db = connect_db()
    colleges = list(db.College.find())
    colleges = [serialize(c) for c in colleges]
    return jsonify(colleges), 200

@college_routes.route("/colleges", methods=["POST"])
def add_college():
    db = connect_db()
    data = request.json
    result = db.College.insert_one(data)
    return jsonify({"id": str(result.inserted_id)}), 201
