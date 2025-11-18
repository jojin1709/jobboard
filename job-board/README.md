# 🚀 Job Board – MERN Stack Project

A full-stack job portal built using **React, Node.js, Express, MongoDB**, where employers can post jobs and candidates can search, apply, and manage their profiles.

This project was created as part of the Codesoft Web Development Internship.

---

## ✅ Features

### 🔐 **User Authentication**
- JWT-based login & registration  
- Role-based system (Candidate / Employer)

---

## 🏠 **Home Page**
- Clean landing section  
- Search bar  
- Featured jobs  
- Filters: `Location`, `Job Type`, `Experience`

---

## 📄 **Job Listings**
- View all available jobs  
- Pagination  
- Quick job overview  

---

## 📌 **Job Detail Page**
- Full job description  
- Salary range  
- Experience required  
- Company details  
- Apply button  

---

## 🧑‍💼 **Employer Dashboard**
- Post new jobs  
- Manage posted jobs  
- Update company info  
- Upload company logo  

---

## 👤 **Candidate Dashboard**
- View all applied jobs  
- Track application status  
- Update resume  
- Update skills, phone, experience  

---

## 📝 **Profile System**
Both users get a dynamic profile section:

### Candidate:
- Upload resume (PDF/DOCX)
- Update skills
- Add experience
- Upload profile picture

### Employer:
- Add company name, website, description
- Upload company logo

---

## 💼 **Job Application Process**
- Resume upload  
- Automatic saving in backend  
- Stored in MongoDB  
- Applications shown in dashboard  

---

## 🔍 **Search & Filters**
- Keyword search  
- Filter by:
  - Job type (Full-time, Part-time, Remote, Internship)
  - Location
  - Experience level

---

## 📧 **Optional Email Notifications**
(Supported but optional)

---

## 📱 **Responsive Design**
- Fully mobile-friendly  
- Works on all devices  

---

## 🛠️ **Tech Stack**

### **Frontend**
- React.js  
- React Router  
- Tailwind CSS  

### **Backend**
- Node.js  
- Express.js  
- Multer (file upload)  
- JWT  
- MongoDB  

### **Database**
- MongoDB Atlas  

---

## 📦 Installation

### 1️⃣ Clone the repository
   
    git clone https://github.com/jojin1709/job-board.git


2️⃣ Install backend dependencies

    cd backend
    npm install
    npm start
3️⃣ Install frontend dependenciescd ../frontend
    
    npm install
    npm start
📁 Folder Structure

    job-board/
    │── backend/ 
    │   ├── models/
    |   ├── routes/
    │   ├── middleware/
    │   ├── uploads/ (auto-created)
    │   └── server.js
    │
    │── frontend/
    │   ├── src/
    │   │   ├── pages/
    │   │   ├── components/
    │   │   ├── utils/
    │   │   └── App.js
    │   └── public/

✨ Developer

Jojin John
   
    GitHub → https://github.com/jojin1709
