🌸 TwaCare – Personalized Skincare Management Application
📖 Overview

TwaCare is a full-stack skincare management application designed to help users build and maintain effective skincare routines based on their skin type and concerns. The application provides personalized skincare recommendations, routine tracking, product management, progress analytics, and a mobile-friendly user experience.

The system is built using React.js for the frontend, Flask for the backend, SQLite for data storage, and Capacitor for Android deployment. TwaCare enables users to organize their skincare journey, monitor consistency, and improve skincare habits through data-driven insights.

✨ Features
🔐 User Authentication
User Registration
Secure Login System
Password Encryption
User Profile Management
🧴 Personalized Skincare Routines
Skin Type Based Recommendations
Concern Based Recommendations
Morning Routine Suggestions
Night Routine Suggestions
📦 Product Management
Add Skincare Products
View Product List
Update Product Information
Delete Products
📅 Skin Log Tracking
Daily Routine Tracking
Completion Monitoring
Consistency Recording
Progress History
📊 Analytics Dashboard
Weekly Progress Tracking
Consistency Score
Routine Completion Statistics
User Performance Insights
📱 Mobile Application
Android Deployment using Capacitor
Responsive User Interface
Cross-Platform Ready Architecture
🏗️ System Architecture
TwaCare
│
├── Frontend (React + Vite + Tailwind CSS)
│
├── Backend (Flask + SQLAlchemy)
│
├── Database (SQLite)
│
└── Mobile Application (Capacitor + Android Studio)
🛠️ Technology Stack
Frontend
React.js
Vite
Tailwind CSS
React Router DOM
Backend
Flask
Flask-CORS
Flask-SQLAlchemy
Werkzeug
Database
SQLite
Mobile Deployment
Capacitor
Android Studio
Hosting
Render
📂 Project Structure
TwaCare
│
├── backend
│   ├── app.py
│   ├── users.db
│   ├── requirements.txt
│   └── maindata.json
│
├── frontend
│   ├── public
│   ├── src
│   │   ├── assets
│   │   ├── components
│   │   ├── pages
│   │   ├── api
│   │   └── App.jsx
│   │
│   ├── package.json
│   └── vite.config.js
│
├── android
│
├── capacitor.config.json
│
└── README.md
⚙️ Installation
1. Clone Repository
git clone https://github.com/your-username/twacare.git
cd twacare
2. Frontend Setup

Install Dependencies:

npm install

Start Development Server:

npm run dev
3. Backend Setup

Create Virtual Environment:

python -m venv .venv

Activate Virtual Environment:

# Windows
.venv\Scripts\activate

# Linux/Mac
source .venv/bin/activate

Install Backend Dependencies:

pip install -r requirements.txt

Run Flask Server:

python app.py
🚀 Android Build

Build React Project:

npm run build

Sync Capacitor:

npx cap sync

Open Android Studio:

npx cap open android

Generate APK:

Build
→ Generate Signed Bundle / APK
→ APK
→ Create KeyStore
→ Build APK
🌐 Deployment
Backend Deployment (Render)

Build Command

pip install -r requirements.txt

Start Command

python app.py
Deployment Steps
Push backend code to GitHub.
Connect repository to Render.
Configure Build Command and Start Command.
Deploy Application.
Update frontend API URLs with deployed backend URL.
📊 Testing
Module	Status
User Authentication	✅ Passed
Routine Generation	✅ Passed
Product Management	✅ Passed
Skin Log Tracking	✅ Passed
Analytics Dashboard	✅ Passed
Android Deployment	✅ Passed
🔒 Security Features
Password Hashing using Werkzeug
Secure User Authentication
Input Validation
Protected API Access
Secure Database Storage
🎯 Future Enhancements
AI Skin Analysis

Analyze user skin conditions using image processing and machine learning.

Cloud Synchronization

Enable access across multiple devices through cloud storage.

Push Notifications

Routine reminders and skincare alerts.

Dermatologist Consultation

Direct interaction with skincare professionals.

Ingredient Analysis

Analyze skincare product ingredients and suitability.

Machine Learning Recommendations

Advanced personalized skincare suggestions.

Community Platform

User discussions, skincare tips, and expert content.

👨‍💻 Developer

Mohammed Sharib

Bachelor of Engineering (Computer Science)

Final Year Project – 2026

📌 Project Title

TwaCare – Personalized Skincare Management Application

📜 License

This project was developed for academic and educational purposes as part of a final-year engineering project.

🌸 Tagline
"Your Glow, Our Care."
