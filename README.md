# Student Management System

A comprehensive full-stack MERN (MongoDB, Express, React, Node.js) application for managing students, teachers, courses, attendance, and academic records. Features secure JWT authentication, interactive dashboards, and a fully responsive mobile-friendly interface.

## Features

### ✅ Implemented Features

1. **Authentication System**
   - Admin registration and login
   - JWT token-based authentication
   - Secure password hashing with bcrypt
   - Protected routes with PrivateRoute component

2. **Admin Dashboard**
   - Overview statistics (Total students, Male/Female count, Batch count)
   - Interactive charts (Bar chart for batch distribution, Pie chart for gender distribution)
   - Modern and responsive UI

3. **Student Management (CRUD)**
   - **Create**: Add new students with details (name, class, batch, gender, email, phone, address)
   - **Read**: View all students with search functionality
   - **Update**: Edit student information
   - **Delete**: Remove students from the system

4. **Teacher Management**
   - Add, edit, delete teachers
   - Auto-generated Teacher IDs
   - Teacher profiles with department, qualification, and experience
   - Status management (Active/Inactive)

5. **Course/Subject Management**
   - Create and manage courses
   - Link courses to teachers
   - Course assignment to students
   - Track course credits and details

6. **Attendance Management**
   - Mark attendance by course and date
   - Status tracking (Present, Absent, Late)
   - Bulk attendance marking
   - View attendance records

7. **Exam & Marks Management**
   - Create exams (Quiz, Midterm, Final, Assignment)
   - Add and manage student marks
   - Automatic grade calculation (A+, A, B+, B, C, D, F)
   - Bulk marks entry
   - View exam results with grades

8. **Additional Features**
   - Student profile with enrolled courses and teachers
   - Course assignment to students
   - Advanced filtering and sorting
   - Pagination on all list pages
   - Search functionality
   - Fully responsive design (mobile, tablet, desktop)
   - Mobile-friendly hamburger menu
   - Bulk delete operations
   - Student status management

## Tech Stack

### Frontend
- React 19.1.1
- React Router DOM 7.9.4
- Axios for API calls
- Tailwind CSS for styling
- Recharts for data visualization
- React Icons for icons

### Backend
- Node.js
- Express 5.1.0
- MongoDB with Mongoose 8.19.1
- JWT for authentication
- bcryptjs for password hashing
- CORS enabled

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd "Student Management System"
   ```

2. **Install dependencies**
   ```bash
   cd app
   npm install
   ```

3. **Set up MongoDB**
   - Make sure MongoDB is running on your local machine
   - Default connection: `mongodb://localhost:27017/stu3`
   - You can change this in `server.js`

4. **Start the backend server**
   ```bash
   node server.js
   ```
   Server will run on `http://localhost:5000`

5. **Start the frontend development server**
   ```bash
   npm run dev
   ```
   Frontend will run on `http://localhost:5173` (or the port Vite assigns)

## Usage

### First Time Setup

1. Start both the backend and frontend servers
2. Navigate to `http://localhost:5173/register`
3. Create an admin account with:
   - Username
   - Email
   - Password (minimum 6 characters)
4. After registration, login with your credentials
5. You'll be redirected to the dashboard

### Using the Application

1. **Dashboard**: View statistics and charts about students
2. **Add Student**: Click "Add Student" to create new student records
3. **Manage Students**: View all students, search, edit, delete, or view profiles
4. **Student Profile**: Click the eye icon to view detailed student information
5. **Edit Student**: Click the edit icon to modify student details
6. **Logout**: Click logout in the sidebar to sign out

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new admin
- `POST /api/auth/login` - Admin login
- `GET /api/auth/verify` - Verify token (protected)

### Students (All protected - require authentication)
- `GET /api/students` - Get all students
- `GET /api/student/:id` - Get single student
- `POST /api/student` - Create new student
- `PUT /api/student/:id` - Update student
- `DELETE /api/student/:id` - Delete student

## Project Structure

```
app/
├── src/
│   ├── components/
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── PrivateRoute.jsx
│   │   └── StudentProfile.jsx
│   ├── context/
│   │   └── AuthContext.jsx
│   ├── Add.jsx
│   ├── App.jsx
│   ├── Dashboard.jsx
│   ├── Edit.jsx
│   ├── Manage.jsx
│   ├── Sidebar.jsx
│   └── main.jsx
├── server.js
└── package.json
```

## Security Features

- Password hashing with bcryptjs
- JWT tokens for authentication
- Protected API routes
- Token expiration (7 days)
- Secure HTTP-only token storage (localStorage)

## Future Enhancements

Potential features to add:
- Email notifications
- Export data to CSV/PDF
- Advanced filtering and sorting
- Student attendance tracking
- Grade management
- Role-based access control (multiple admin levels)
- Student photo uploads
- Bulk import/export
- Activity logs

## Notes

- The JWT secret in `server.js` should be changed to an environment variable in production
- MongoDB connection string should be moved to environment variables
- Consider adding input validation and sanitization
- Add error boundaries for better error handling
- Implement refresh tokens for better security

## License

This project is open source and available for educational purposes.

