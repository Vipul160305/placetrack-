# 🎓 PlaceTrack — College Placement Management & Tracking System

A production-ready full-stack MERN application for campus recruitment automation.

---

## 🚀 Quick Start

### Prerequisites
- Node.js (v18+)
- MongoDB (local or Atlas)

### 1. Setup Backend

```bash
cd backend
npm install
# Configure .env (see Environment Variables below)
npm run seed    # Populate demo data
npm run dev     # Start backend on port 5000
```

### 2. Setup Frontend

```bash
cd frontend
npm install
npm run dev     # Start frontend on port 5173
```

Visit: **http://localhost:5173**

---

## 🔑 Demo Accounts (password: `demo123`)

| Role    | Email              |
|---------|--------------------|
| Student | student@demo.com   |
| TPO     | tpo@demo.com       |
| Admin   | admin@demo.com     |

---

## 🔧 Environment Variables

### Backend (`backend/.env`)

```env
MONGO_URI=mongodb://localhost:27017/placement_db
JWT_SECRET=your_super_secret_jwt_key
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

### For MongoDB Atlas (Production)

```env
MONGO_URI=mongodb+srv://<user>:<pass>@cluster0.xxxxx.mongodb.net/placement_db?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_key_at_least_32_chars
PORT=5000
NODE_ENV=production
CLIENT_URL=https://your-frontend-domain.vercel.app
```

---

## 📁 Folder Structure

```
placementdemo/
├── backend/
│   ├── config/          # MongoDB connection
│   ├── controllers/     # Business logic
│   │   ├── authController.js
│   │   ├── companyController.js
│   │   ├── applicationController.js
│   │   ├── userController.js
│   │   └── analyticsController.js
│   ├── middleware/      # Auth, Role, Upload
│   ├── models/          # Mongoose schemas
│   ├── routes/          # Express routes
│   ├── uploads/         # Resume files
│   ├── seed.js          # Demo data seeder
│   └── server.js        # Entry point
│
└── frontend/
    └── src/
        ├── components/
        │   ├── layout/  # DashboardLayout
        │   └── ui/      # Shared UI components
        ├── context/     # AuthContext
        ├── pages/
        │   ├── student/ # Student pages
        │   ├── tpo/     # TPO pages
        │   └── admin/   # Admin pages
        ├── services/    # Axios API calls
        └── App.jsx      # Router + Routes
```

---

## 🏗️ Features by Role

### 👨‍🎓 Student
- Register with branch, CGPA, skills
- View only eligible companies (filtered by CGPA + branch)
- Apply to companies (one-click)
- Track application progress with visual status bar
- Edit profile (name, branch, CGPA, skills)
- Upload resume (PDF/DOC)
- View placement status

### 👩‍💼 TPO (Training & Placement Officer)
- Add/Edit/Delete companies with full details
- Set eligibility criteria (min CGPA, eligible branches)
- Define multi-round interview process
- View eligible students per company
- Filter and manage all applications
- Update application round status
- Analytics dashboard:
  - Placement percentage
  - Highest & average package
  - Branch-wise bar chart
  - Application status doughnut chart
  - Branch performance progress bars

### 🛡️ Admin
- View all users (students, TPOs, admins)
- Search and filter users
- Delete users (admin accounts protected)
- View system-wide statistics
- **System Analytics dashboard:**
  - User role distribution chart
  - Placement overview doughnut
  - Branch-wise placement bar chart
  - Application pipeline breakdown
  - Branch performance progress bars

---

## 🔌 API Endpoints

### Auth
```
POST /api/auth/register   - Student registration
POST /api/auth/login      - Login (all roles)
```

### Users
```
GET    /api/users/me           - Get my profile
PUT    /api/users/me           - Update my profile
POST   /api/users/me/resume    - Upload resume
GET    /api/users              - Get all users (admin/tpo)
GET    /api/users/:id          - Get user by ID
DELETE /api/users/:id          - Delete user (admin)
```

### Companies
```
GET    /api/companies                        - Get companies (filtered for students)
POST   /api/companies                        - Create company (tpo)
GET    /api/companies/:id                    - Get company
PUT    /api/companies/:id                    - Update company (tpo)
DELETE /api/companies/:id                    - Delete company (tpo/admin)
GET    /api/companies/:id/eligible-students  - Get eligible students (tpo)
```

### Applications
```
POST  /api/applications                 - Apply to company (student)
GET   /api/applications/me             - My applications (student)
GET   /api/applications                - All applications (tpo/admin)
GET   /api/applications/company/:id   - Company applicants (tpo)
PUT   /api/applications/:id/status    - Update status (tpo)
```

### Analytics
```
GET /api/analytics   - Placement analytics (tpo/admin)
```

---

## 🚀 Deployment Guide

### Backend → Render.com

1. Push backend to GitHub
2. Create **Web Service** on Render
3. Build command: `npm install`
4. Start command: `node server.js`
5. Add environment variables (MONGO_URI, JWT_SECRET, PORT, CLIENT_URL)
6. Deploy

### Frontend → Vercel

1. Push frontend to GitHub
2. Import project on [vercel.com](https://vercel.com)
3. Framework: **Vite**
4. Add environment variable: `VITE_API_URL=https://your-render-backend.onrender.com/api`
5. Update `vite.config.js` proxy to use env var in production
6. Deploy

> **Note:** Update `api.js` `baseURL` for production:
> ```js
> baseURL: import.meta.env.VITE_API_URL || '/api'
> ```

### Database → MongoDB Atlas

1. Create free cluster at [mongodb.com/atlas](https://mongodb.com/atlas)
2. Create database user with read/write permission
3. Whitelist IP `0.0.0.0/0` (for Render)
4. Copy connection string and set as `MONGO_URI`

---

## 🧪 Testing the Application

### After seeding, try these scenarios:

1. **Login as Student** (`student@demo.com` / `demo123`)
   - View eligible companies
   - Apply to a company
   - Track application in "My Applications"

2. **Login as TPO** (`tpo@demo.com` / `demo123`)
   - Add a new company
   - View all applicants
   - Update an application from "Applied" → "Selected"
   - Check analytics charts

3. **Login as Admin** (`admin@demo.com` / `demo123`)
   - View all users
   - Delete a user account
   - Navigate to **System Analytics** for full charts & insights

---

## 🛠️ Tech Stack

| Layer     | Technology                         |
|-----------|-------------------------------------|
| Frontend  | React 19, Vite, Tailwind CSS v4    |
| Routing   | React Router v7                    |
| HTTP      | Axios                               |
| Charts    | Chart.js + react-chartjs-2         |
| Icons     | Lucide React                        |
| Toast     | React Hot Toast                    |
| Backend   | Node.js + Express.js               |
| Security  | Helmet, Rate Limit, Mongo Sanitize |
| Perf      | Compression, Code Splitting        |
| Database  | MongoDB + Mongoose                 |
| Auth      | JWT + bcryptjs                     |
| Upload    | Multer                             |

---

## 📋 Sample Data

After running `npm run seed` in the backend:

- **5 companies**: Google India (24 LPA), Amazon (18 LPA), Microsoft (20 LPA), TCS (7 LPA), Infosys (6.5 LPA)
- **8 students** across CSE, ECE, IT, ME branches
- **8 sample applications** with various statuses

---

## 🔒 Production Security Features

- **Helmet** — Sets comprehensive HTTP security headers
- **Rate Limiting** — 200 req/15min for API, 20 req/15min for auth
- **Mongo Sanitize** — Prevents NoSQL injection attacks
- **Compression** — Gzip responses for faster transfers
- **JWT Auto-Logout** — Frontend auto-clears expired sessions
- **CORS Whitelist** — Only allowed origins can access the API
- **Body Size Limits** — Prevents oversized payload attacks
- **Code Splitting** — Vendor, Charts, UI chunks for optimal caching

---

*Built for academic submission and live demonstration. Production-ready MERN stack.*
