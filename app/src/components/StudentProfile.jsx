import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaArrowLeft, FaEdit, FaEnvelope, FaPhone, FaMapMarkerAlt, FaUser, FaGraduationCap, FaCalendarAlt } from "react-icons/fa";
import API_BASE_URL from "../config/api";

const StudentProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStudent();
  }, [id]);

  const fetchStudent = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/student/${id}`);
      setStudent(res.data);
    } catch (error) {
      console.error("Error fetching student:", error);
      if (error.response?.status === 401) {
        navigate("/login");
      } else {
        alert("Failed to load student profile");
        navigate("/manage");
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 p-4 lg:p-6 mt-16 lg:mt-0 lg:ml-64 bg-gray-900 text-white min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="flex-1 p-4 lg:p-6 mt-16 lg:mt-0 lg:ml-64 bg-gray-900 text-white min-h-screen flex items-center justify-center">
        <div className="text-xl">Student not found</div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-4 lg:p-6 mt-16 lg:mt-0 lg:ml-64 bg-gray-900 text-white min-h-screen">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate("/manage")}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition"
          >
            <FaArrowLeft /> Back to Manage
          </button>
          <button
            onClick={() => navigate(`/edit/${id}`)}
            className="flex items-center gap-2 bg-blue-600 px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            <FaEdit /> Edit Student
          </button>
        </div>

        {/* Profile Card */}
        <div className="bg-gray-800 rounded-lg shadow-lg p-8">
          <div className="flex items-start gap-6 mb-8">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-4xl font-bold">
              {student.name.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-2">{student.name}</h1>
              <div className="flex items-center gap-4 text-gray-400 flex-wrap">
                {student.studentId && (
                  <span className="flex items-center gap-2 font-mono text-blue-400">
                    ID: {student.studentId}
                  </span>
                )}
                <span className="flex items-center gap-2">
                  <FaGraduationCap /> {student.class}
                </span>
                <span className="flex items-center gap-2">
                  <FaCalendarAlt /> Batch {student.batchYear}
                </span>
                <span className={`px-3 py-1 rounded-full text-sm ${
                  student.gender === "Male"
                    ? "bg-blue-500/20 text-blue-300"
                    : "bg-pink-500/20 text-pink-300"
                }`}>
                  {student.gender}
                </span>
                <span className={`px-3 py-1 rounded-full text-sm ${
                  (student.status || "Active") === "Active"
                    ? "bg-green-500/20 text-green-300"
                    : "bg-red-500/20 text-red-300"
                }`}>
                  {student.status || "Active"}
                </span>
              </div>
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {student.email && (
              <div className="flex items-start gap-4 p-4 bg-gray-700/50 rounded-lg">
                <FaEnvelope className="text-blue-400 mt-1" />
                <div>
                  <p className="text-gray-400 text-sm">Email</p>
                  <p className="text-white">{student.email}</p>
                </div>
              </div>
            )}

            {student.phone && (
              <div className="flex items-start gap-4 p-4 bg-gray-700/50 rounded-lg">
                <FaPhone className="text-green-400 mt-1" />
                <div>
                  <p className="text-gray-400 text-sm">Phone</p>
                  <p className="text-white">{student.phone}</p>
                </div>
              </div>
            )}

            {student.address && (
              <div className="flex items-start gap-4 p-4 bg-gray-700/50 rounded-lg md:col-span-2">
                <FaMapMarkerAlt className="text-red-400 mt-1" />
                <div>
                  <p className="text-gray-400 text-sm">Address</p>
                  <p className="text-white">{student.address}</p>
                </div>
              </div>
            )}

            {student.createdAt && (
              <div className="flex items-start gap-4 p-4 bg-gray-700/50 rounded-lg">
                <FaCalendarAlt className="text-purple-400 mt-1" />
                <div>
                  <p className="text-gray-400 text-sm">Registered On</p>
                  <p className="text-white">
                    {new Date(student.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Courses Section */}
          {student.courses && student.courses.length > 0 && (
            <div className="mt-8">
              <h3 className="text-xl font-bold mb-4">Enrolled Courses</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {student.courses.map((course) => (
                  <div
                    key={course._id}
                    className="bg-gray-700/50 p-4 rounded-lg border border-gray-600"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-semibold text-blue-400">{course.courseCode}</h4>
                        <p className="text-white">{course.courseName}</p>
                      </div>
                      <span className="text-xs text-gray-400">{course.credits || 3} Credits</span>
                    </div>
                    <div className="mt-3 pt-3 border-t border-gray-600">
                      <p className="text-sm text-gray-300">
                        <span className="font-medium">Teacher:</span>{" "}
                        {course.teacherId?.name || "Not Assigned"}
                      </p>
                      <p className="text-sm text-gray-300 mt-1">
                        <span className="font-medium">Department:</span>{" "}
                        {course.teacherId?.department || "N/A"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentProfile;

