📘 Quiz App – PHP + MySQL

A simple and interactive Quiz Management System built using PHP, MySQL, HTML, CSS, and JavaScript.
Users can take quizzes, submit answers, and view scores instantly.

🚀 Features

📝 Create Quizzes (via PHP endpoints)

📥 Fetch Quiz Questions dynamically

🧠 Submit Answers & Auto-Calculate Score

📊 Instant Result Display

📁 Includes SQL Schema for quick setup

🎨 Clean UI built with HTML, CSS & JavaScript

📂 Project Structure
quiz-app/
 ├── public/
 │     ├── api/
 │     │     ├── create_quiz.php
 │     │     ├── db.php
 │     │     ├── get_quiz.php
 │     │     ├── get_quizzes.php
 │     │     └── submit_quiz.php
 │     ├── index.html
 │     ├── script.js
 │     └── style.css
 └── sql/
       └── schema.sql

🛠️ Tech Stack

Backend: PHP

Database: MySQL

Frontend: HTML, CSS, JavaScript

API Format: JSON

Deployment: Localhost / XAMPP / WAMP / LAMP

⚙️ Setup Instructions
1️⃣ Import Database

Open phpMyAdmin → create a database:

quiz_app


Then import:

sql/schema.sql

2️⃣ Configure Database Connection

Edit public/api/db.php:

$host = "localhost";
$user = "root";
$password = "";
$dbname = "quiz_app";

3️⃣ Start Server

Use XAMPP / WAMP:

Move quiz-app folder to htdocs

Start Apache and MySQL

Access the app at:

http://localhost/quiz-app/public/

📡 API Endpoints
▶️ Get All Quizzes

GET /api/get_quizzes.php

▶️ Get Quiz Questions

GET /api/get_quiz.php?id=1

▶️ Submit Quiz

POST /api/submit_quiz.php

▶️ Create New Quiz

POST /api/create_quiz.php

📝 License

This project is licensed under the MIT License.
Check the root LICENSE file.

👨‍💻 Developer

Jojin John
🔗 GitHub: https://github.com/jojin1709

🔗 Portfolio: https://jojin-portfolio.netlify.app/

🔗 LinkedIn: https://www.linkedin.com/in/jojin-john-74386b34a/
