# Aegis Academia: AI-Powered College Management Platform

Aegis Academia is a modern, production-ready SaaS-level college management platform with three integrated user roles: **Student**, **Faculty**, and **Admin**. 

---

## 🛠️ Technology Stack

- **Frontend**: React.js, Vite, Tailwind CSS, Redux Toolkit
- **Backend**: Node.js, Express.js (MVC Pattern with Service/Repository layers)
- **Database**: PostgreSQL (Production) / SQLite (Development), Prisma ORM
- **Authentication**: Firebase Authentication + Custom JWT session validation
- **File Storage**: Cloudinary (Resumes, assignments attachments, events certificates)
- **AI Features**: OpenAI API (ATS Resume Analyzer, Mock Interview Simulator, Career Path Advisor)
- **Mobile Companion**: React Native (Expo)

---

## 🏗️ System Architecture

```
                                  +-----------------------+
                                  |   React Native App    |
                                  |     (Expo Shell)      |
                                  +-----------+-----------+
                                              |
                                              | HTTPS / APIs
                                              v
+-----------------------+         +-----------+-----------+
| React Web Frontend    +-------->+   Express Backend     |
| (Vite & Tailwind CSS) |         | (Node.js REST Server) |
+-----------------------+         +-----+-----+-----+-----+
                                        |     |     |
                 +----------------------+     |     +----------------------+
                 |                            |                            |
                 v                            v                            v
      +----------+----------+       +---------+---------+       +----------+----------+
      |  Firebase Auth SDK  |       |   Prisma ORM Client   |       |   OpenAI & Cloudinary|
      | (Google & Email Log)|       |  (SQLite/Postgres)|       |   (AI & Resumes APIs)|
      +---------------------+       +---------+---------+       +----------------------+
                                              |
                                              v
                                    +---------+---------+
                                    |  PostgreSQL/SQLite|
                                    |     Database      |
                                    +-------------------+
```

---

## 🗄️ Database Documentation

The system maps out structural entities, enums, and references.

| Table Name | Description | Key Relations |
| :--- | :--- | :--- |
| **User** | System accounts credentials | Cascades to student/faculty profiles |
| **Admin** | Campus administrator profile | Referenced by User |
| **Department** | E.g. CSE, IT, ECE, EEE | Groups students and faculties |
| **Student** | Student data logs | Under Department, has marks/attendances |
| **Faculty** | Faculty credentials and designation | Assigned to subjects and sections |
| **Subject** | Syllabus credits and semesters | Linked to Department and Faculty |
| **Attendance** | Class hourly logs | Links student and subject |
| **Assignment** | Faculty coursework sheets | Reference PDF url on Cloudinary |
| **Submission** | Student submitted papers | Uploaded document URL, holds grades |
| **Mark** | Exam marks logs | Captures Internal tests & final exams |
| **PlacementDrive**| Scheduled company recruitments | Recruiter description, package, criteria |
| **Event** | College technical/cultural meets | QR Check-in passes, registrations count |

---

## 🔌 API Documentation

### 1. Authentication (`/api/auth`)
- `POST /register`: Registers user (Requires Admin role or dev sandbox bypass).
- `POST /login`: Receives Firebase ID token, verifies validity, and returns signed backend JWT token session.
- `GET /me`: Returns profile of authenticated user.

### 2. Student Modules (`/api/student`)
- `GET /dashboard`: Summary metrics of attendance, pending assignments, GPA, and upcoming events.
- `GET /attendance`: Subject-wise percentage breaks and recent logs.
- `GET /assignments`: Check coursework tasks, due dates, and download materials.
- `POST /assignments/submit`: Submit assignment PDF links (uploads to Cloudinary).
- `GET /marks`: Retrieve Internal exam scores sheets, semester marks, and GPA values.

### 3. Faculty Modules (`/api/faculty`)
- `GET /classes`: Fetch assigned subjects, semesters, and sections.
- `POST /attendance`: Bulk-mark student session registers.
- `POST /assignments`: Schedule coursework, attach reference documents, set deadlines.
- `POST /submissions/:submissionId/grade`: Grade submitted coursework, input feedback comments.
- `POST /marks`: Input exam results in bulk.
- `GET /monitoring/alerts`: Identifies students with attendance below 75% threshold.

### 4. Admin Modules (`/api/admin`)
- `POST /users/student`: Register students profiles.
- `POST /users/faculty`: Register faculty profiles.
- `POST /departments`: Create CSE, IT, ECE, EEE branches.
- `POST /subjects`: Add syllabus subjects, semesters, credits.
- `POST /placements/drives`: Schedule company recruiting visits.
- `POST /events`: Publish technical meets and compile QR check-in analytics.

### 5. AI Assistant Modules (`/api/ai`)
- `POST /resume/analyze`: Parse resume text and output ATS score, suggestions, skill gaps.
- `POST /interview/start`: Generate tailored HR and technical questions for target job.
- `POST /interview/submit`: Grade mock interview responses, return confidence and communication feedback.
- `GET /career/recommend`: Predict career roadmaps and jobs based on grades and department.

---

## 🚀 Deployment Guide

### Local Development Setup

1. **Prerequisites**: Ensure you have Node.js (v20+) installed.
2. **Clone & Setup Backend**:
   ```bash
   cd backend
   npm install
   # Create a local .env file using .env.example
   npx prisma generate
   npx prisma db push
   node prisma/seed.js
   npm run start
   ```
3. **Setup Frontend**:
   ```bash
   cd ../frontend
   npm install
   npm run dev
   ```
   Open [http://localhost:5173/](http://localhost:5173/) in your web browser.

### Docker Container Setup
Run the complete multi-stage containerized environment:
```bash
docker-compose up --build
```
This builds Nginx static web routing for the frontend and loads Node/Express API routes on port 5000.

---

## 🧪 Testing Instructions

Run the backend unit test suites checking routers, security parameters, and controller actions:
```bash
cd backend
npm run test
```
To verify the UI and dashboards interactively, launch the frontend server, click **Bypass Logins** (on the login screen bottom panel), and walkthrough student coursework, faculty grading screens, and AI roadmaps.
