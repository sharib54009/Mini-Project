from flask import Flask, request, jsonify, session
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
from sqlalchemy import JSON

app = Flask(__name__)
CORS(app)

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///users.db'
app.config['SECRET_KEY'] = '123456789'

db = SQLAlchemy(app)

# USER TABLE
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), nullable=False)
    age = db.Column(db.Integer, nullable=False)
    Phone = db.Column(db.String(20), unique=True, nullable=False)
    password = db.Column(db.String(120), nullable=False)
    gender = db.Column(db.String(10), nullable=False)

# USER DETAILS TABLE
class UserDetails(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    skinType = db.Column(db.String(20), nullable=False)
    skinProblems = db.Column(JSON, nullable=False)

# SIGNUP ROUTE
@app.route('/signup', methods=['POST'])
def signup():
    data = request.json

    name = data.get('name')
    age = data.get('age')
    Phone = data.get('Phone')
    password = data.get('password')
    gender = data.get('gender')

    if not name or not Phone or not password:
        return jsonify({'message': 'Missing fields'}), 400

    existing_user = User.query.filter_by(Phone=Phone).first()
    if existing_user:
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

    return jsonify({
        'message': 'User created successfully',
        'user_id': new_user.id
    }), 201


# SAVE SKIN DATA
@app.route('/userdetails', methods=['POST'])
def userdetails():
    data = request.json

    user_id = data.get('user_id')
    skinType = data.get('skinType')
    skinProblems = data.get('skinProblems')

    if not user_id:
        return jsonify({'message': 'User ID missing'}), 400

    new_details = UserDetails(
        user_id=user_id,
        skinType=skinType,
        skinProblems=skinProblems
    )

    db.session.add(new_details)
    db.session.commit()

    return jsonify({'message': 'User details saved successfully'}), 201


# LOGIN ROUTE
@app.route('/login', methods=['POST'])
def login():
    data = request.json

    Phone = data.get('Phone')
    password = data.get('password')

    if not password:
        return jsonify({'message': 'Password missing'}), 400

    if not Phone:
        return jsonify({'message': 'Phone missing'}), 400

    user = User.query.filter_by(Phone=Phone).first()

    if user and check_password_hash(user.password, password):
        session['user_id'] = user.id
        session['name'] = user.name
        
        print(f"User {session['name']} logged in successfully.")

        return jsonify({
            'message': 'Login successful',
            'user_id': user.id
        }), 200
    else:
        return jsonify({'message': 'Invalid credentials'}), 401


# ✅ ADD THIS ROUTE (ONLY NEW ADDITION)
@app.route('/user/<int:user_id>', methods=['GET'])
def get_user(user_id):
    user = db.session.get(User, user_id)

    if not user:
        return jsonify({'message': 'User not found'}), 404

    return jsonify({
        'name': user.name
    }), 200

#recommendation
@app.route('/recommendation', methods=['GET'])
def recommendation():
    #getting user id from session to get specific user details
    user_id  = session.get('user_id')
    
    if not user_id:
        return jsonify({'message': 'User not logged in'}), 401
    #getting user data and details from database using user id
    user_data=user.query.get(user_id)
    details=user_details.query.filter_by(user_id=user_id).first()
    
    if not details:
        return jsonify({'message': 'User details not found'}), 404
    #after getting details we filter data according to user details and give recommendation to user
    username=user_data.username
    skin_type=details.skin_type
    concerns=details.concerns
    
    #filtering data according to user details and give recommendation to user
    filtered = df[df["skin_type"] == skin_type]
    for c in concerns:
        col = f"concerns.{c}"
        if col in filtered.columns:
            filtered = filtered[filtered[col] == True]
    
    filtered_data=filtered.to_dict(orient='records')
    return jsonify({'username': username, 'skin_type': skin_type, 'concerns': concerns, 'recommendations': filtered_data}), 200 



if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True)
