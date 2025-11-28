# Quick Start Guide

## Prerequisites
- Node.js installed (v14 or higher)
- MongoDB installed and running locally

## Setup Steps

1. **Install Dependencies**
   ```bash
   cd app
   npm install
   ```

2. **Start MongoDB**
   - Make sure MongoDB is running on `localhost:27017`
   - If using a different setup, update the connection string in `server.js`

3. **Start Backend Server**
   ```bash
   npm run server
   ```
   Or:
   ```bash
   node server.js
   ```
   You should see: "DB connected" and "Server running on http://localhost:5000"

4. **Start Frontend (in a new terminal)**
   ```bash
   npm run dev
   ```
   The app will open at `http://localhost:5173` (or the port shown)

5. **Create Admin Account**
   - Navigate to `/register`
   - Create your admin account
   - Login at `/login`

6. **Start Managing Students!**
   - Add students
   - View dashboard
   - Manage student records

## Default Routes

- `/login` - Login page
- `/register` - Registration page
- `/dashboard` - Admin dashboard (protected)
- `/add` - Add new student (protected)
- `/manage` - Manage students (protected)
- `/edit/:id` - Edit student (protected)
- `/student/:id` - View student profile (protected)

## Troubleshooting

**MongoDB Connection Error:**
- Ensure MongoDB is running: `mongod` or start MongoDB service
- Check connection string in `server.js`

**Port Already in Use:**
- Backend: Change PORT in `server.js` (default: 5000)
- Frontend: Vite will automatically use next available port

**Token Expired:**
- Simply login again
- Tokens expire after 7 days

**CORS Errors:**
- Make sure backend is running before frontend
- Check that backend URL matches in all API calls

