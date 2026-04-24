## 📱 Skin Care App

This is a full-stack skin care application built using React, Tailwind CSS, and Flask. The app focuses on giving users a personalized experience by storing their details, showing routines, and organizing different sections like products and skin logs.

## 🛠️ Tech Used

Frontend: React, Tailwind CSS, React Router DOM
Backend: Flask, SQLAlchemy
Database: SQLite
Icons: Lucide React

## 🔐 Authentication

Users can sign up with basic details (name, age, phone, gender, password)
Login system verifies credentials using hashed passwords
On successful login, the app stores userId in local storage
Session is also maintained on the backend

## 👤 User Data Handling

User information is stored in the database
Additional skin-related data (skin type and problems) is saved separately
The frontend fetches user data using the stored userId

## 🏠 Home Page

Displays a greeting based on current time (morning, afternoon, evening)
Shows the logged-in user’s name dynamically
Displays routine cards for:
Morning Routine
Evening Routine

## 🔄 Navigation

Routing handled using React Router
Main routes:
/home
/routines/:type
/products
/skin-log
/profile

## 📅 Routine System

Two routines supported:
Morning
Evening
Navigation is URL-based:
/routines/morning
/routines/evening
Clicking a routine updates both UI and URL
Active routine is highlighted properly

## 📌 Bottom Navbar

Fixed bottom navigation bar
Allows switching between main sections
Active tab is highlighted based on current route
Handles nested routes like routines correctly

## 🔗 Backend Integration

Frontend communicates with Flask backend using fetch and async/await
User data is retrieved using:
GET /user/<user_id>
Signup, login, and user detail APIs are fully connected

## 🧠 Overall Flow

User signs up or logs in →
User ID is stored →
Home page loads →
User data is fetched →
Greeting and name are shown →
User navigates through routines, products, and logs
