import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaEdit, FaTrash, FaBook, FaUserPlus } from "react-icons/fa";

const CourseManagement = () => {
  const [courses, setCourses] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [formData, setFormData] = useState({
    courseCode: "",
    courseName: "",
    description: "",
    credits: 3,
    teacherId: "",
    class: "",
    batchYear: "",
    status: "Active",
  });

  useEffect(() => {
    fetchCourses();
    fetchTeachers();
  }, []);

  const fetchCourses = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/courses");
      setCourses(res.data || []);
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  const fetchTeachers = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/teachers");
      setTeachers(res.data || []);
    } catch (error) {
      console.error("Error fetching teachers:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCourse) {
        await axios.put(`http://localhost:5000/api/course/${editingCourse._id}`, formData);
        alert("Course updated successfully!");
      } else {
        await axios.post("http://localhost:5000/api/course", formData);
        alert("Course added successfully!");
      }
      setShowForm(false);
      setEditingCourse(null);
      setFormData({
        courseCode: "",
        courseName: "",
        description: "",
        credits: 3,
        teacherId: "",
        class: "",
        batchYear: "",
        status: "Active",
      });
      fetchCourses();
    } catch (error) {
      alert("Error: " + (error.response?.data?.error || error.message));
    }
  };

  const handleEdit = (course) => {
    setEditingCourse(course);
    setFormData({
      courseCode: course.courseCode,
      courseName: course.courseName,
      description: course.description || "",
      credits: course.credits || 3,
      teacherId: course.teacherId._id || course.teacherId,
      class: course.class,
      batchYear: course.batchYear,
      status: course.status || "Active",
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this course?")) {
      try {
        await axios.delete(`http://localhost:5000/api/course/${id}`);
        alert("Course deleted!");
        fetchCourses();
      } catch (error) {
        alert("Failed to delete: " + (error.response?.data?.error || error.message));
      }
    }
  };

  return (
    <div className="flex-1 p-6 ml-64 bg-gray-900 text-white min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <FaBook /> Course Management
        </h2>
        <button
          onClick={() => {
            setShowForm(!showForm);
            setEditingCourse(null);
            setFormData({
              courseCode: "",
              courseName: "",
              description: "",
              credits: 3,
              teacherId: "",
              class: "",
              batchYear: "",
              status: "Active",
            });
          }}
          className="flex items-center gap-2 bg-blue-600 px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          <FaUserPlus /> {showForm ? "Cancel" : "Add Course"}
        </button>
      </div>

      {showForm && (
        <div className="bg-gray-800 p-6 rounded-lg mb-6">
          <h3 className="text-xl font-bold mb-4">
            {editingCourse ? "Edit Course" : "Add New Course"}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Course Code *"
                value={formData.courseCode}
                onChange={(e) => setFormData({ ...formData, courseCode: e.target.value })}
                className="p-3 rounded bg-gray-700 text-white"
                required
              />
              <input
                type="text"
                placeholder="Course Name *"
                value={formData.courseName}
                onChange={(e) => setFormData({ ...formData, courseName: e.target.value })}
                className="p-3 rounded bg-gray-700 text-white"
                required
              />
              <select
                value={formData.teacherId}
                onChange={(e) => setFormData({ ...formData, teacherId: e.target.value })}
                className="p-3 rounded bg-gray-700 text-white"
                required
              >
                <option value="">Select Teacher *</option>
                {teachers.map((teacher) => (
                  <option key={teacher._id} value={teacher._id}>
                    {teacher.name} ({teacher.department})
                  </option>
                ))}
              </select>
              <input
                type="number"
                placeholder="Credits"
                value={formData.credits}
                onChange={(e) => setFormData({ ...formData, credits: parseInt(e.target.value) || 3 })}
                className="p-3 rounded bg-gray-700 text-white"
                min="1"
                max="6"
              />
              <input
                type="text"
                placeholder="Class *"
                value={formData.class}
                onChange={(e) => setFormData({ ...formData, class: e.target.value })}
                className="p-3 rounded bg-gray-700 text-white"
                required
              />
              <input
                type="text"
                placeholder="Batch Year *"
                value={formData.batchYear}
                onChange={(e) => setFormData({ ...formData, batchYear: e.target.value })}
                className="p-3 rounded bg-gray-700 text-white"
                required
              />
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="p-3 rounded bg-gray-700 text-white"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
            <textarea
              placeholder="Description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full p-3 rounded bg-gray-700 text-white"
              rows="3"
            />
            <button
              type="submit"
              className="bg-green-600 p-3 rounded hover:bg-green-700 transition w-full"
            >
              {editingCourse ? "Update Course" : "Add Course"}
            </button>
          </form>
        </div>
      )}

      <div className="bg-gray-800 rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-700">
            <tr className="text-left">
              <th className="p-3 font-medium">Course Code</th>
              <th className="p-3 font-medium">Course Name</th>
              <th className="p-3 font-medium">Teacher</th>
              <th className="p-3 font-medium">Class</th>
              <th className="p-3 font-medium">Batch</th>
              <th className="p-3 font-medium">Credits</th>
              <th className="p-3 font-medium">Status</th>
              <th className="p-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {courses.length > 0 ? (
              courses.map((course) => (
                <tr
                  key={course._id}
                  className="border-b border-gray-700 hover:bg-gray-700 transition"
                >
                  <td className="p-3 font-mono text-sm text-blue-400">{course.courseCode}</td>
                  <td className="p-3">{course.courseName}</td>
                  <td className="p-3">
                    {course.teacherId?.name || "N/A"}
                  </td>
                  <td className="p-3">{course.class}</td>
                  <td className="p-3">{course.batchYear}</td>
                  <td className="p-3">{course.credits || 3}</td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-1 rounded text-xs ${
                        (course.status || "Active") === "Active"
                          ? "bg-green-500/20 text-green-300"
                          : "bg-red-500/20 text-red-300"
                      }`}
                    >
                      {course.status || "Active"}
                    </span>
                  </td>
                  <td className="p-3">
                    <div className="flex gap-3">
                      <button
                        onClick={() => handleEdit(course)}
                        className="text-yellow-500 hover:text-yellow-300 transition"
                      >
                        <FaEdit size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(course._id)}
                        className="text-red-500 hover:text-red-300 transition"
                      >
                        <FaTrash size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="p-8 text-center text-gray-400">
                  No courses found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CourseManagement;

