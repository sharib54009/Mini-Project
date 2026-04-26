from flask import Flask, request, jsonify, session
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
from sqlalchemy import JSON
import json
import os

app = Flask(__name__)
CORS(app)

# LOAD JSON
def load_data(file_name):
    base_dir = os.path.dirname(__file__)
    file_path = os.path.join(base_dir, file_name)
    with open(file_path, 'r', encoding='utf-8') as file:
        return json.load(file)

data = load_data('maindata.json')

# CONFIG
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///users.db'
app.config['SECRET_KEY'] = '123456789'

db = SQLAlchemy(app)

# =========================
# MODELS
# =========================

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), nullable=False)
    age = db.Column(db.Integer, nullable=False)
    Phone = db.Column(db.String(20), unique=True, nullable=False)
    password = db.Column(db.String(120), nullable=False)
    gender = db.Column(db.String(10), nullable=False)


class UserDetails(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    skinType = db.Column(db.String(20), nullable=False)
    skinProblems = db.Column(JSON, nullable=False)

# =========================
# ROUTES
# =========================

# SIGNUP
@app.route('/signup', methods=['POST'])
def signup():
    data_req = request.json

    name = data_req.get('name')
    age = data_req.get('age')
    Phone = data_req.get('Phone')
    password = data_req.get('password')
    gender = data_req.get('gender')

    if not name or not Phone or not password:
        return jsonify({'message': 'Missing fields'}), 400

    if User.query.filter_by(Phone=Phone).first():
        return jsonify({'message': 'User already exists'}), 400

    new_user = User(
        name=name,
        age=age,
        Phone=Phone,
        password=generate_password_hash(password),
        gender=gender
    )

    db.session.add(new_user)
    db.session.commit()

    return jsonify({'user_id': new_user.id}), 201


# USER DETAILS (✅ FIXED HERE)
@app.route('/userdetails', methods=['POST'])
def userdetails():
    data_req = request.json

    user_id = data_req.get('user_id')
    skinType = data_req.get('skinType')
    skinProblems = data_req.get('skinProblems')

    if not user_id:
        return jsonify({'message': 'User ID missing'}), 400

    # ✅ NORMALIZE DATA (CRITICAL FIX)
    skinType = skinType.strip().lower()
    skinProblems = [
        p.strip().lower().replace(" ", "_") for p in skinProblems
    ]

    new_details = UserDetails(
        user_id=user_id,
        skinType=skinType,
        skinProblems=skinProblems
    )

    db.session.add(new_details)
    db.session.commit()

    return jsonify({'message': 'User details saved'}), 201


# LOGIN
@app.route('/login', methods=['POST'])
def login():
    data_req = request.json

    Phone = data_req.get('Phone')
    password = data_req.get('password')

    user = User.query.filter_by(Phone=Phone).first()

    if user and check_password_hash(user.password, password):
        session['user_id'] = user.id
        return jsonify({'user_id': user.id}), 200

    return jsonify({'message': 'Invalid credentials'}), 401


# GET USER
@app.route('/user/<int:user_id>', methods=['GET'])
def get_user(user_id):
    user = db.session.get(User, user_id)

    if not user:
        return jsonify({'message': 'User not found'}), 404

    return jsonify({'name': user.name}), 200


# RECOMMENDATION (✅ CLEAN FINAL VERSION)
@app.route('/recommendation/<int:user_id>/<string:time>', methods=['GET'])
def recommendation(user_id, time):

    user_data = db.session.get(User, user_id)
    details = UserDetails.query.filter_by(user_id=user_id).first()

    if not user_data or not details:
        return jsonify({'message': 'No routine found'}), 404

    skin_type = details.skinType
    user_concerns = details.skinProblems

    matched = None

    for item in data:
        if item.get("skin_type") != skin_type:
            continue

        item_concerns = item.get("concerns", {})

        for c in user_concerns:
            if c in item_concerns and item_concerns[c] == True:
                matched = item
                break

        if matched:
            break

    if not matched:
        return jsonify({'message': 'No routine found'}), 404

    routine_data = matched.get("routine", {})
    routine_data_lower = {k.lower(): v for k, v in routine_data.items()}

    time_key = time.lower()

    # handle evening/night mismatch
    if time_key == "evening" and "night" in routine_data_lower:
        routine = routine_data_lower["night"]
    else:
        routine = routine_data_lower.get(time_key, [])

    if not routine:
        return jsonify({'message': 'No routine found'}), 404

    return jsonify({
        "routine": routine
    }), 200


# RUN
if __name__ == '__main__':
    with app.app_context():
        db.create_all()

    print("🚀 Server running...")
    app.run(debug=True)