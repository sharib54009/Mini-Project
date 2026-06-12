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
    supports_credentials=True
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

            completed_indexes = data_req.get('completed_indexes', [])
            # ensure completed_indexes is a list of ints
            if isinstance(completed_indexes, str):
                try:
                    completed_indexes = json.loads(completed_indexes)
                except Exception:
                    completed_indexes = []

            if not isinstance(completed_indexes, list):
                completed_indexes = []

            total_steps = int(
                data_req.get(
                    'total_steps',
                    0
                )
            )

            # normalize routine_type and date formatting to avoid duplicates
            if isinstance(routine_type, str):
                routine_type = routine_type.strip().lower()

            if isinstance(date, str):
                date = date.strip()

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

            if completed_steps < 0:

                return jsonify({
                    'message':
                        'Invalid completed steps'
                }), 400

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
            ).order_by(RoutineLog.id.desc()).all()
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
# SKIN LOG
# =========================

@app.route(
    '/skinlog/<int:user_id>',
    methods=['GET']
)

def get_skinlog(user_id):

    try:

        # =====================
        # FETCH USER DETAILS
        # =====================

        user_details = (
            UserDetails.query.filter_by(
                user_id=user_id
            ).first()
        )

        if not user_details:

            return jsonify({
                'message':
                    'User details not found'
            }), 404

        skin_problems = (
            user_details.skinProblems or []
        )

        # =====================
        # FETCH ROUTINE LOGS
        # =====================

        all_logs = (
            RoutineLog.query.filter_by(
                user_id=user_id
            ).order_by(RoutineLog.created_at.desc()).all()
        )

        # =====================
        # GET LAST 7 DAYS DATA
        # =====================

        today = datetime.now()
        seven_days_ago = today - \
            __import__('datetime').timedelta(days=7)

        logs_last_7_days = [
            log for log in all_logs
            if datetime.strptime(
                log.date,
                "%d/%m/%Y"
            ) >= seven_days_ago
        ]

        # =====================
        # CALCULATE METRICS
        # =====================

        # Weekly Completion %
        total_completion = 0
        if logs_last_7_days:
            total_completion = sum(
                [log.completion_percentage
                 for log in logs_last_7_days]
            ) / len(logs_last_7_days)

        # Active Days (unique dates in last 7 days)
        unique_dates_last_7 = list(set(
            [log.date for log in logs_last_7_days]
        ))
        active_days = len(unique_dates_last_7)

        # =====================
        # CALCULATE STREAK
        # =====================

        streak = 0
        if logs_last_7_days:
            sorted_logs = sorted(
                logs_last_7_days,
                key=lambda x: datetime.strptime(
                    x.date,
                    "%d/%m/%Y"
                ),
                reverse=True
            )

            unique_dates_sorted = list(set(
                [log.date for log in sorted_logs]
            ))

            dates_as_datetime = [
                datetime.strptime(date, "%d/%m/%Y")
                for date in unique_dates_sorted
            ]

            dates_as_datetime.sort(reverse=True)

            streak = 1
            for i in range(len(dates_as_datetime) - 1):
                diff = (
                    dates_as_datetime[i]
                    - dates_as_datetime[i + 1]
                ).days

                if diff == 1:
                    streak += 1
                else:
                    break

        # =====================
        # WEEKLY DATA (last 7 days)
        # =====================

        days_of_week = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
        weekly_data = []

        for i in range(7, 0, -1):
            current_date = (
                today - 
                __import__('datetime').timedelta(days=i)
            )

            date_str = current_date.strftime("%d/%m/%Y")

            day_of_week = days_of_week[
                current_date.weekday()
            ]

            day_percentage = 0

            for log in logs_last_7_days:
                if log.date == date_str:
                    day_percentage = max(
                        day_percentage,
                        log.completion_percentage
                    )

            weekly_data.append({
                'day': day_of_week,
                'percentage': round(day_percentage, 1)
            })

        # =====================
        # IMPROVEMENTS
        # =====================

        improvements = []

        if len(all_logs) < 7:

            improvements = []

        elif total_completion < 50:

            improvements = []

        elif total_completion < 75:

            # Minor improvements
            if "acne" in skin_problems:
                improvements.extend([
                    "Acne may begin to stabilize",
                    "Reduced inflammation expected",
                ])

            if "pigmentation" in skin_problems:
                improvements.extend([
                    "Slight improvement in skin tone",
                    "Reduced pigmentation visibility",
                ])

            if "dryness" in skin_problems:
                improvements.extend([
                    "Gradual improvement in hydration",
                    "Enhanced moisture retention",
                ])

            if "sensitivity" in skin_problems:
                improvements.extend([
                    "Reduced sensitivity reactions",
                    "Calmer skin appearance",
                ])

            if "oiliness" in skin_problems:
                improvements.extend([
                    "Better oil control",
                    "Reduced shine throughout day",
                ])

        elif total_completion < 90:

            # Good improvements
            if "acne" in skin_problems:
                improvements.extend([
                    "Noticeable acne reduction",
                    "Reduced inflammation and redness",
                    "Improved skin texture",
                ])

            if "pigmentation" in skin_problems:
                improvements.extend([
                    "Clear improvement in skin tone",
                    "Reduced dark spots visibility",
                    "More even complexion",
                ])

            if "dryness" in skin_problems:
                improvements.extend([
                    "Visibly improved hydration",
                    "Reduced flakiness",
                    "Smoother skin texture",
                ])

            if "sensitivity" in skin_problems:
                improvements.extend([
                    "Significantly reduced sensitivity",
                    "Calmer, more resilient skin",
                    "Fewer irritation reactions",
                ])

            if "oiliness" in skin_problems:
                improvements.extend([
                    "Strong oil control throughout day",
                    "Significantly reduced shine",
                    "Balanced complexion",
                ])

        else:

            # Excellent improvements
            if "acne" in skin_problems:
                improvements.extend([
                    "Significant acne reduction",
                    "Clear skin appearance",
                    "Strong inflammation control",
                    "Noticeably improved texture",
                ])

            if "pigmentation" in skin_problems:
                improvements.extend([
                    "Major improvement in skin tone",
                    "Significantly reduced spots",
                    "Brightened complexion",
                    "More even skin color",
                ])

            if "dryness" in skin_problems:
                improvements.extend([
                    "Excellent hydration levels",
                    "Completely eliminated dryness",
                    "Supple, glowing skin",
                    "Improved elasticity",
                ])

            if "sensitivity" in skin_problems:
                improvements.extend([
                    "Nearly eliminated sensitivity",
                    "Strong skin barrier",
                    "Resilient skin response",
                    "Excellent tolerance",
                ])

            if "oiliness" in skin_problems:
                improvements.extend([
                    "Perfect oil balance",
                    "All-day matte finish",
                    "Perfectly balanced complexion",
                    "Minimal shine throughout day",
                ])

        # Remove duplicates
        improvements = list(dict.fromkeys(improvements))

        # =====================
        # INSIGHTS
        # =====================

        insights = []

        if all_logs:

            # Morning vs Evening routine consistency
            morning_logs = [
                log for log in all_logs[:14]
                if log.routine_type == 'morning'
            ]

            evening_logs = [
                log for log in all_logs[:14]
                if log.routine_type == 'evening'
            ]

            if morning_logs and evening_logs:

                morning_avg = sum([
                    log.completion_percentage
                    for log in morning_logs
                ]) / len(morning_logs)

                evening_avg = sum([
                    log.completion_percentage
                    for log in evening_logs
                ]) / len(evening_logs)

                if morning_avg > evening_avg + 15:
                    insights.append(
                        "🌅 Morning routines are more consistent "
                        "than evening routines. "
                        "Try to focus more on your night routine "
                        "for better results."
                    )

                elif evening_avg > morning_avg + 15:
                    insights.append(
                        "🌙 Evening routines are more consistent "
                        "than morning routines. "
                        "Don't skip your morning routine for optimal skin health."
                    )

                else:
                    insights.append(
                        "⚖️ Great balance! Your morning and "
                        "evening routines are equally consistent."
                    )

            elif morning_logs and not evening_logs:
                insights.append(
                    "🌅 You're doing a great job with morning "
                    "routines. "
                    "Consider adding an evening routine too!"
                )

            elif evening_logs and not morning_logs:
                insights.append(
                    "🌙 You're doing a great job with evening "
                    "routines. "
                    "Consider adding a morning routine too!"
                )

            # Overall consistency improvement
            if len(all_logs) >= 14:

                recent_logs = all_logs[:7]
                older_logs = all_logs[7:14]

                if recent_logs and older_logs:

                    recent_avg = sum([
                        log.completion_percentage
                        for log in recent_logs
                    ]) / len(recent_logs)

                    older_avg = sum([
                        log.completion_percentage
                        for log in older_logs
                    ]) / len(older_logs)

                    if recent_avg > older_avg + 10:
                        insights.append(
                            "📈 Excellent! Your routine consistency "
                            "has improved compared to last week. "
                            "Keep it up!"
                        )

                    elif older_avg > recent_avg + 10:
                        insights.append(
                            "📉 Your consistency has dipped recently. "
                            "Try to get back on track with your "
                            "routines."
                        )

            # Streak observation
            if streak >= 5:
                insights.append(
                    f"🔥 Amazing streak of {streak} days! "
                    "Your commitment to skincare is showing!"
                )

        # =====================
        # RESPONSE
        # =====================

        return jsonify({

            'weeklyCompletion': round(total_completion, 1),

            'activeDays': active_days,

            'streak': streak,

            'weeklyData': weekly_data,

            'improvements': improvements,

            'insights': insights,

            'logsCount': len(all_logs)

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
# RUN
# =========================

if __name__ == '__main__':

    with app.app_context():
        db.create_all()

    print("🚀 Server running...")

    app.run(debug=True)
