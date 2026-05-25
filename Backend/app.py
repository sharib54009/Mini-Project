from flask import Flask, request, jsonify, session
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import (
    generate_password_hash,
    check_password_hash
)
from sqlalchemy import JSON
from datetime import datetime
import json
import os
import secrets

# =========================
# APP
# =========================

app = Flask(__name__)

CORS(
    app,
    supports_credentials=True,
    origins=["http://localhost:5173"]
)

# =========================
# CONFIG
# =========================

app.config['SQLALCHEMY_DATABASE_URI'] = (
    'sqlite:///users.db'
)

app.config['SECRET_KEY'] = (
    secrets.token_hex(16)
)

db = SQLAlchemy(app)

# =========================
# LOAD JSON
# =========================

def load_data(file_name):

    base_dir = os.path.dirname(__file__)

    file_path = os.path.join(
        base_dir,
        file_name
    )

    with open(
        file_path,
        'r',
        encoding='utf-8'
    ) as file:

        return json.load(file)


data = load_data('maindata.json')

# =========================
# MODELS
# =========================

class User(db.Model):

    id = db.Column(
        db.Integer,
        primary_key=True
    )

    name = db.Column(
        db.String(80),
        nullable=False
    )

    age = db.Column(
        db.Integer,
        nullable=False
    )

    Phone = db.Column(
        db.String(20),
        unique=True,
        nullable=False
    )

    password = db.Column(
        db.String(120),
        nullable=False
    )

    gender = db.Column(
        db.String(10),
        nullable=False
    )


class UserDetails(db.Model):

    id = db.Column(
        db.Integer,
        primary_key=True
    )

    user_id = db.Column(
        db.Integer,
        db.ForeignKey('user.id'),
        nullable=False
    )

    skinType = db.Column(
        db.String(20),
        nullable=False
    )

    skinProblems = db.Column(
        JSON,
        nullable=False
    )


class Product(db.Model):

    id = db.Column(
        db.Integer,
        primary_key=True
    )

    user_id = db.Column(
        db.Integer,
        db.ForeignKey('user.id'),
        nullable=False
    )

    name = db.Column(
        db.String(100),
        nullable=False
    )

    type = db.Column(
        db.String(100),
        nullable=False
    )


class RoutineLog(db.Model):

    id = db.Column(
        db.Integer,
        primary_key=True
    )

    user_id = db.Column(
        db.Integer,
        db.ForeignKey('user.id'),
        nullable=False
    )

    date = db.Column(
        db.String(30),
        nullable=False
    )

    routine_type = db.Column(
        db.String(20),
        nullable=False
    )

    completed_steps = db.Column(
        db.Integer,
        nullable=False
    )

    completed_indexes = db.Column(
    JSON,
    nullable=False
)

    total_steps = db.Column(
        db.Integer,
        nullable=False
    )

    completion_percentage = db.Column(
        db.Float,
        nullable=False
    )

    created_at = db.Column(
        db.DateTime,
        default=datetime.utcnow
    )

# =========================
# PRODUCT KEYWORDS
# =========================

PRODUCT_KEYWORDS = {

    "cleanser": [
        "cleanser",
        "face wash",
        "foaming",
        "gel cleanser",
        "hydrating cleanser"
    ],

    "moisturizer": [
        "moisturizer",
        "cream",
        "night cream"
    ],

    "sunscreen": [
        "sunscreen",
        "spf",
        "mineral sunscreen"
    ],

    "serum": [
        "serum"
    ],

    "exfoliant": [
        "bha",
        "aha",
        "exfoliation",
        "exfoliant"
    ]
}

# =========================
# HOME
# =========================

@app.route('/', methods=['GET'])
def home():

    return jsonify({
        'message': 'API is running'
    }), 200

# =========================
# SIGNUP
# =========================

@app.route('/signup', methods=['POST'])
def signup():

    data_req = request.json

    name = data_req.get('name')

    age = data_req.get('age')

    Phone = data_req.get('Phone')

    password = data_req.get('password')

    gender = data_req.get('gender')

    if not name or not Phone or not password:

        return jsonify({
            'message': 'Missing fields'
        }), 400

    existing_user = User.query.filter_by(
        Phone=Phone
    ).first()

    if existing_user:

        return jsonify({
            'message': 'User already exists'
        }), 400

    hashed_password = (
        generate_password_hash(
            password
        )
    )

    new_user = User(

        name=name,

        age=age,

        Phone=Phone,

        password=hashed_password,

        gender=gender
    )

    db.session.add(new_user)

    db.session.commit()

    return jsonify({
        'message': 'Signup successful',
        'user_id': new_user.id
    }), 201

# =========================
# USER DETAILS
# =========================

@app.route('/userdetails', methods=['POST'])
def userdetails():

    data_req = request.json

    user_id = data_req.get(
        'user_id'
    )

    skinType = data_req.get(
        'skinType'
    )

    skinProblems = data_req.get(
        'skinProblems'
    )

    if not user_id:

        return jsonify({
            'message': 'User ID missing'
        }), 400

    skinType = skinType.strip().lower()

    skinProblems = [

        p.strip().lower().replace(
            " ",
            "_"
        )

        for p in skinProblems
    ]

    existing_details = (
        UserDetails.query.filter_by(
            user_id=user_id
        ).first()
    )

    if existing_details:

        existing_details.skinType = (
            skinType
        )

        existing_details.skinProblems = (
            skinProblems
        )

    else:

        new_details = UserDetails(

            user_id=user_id,

            skinType=skinType,

            skinProblems=skinProblems
        )

        db.session.add(new_details)

    db.session.commit()

    return jsonify({
        'message':
            'User details saved'
    }), 201

# =========================
# LOGIN
# =========================

@app.route('/login', methods=['POST'])
def login():

    data_req = request.json

    Phone = data_req.get('Phone')

    password = data_req.get('password')

    user = User.query.filter_by(
        Phone=Phone
    ).first()

    if (
        user and
        check_password_hash(
            user.password,
            password
        )
    ):

        session['user_id'] = user.id

        return jsonify({
            'message':
                'Login successful',

            'user_id':
                user.id
        }), 200

    return jsonify({
        'message':
            'Invalid credentials'
    }), 401

# =========================
# GET USER
# =========================

@app.route('/user/<int:user_id>')
def get_user(user_id):

    user = db.session.get(
        User,
        user_id
    )

    if not user:

        return jsonify({
            'message':
                'User not found'
        }), 404

    return jsonify({
        'name':
            user.name
    }), 200

# =========================
# RECOMMENDATION
# =========================

@app.route(
    '/recommendation/<int:user_id>/<string:time_key>',
    methods=['GET']
)

def get_recommendation(
    user_id,
    time_key
):

    try:

        details = (
            UserDetails.query.filter_by(
                user_id=user_id
            ).first()
        )

        if not details:

            return jsonify({
                'message':
                    'No routine found'
            }), 404

        skin_type = (
            details.skinType
        )

        user_concerns = (
            details.skinProblems
        )

        matched = None

        for item in data:

            if (
                item.get("skin_type")
                != skin_type
            ):

                continue

            item_concerns = item.get(
                "concerns",
                {}
            )

            for concern in user_concerns:

                if (
                    concern
                    in item_concerns
                    and item_concerns[
                        concern
                    ] == True
                ):

                    matched = item

                    break

            if matched:
                break

        if not matched:

            return jsonify({
                'message':
                    'No routine found'
            }), 404

        routine_data = matched.get(
            "routine",
            {}
        )

        routine_data_lower = {

            k.lower(): v

            for k, v
            in routine_data.items()
        }

        time_key_lower = (
            time_key.lower()
        )

        if (
            time_key_lower == "evening"
            and "night"
            in routine_data_lower
        ):

            routine = (
                routine_data_lower["night"]
            )

        else:

            routine = (
                routine_data_lower.get(
                    time_key_lower,
                    []
                )
            )

        if not routine:

            return jsonify({
                'message':
                    'No routine found'
            }), 404

        user_products = (
            Product.query.filter_by(
                user_id=user_id
            ).all()
        )

        product_map = {}

        for product in user_products:

            product_map[
                product.type.lower()
            ] = product.name

        updated_routine = []

        for step in routine:

            new_step = step

            step_lower = (
                step.lower()
            )

            for (
                product_type,
                product_name
            ) in product_map.items():

                keywords = (
                    PRODUCT_KEYWORDS.get(
                        product_type.lower(),
                        []
                    )
                )

                matched_keyword = False

                for keyword in keywords:

                    if (
                        keyword.lower()
                        in step_lower
                    ):

                        matched_keyword = True

                        if "→" in step:

                            explanation = (
                                step.split("→")[1]
                            )

                            new_step = (
                                f"{product_name} → "
                                f"{explanation}"
                            )

                        elif "->" in step:

                            explanation = (
                                step.split("->")[1]
                            )

                            new_step = (
                                f"{product_name} -> "
                                f"{explanation}"
                            )

                        else:

                            new_step = (
                                product_name
                            )

                        break

                if matched_keyword:
                    break

            updated_routine.append(
                new_step
            )

        return jsonify({
            'routine':
                updated_routine
        }), 200

    except Exception as e:

        print("ERROR:", e)

        return jsonify({
            'message':
                'Something went wrong',

            'error':
                str(e)
        }), 500

# =========================
# PRODUCTS
# =========================

@app.route(
    '/products',
    methods=['GET', 'POST']
)

def products_page():

    # =====================
    # ADD PRODUCT
    # =====================

    if request.method == 'POST':

        data_req = request.json

        user_id = data_req.get(
            'user_id'
        )

        product_name = data_req.get(
            'product_name'
        )

        product_type = data_req.get(
            'product_type'
        )

        if not user_id:

            return jsonify({
                'message':
                    'User ID missing'
            }), 400

        if (
            not product_name
            or not product_type
        ):

            return jsonify({
                'message':
                    'Missing product details'
            }), 400

        new_product = Product(

            user_id=user_id,

            name=product_name,

            type=product_type
        )

        db.session.add(new_product)

        db.session.commit()

        return jsonify({
            'message':
                'Product added successfully'
        }), 201

    # =====================
    # GET PRODUCTS
    # =====================

    user_id = request.args.get(
        'user_id'
    )

    if not user_id:

        return jsonify({
            'message':
                'User ID missing'
        }), 400

    products = (
        Product.query.filter_by(
            user_id=user_id
        ).all()
    )

    return jsonify({

        'products': [

            {
                'id': p.id,
                'name': p.name,
                'type': p.type
            }

            for p in products
        ]

    }), 200

# =========================
# DELETE PRODUCT
# =========================

@app.route(
    '/products/<int:product_id>',
    methods=['DELETE']
)

def delete_product(product_id):

    product = db.session.get(
        Product,
        product_id
    )

    if not product:

        return jsonify({
            'message':
                'Product not found'
        }), 404

    db.session.delete(product)

    db.session.commit()

    return jsonify({
        'message':
            'Product deleted successfully'
    }), 200

# =========================
# ROUTINE LOG
# =========================

@app.route(
    '/routinelog',
    methods=['POST', 'GET']
)

def routine_log():

    # =====================
    # SAVE LOG
    # =====================

    if request.method == 'POST':

        try:

            data_req = request.json

            user_id = data_req.get(
                'user_id'
            )

            date = data_req.get(
                'date'
            )

            routine_type = data_req.get(
                'routine_type'
            )

            completed_steps = int(
                data_req.get(
                    'completed_steps',
                    0
                )
            )

            completed_indexes = (
    data_req.get(
        'completed_indexes',
        []
    )
)

            total_steps = int(
                data_req.get(
                    'total_steps',
                    0
                )
            )

            if (
                not user_id
                or not date
                or not routine_type
            ):

                return jsonify({
                    'message':
                        'Missing fields'
                }), 400

            # =====================
            # BLOCK FUTURE DATES
            # =====================

            today_date = (
                datetime.now().strftime(
                    "%d/%m/%Y"
                )
            )

            input_date = (
                datetime.strptime(
                    date,
                    "%d/%m/%Y"
                )
            )

            today_obj = (
                datetime.strptime(
                    today_date,
                    "%d/%m/%Y"
                )
            )

            if input_date > today_obj:

                return jsonify({
                    'message':
                        'Future dates not allowed'
                }), 400

            # =====================
            # DON'T SAVE EMPTY
            # =====================

            if completed_steps <= 0:

                return jsonify({
                    'message':
                        'No steps completed'
                }), 200

            # =====================
            # PERCENTAGE
            # =====================

            percentage = 0

            if total_steps > 0:

                percentage = (
                    completed_steps
                    / total_steps
                ) * 100

            # =====================
            # CHECK EXISTING
            # =====================

            existing_log = (
                RoutineLog.query.filter_by(

                    user_id=user_id,

                    date=date,

                    routine_type=routine_type

                ).first()
            )

            # =====================
            # UPDATE EXISTING
            # =====================

            if existing_log:

                existing_log.completed_steps = (
                    completed_steps
                )

                existing_log.completed_indexes = (
                    completed_indexes
                )

                existing_log.total_steps = (
                    total_steps
                )

                existing_log.completion_percentage = (
                    percentage
                )

            # =====================
            # CREATE NEW
            # =====================

            else:

                new_log = RoutineLog(

                    user_id=user_id,

                    date=date,

                    routine_type=routine_type,

                    completed_steps=completed_steps,

                    total_steps=total_steps,

                    completion_percentage=percentage,
                    
                    completed_indexes=completed_indexes
                )

                db.session.add(new_log)

            db.session.commit()

            return jsonify({
                'message':
                    'Routine log saved'
            }), 201

        except Exception as e:

            print(e)

            return jsonify({
                'message':
                    'Something went wrong',

                'error':
                    str(e)
            }), 500

    # =====================
    # GET LOGS
    # =====================

    try:

        user_id = request.args.get(
            'user_id'
        )

        if not user_id:

            return jsonify({
                'message':
                    'User ID missing'
            }), 400

        logs = (
            RoutineLog.query.filter_by(
                user_id=user_id
            ).all()
        )

        output = []

        for log in logs:

            output.append({

                'id':
                    log.id,

                'date':
                    log.date,

                'routine_type':
                    log.routine_type,

                'completed_steps':
                    log.completed_steps,

                'total_steps':
                    log.total_steps,
                
                'completed_indexes':
                    log.completed_indexes,

                'completion_percentage':
                    log.completion_percentage,

                'completed_indexes':
                    log.completed_indexes,

                'created_at':
                    log.created_at.strftime(
                        "%Y-%m-%d %H:%M:%S"
                    )
            })

        return jsonify({
            'logs': output
        }), 200

    except Exception as e:

        print(e)

        return jsonify({
            'message':
                'Something went wrong',

            'error':
                str(e)
        }), 500

# =========================
# COMPLETED DATES
# =========================

@app.route(
    '/completed-dates/<int:user_id>'
)

def completed_dates(user_id):

    logs = (
        RoutineLog.query.filter_by(
            user_id=user_id
        ).all()
    )

    unique_dates = list(set(
        [log.date for log in logs]
    ))

    return jsonify({
        'dates':
            unique_dates
    }), 200


# =========================
# GET PROFILE
# =========================

@app.route(
    '/profile/<int:user_id>',
    methods=['GET']
)

def get_profile(user_id):

    try:

        user = db.session.get(
            User,
            user_id
        )

        details = (
            UserDetails.query.filter_by(
                user_id=user_id
            ).first()
        )

        if not user or not details:

            return jsonify({
                'message':
                    'Profile not found'
            }), 404

        return jsonify({

            'name':
                user.name,

            'age':
                user.age,

            'Phone':
                user.Phone,

            'gender':
                user.gender,

            'skinType':
                details.skinType,

            'skinProblems':
                details.skinProblems

        }), 200

    except Exception as e:

        print(e)

        return jsonify({

            'message':
                'Something went wrong',

            'error':
                str(e)

        }), 500


# =========================
# UPDATE PROFILE
# =========================

@app.route(
    '/profile/update',
    methods=['PUT']
)

def update_profile():

    try:

        data_req = request.json

        user_id = data_req.get(
            'user_id'
        )

        if not user_id:

            return jsonify({
                'message':
                    'User ID missing'
            }), 400

        user = db.session.get(
            User,
            user_id
        )

        details = (
            UserDetails.query.filter_by(
                user_id=user_id
            ).first()
        )

        if not user or not details:

            return jsonify({
                'message':
                    'Profile not found'
            }), 404

        # =====================
        # USER TABLE
        # =====================

        user.name = data_req.get(
            'name',
            user.name
        )

        user.age = data_req.get(
            'age',
            user.age
        )

        user.gender = data_req.get(
            'gender',
            user.gender
        )

        # =====================
        # USER DETAILS TABLE
        # =====================

        skinType = data_req.get(
            'skinType',
            details.skinType
        )

        skinProblems = data_req.get(
            'skinProblems',
            details.skinProblems
        )

        details.skinType = (
            skinType.strip().lower()
        )

        details.skinProblems = [

            p.strip().lower().replace(
                " ",
                "_"
            )

            for p in skinProblems
        ]

        db.session.commit()

        return jsonify({

            'message':
                'Profile updated successfully'

        }), 200

    except Exception as e:

        print(e)

        return jsonify({

            'message':
                'Something went wrong',

            'error':
                str(e)

        }), 500

# =========================
# RUN
# =========================

if __name__ == '__main__':

    with app.app_context():
        db.create_all()

    print("🚀 Server running...")

    app.run(debug=True)