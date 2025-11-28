import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import {
  FaHome,
  FaUserPlus,
  FaUsers,
  FaChartBar,
  FaSignOutAlt,
  FaGraduationCap,
  FaChalkboardTeacher,
  FaBook,
  FaCalendarCheck,
  FaBars,
  FaTimes,
} from "react-icons/fa";

const Sidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const menuItems = [
    { path: "/dashboard", icon: FaHome, label: "Dashboard" },
    { path: "/add", icon: FaUserPlus, label: "Add Student" },
    { path: "/manage", icon: FaUsers, label: "Manage Students" },
    { path: "/teachers", icon: FaChalkboardTeacher, label: "Teachers" },
    { path: "/courses", icon: FaBook, label: "Courses" },
    { path: "/attendance", icon: FaCalendarCheck, label: "Attendance" },
    { path: "/exams", icon: FaGraduationCap, label: "Exams & Marks" },
  ];

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 bg-gray-800 text-white p-3 rounded-lg hover:bg-gray-700 transition"
      >
        {isMobileMenuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
      </button>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={closeMobileMenu}
        />
      )}

      {/* Sidebar */}
      <div
        className={`w-64 bg-gray-800 h-screen fixed left-0 top-0 flex flex-col overflow-hidden z-40 transform transition-transform duration-300 ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        {/* Logo/Header */}
        <div className="p-6 border-b border-gray-700 flex-shrink-0">
          <div className="flex items-center gap-3">
            <FaGraduationCap className="text-blue-500 text-3xl" />
            <div>
              <h1 className="text-xl font-bold text-white">Student Management</h1>
              <p className="text-xs text-gray-400">Admin Panel</p>
            </div>
          </div>
        </div>

      {/* User Info */}
      {user && (
        <div className="p-4 border-b border-gray-700 flex-shrink-0">
          <p className="text-sm text-gray-400">Logged in as</p>
          <p className="text-white font-semibold truncate">{user.username || user.email}</p>
        </div>
      )}

      {/* Navigation - Scrollable */}
      <nav className="flex-1 overflow-y-auto p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  onClick={closeMobileMenu}
                  className={`flex items-center gap-3 p-3 rounded-lg transition ${
                    isActive
                      ? "bg-blue-600 text-white"
                      : "text-gray-300 hover:bg-gray-700 hover:text-white"
                  }`}
                >
                  <Icon />
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Logout - Fixed at bottom */}
      <div className="p-4 border-t border-gray-700 flex-shrink-0 bg-gray-800">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full p-3 rounded-lg text-red-400 hover:bg-gray-700 hover:text-red-300 transition"
        >
          <FaSignOutAlt />
          <span>Logout</span>
        </button>
      </div>
      </div>
    </>
  );
};

export default Sidebar;
