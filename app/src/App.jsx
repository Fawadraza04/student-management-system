import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import PrivateRoute from "./components/PrivateRoute";
import Login from "./components/Login";
import Register from "./components/Register";
import Sidebar from "./Sidebar";
import Add from "./Add";
import Manage from "./Manage";
import Edit from "./Edit";
import Dashboard from "./Dashboard";
import StudentProfile from "./components/StudentProfile";
import TeacherManagement from "./components/TeacherManagement";
import CourseManagement from "./components/CourseManagement";
import AttendanceManagement from "./components/AttendanceManagement";
import ExamMarksManagement from "./components/ExamMarksManagement";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <div className="flex">
                  <Sidebar />
                  <Dashboard />
                </div>
              </PrivateRoute>
            }
          />
          <Route
            path="/add"
            element={
              <PrivateRoute>
                <div className="flex">
                  <Sidebar />
                  <Add />
                </div>
              </PrivateRoute>
            }
          />
          <Route
            path="/manage"
            element={
              <PrivateRoute>
                <div className="flex">
                  <Sidebar />
                  <Manage />
                </div>
              </PrivateRoute>
            }
          />
          <Route
            path="/edit/:id"
            element={
              <PrivateRoute>
                <div className="flex">
                  <Sidebar />
                  <Edit />
                </div>
              </PrivateRoute>
            }
          />
          <Route
            path="/student/:id"
            element={
              <PrivateRoute>
                <div className="flex">
                  <Sidebar />
                  <StudentProfile />
                </div>
              </PrivateRoute>
            }
          />
          <Route
            path="/teachers"
            element={
              <PrivateRoute>
                <div className="flex">
                  <Sidebar />
                  <TeacherManagement />
                </div>
              </PrivateRoute>
            }
          />
          <Route
            path="/courses"
            element={
              <PrivateRoute>
                <div className="flex">
                  <Sidebar />
                  <CourseManagement />
                </div>
              </PrivateRoute>
            }
          />
          <Route
            path="/attendance"
            element={
              <PrivateRoute>
                <div className="flex">
                  <Sidebar />
                  <AttendanceManagement />
                </div>
              </PrivateRoute>
            }
          />
          <Route
            path="/exams"
            element={
              <PrivateRoute>
                <div className="flex">
                  <Sidebar />
                  <ExamMarksManagement />
                </div>
              </PrivateRoute>
            }
          />

          {/* Default redirect */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
