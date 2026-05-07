# 🚀 SalesFlow CRM - Lead Management System

A professional, high-performance Customer Relationship Management (CRM) system designed for small sales teams. This application streamlines lead tracking, pipeline management, and data visualization using the modern MERN stack.

---

## 🔐 Test Login Credentials
Use these to log in and explore all features:
- **Email:** `admin@example.com`
- **Password:** `password123`

---

## 📑 Table of Contents
- [Project Overview](#-project-overview)
- [Tech Stack](#%EF%B8%8F-tech-stack)
- [Key Features](#-key-features)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [Project Structure](#-project-structure)
- [Reflection & Architecture](#-reflection--architecture)
- [Submission Links](#-submission-links)
- [Known Limitations](#-known-limitations)

---

## 🎯 Project Overview
SalesFlow CRM is a centralized hub built to help sales teams manage contact information, track deal values, and move prospects through a structured pipeline. This project was developed as part of a full-stack developer assessment, focusing on secure authentication, efficient CRUD operations, and a clean, responsive UI.

## 🛠️ Tech Stack
- **Frontend:** React 19 (Vite), Tailwind CSS 4, Lucide Icons, React Router 7.
- **Backend:** Node.js, Express.js.
- **Database:** MongoDB (Mongoose ODM).
- **Authentication:** JSON Web Tokens (JWT) & Bcrypt.js hashing.
- **State Management:** React Context API for Global Auth.

## ✨ Key Features
- **Secure Authentication:** JWT-based login flow with protected routes.
- **Lead Lifecycle Management:** Full CRUD operations for sales leads.
- **Interactive Dashboard:** Real-time KPIs (Total Leads, New/Qualified/Won/Lost counts).
- **Sales Pipeline:** Track leads through customizable stages.
- **Lead Notes:** Timestamped internal collaboration system.
- **Search & Filtering:** Multi-field search (Name/Email/Company) and status-based filtering.
- **Responsive Design:** Fully mobile-friendly interface.

## 🏁 Getting Started

### Prerequisites
- **Node.js:** v18 or higher.
- **MongoDB:** A local instance running (default: `mongodb://localhost:27017/crm_db`).

### Installation & Setup

1. **Clone the Repository:**
   ```bash
   git clone <your-repo-url>
   cd CRM_Wishwa_Dilshan
   ```

2. **Install All Dependencies:**
   Run this from the root directory to install packages for the root, client, and server:
   ```bash
   npm run install-all
   ```

3. **Configure Environment Variables:**
   Create a `.env` file in the `server/` directory (see [Environment Variables](#-environment-variables)).

4. **Seed the Database:**
   Initialize the database with the admin user and sample leads:
   ```bash
   npm run seed
   ```

5. **Start Development Servers:**
   Launch both the frontend and backend concurrently:
   ```bash
   npm run dev
   ```
   - **Frontend:** [http://localhost:5173](http://localhost:5173)
   - **Backend:** [http://localhost:5000](http://localhost:5000)

## 🔑 Environment Variables
The application requires the following variables in `server/.env`:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/crm_db
JWT_SECRET=your_secure_secret_here
NODE_ENV=development
```

## 📁 Project Structure
```text
├── client/                 # React Frontend (Vite)
│   ├── src/
│   │   ├── components/     # Modals, Lead Cards, Layout
│   │   ├── context/        # Auth Context & State
│   │   ├── pages/          # Dashboard, Lead List, Login
│   │   └── services/       # Axios API Service
├── server/                 # Express Backend
│   ├── src/
│   │   ├── config/         # DB & JWT Helpers
│   │   ├── controllers/    # Lead & User Logic
│   │   ├── models/         # Mongoose Schemas
│   │   ├── routes/         # Express API Routes
│   │   └── middleware/     # Auth Protection
└── package.json            # Root scripts for orchestration
```

## 🧠 Reflection & Architecture
### Architecture
This project follows a **Separation of Concerns** principle:
- **Modular Backend:** Routes are decoupled from business logic (controllers), making the API scalable and maintainable.
- **Component-Driven Frontend:** UI is broken down into reusable components, utilizing Tailwind CSS for rapid, consistent styling.
- **Security First:** Passwords are never stored in plain text (Bcrypt), and sensitive routes are guarded by JWT middleware.

### Challenges & Solutions
- **Dynamic Dashboard:** Aggregating MongoDB data efficiently was achieved using optimized queries to provide real-time KPI updates.
- **State Persistence:** Implemented robust auth persistence to ensure a smooth user experience across page refreshes.

## 🔗 Submission Links
- **Demo Video:** [Link to Demo Video]
- **Live Deployment:** [https://salesflow-crm-wishwa-dilshan-7j832oj0y.vercel.app/](https://salesflow-crm-wishwa-dilshan-7j832oj0y.vercel.app/)

## ⚠️ Known Limitations
- **Email Notifications:** Automatic lead assignment emails are not currently implemented.
- **Advanced Permissions:** All logged-in users have administrative access for this version.

---
**Developed by Wishwa Dilshan**  
*Intern Developer - Full-Stack CRM Assessment*
