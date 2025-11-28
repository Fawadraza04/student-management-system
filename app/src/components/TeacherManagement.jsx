import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaEdit, FaTrash, FaUserPlus, FaChalkboardTeacher } from "react-icons/fa";

const TeacherManagement = () => {
  const [teachers, setTeachers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    department: "",
    qualification: "",
    experience: 0,
    status: "Active",
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchTeachers();
  }, []);

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
      if (editingTeacher) {
        await axios.put(`http://localhost:5000/api/teacher/${editingTeacher._id}`, formData);
        alert("Teacher updated successfully!");
      } else {
        await axios.post("http://localhost:5000/api/teacher", formData);
        alert("Teacher added successfully!");
      }
      setShowForm(false);
      setEditingTeacher(null);
      setFormData({
        name: "",
        email: "",
        phone: "",
        department: "",
        qualification: "",
        experience: 0,
        status: "Active",
      });
      fetchTeachers();
    } catch (error) {
      alert("Error: " + (error.response?.data?.error || error.message));
    }
  };

  const handleEdit = (teacher) => {
    setEditingTeacher(teacher);
    setFormData({
      name: teacher.name,
      email: teacher.email,
      phone: teacher.phone,
      department: teacher.department,
      qualification: teacher.qualification || "",
      experience: teacher.experience || 0,
      status: teacher.status || "Active",
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this teacher?")) {
      try {
        await axios.delete(`http://localhost:5000/api/teacher/${id}`);
        alert("Teacher deleted!");
        fetchTeachers();
      } catch (error) {
        alert("Failed to delete: " + (error.response?.data?.error || error.message));
      }
    }
  };

  return (
    <div className="flex-1 p-4 lg:p-6 mt-16 lg:mt-0 lg:ml-64 bg-gray-900 text-white min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <FaChalkboardTeacher /> Teacher Management
        </h2>
        <button
          onClick={() => {
            setShowForm(!showForm);
            setEditingTeacher(null);
            setFormData({
              name: "",
              email: "",
              phone: "",
              department: "",
              qualification: "",
              experience: 0,
              status: "Active",
            });
          }}
          className="flex items-center gap-2 bg-blue-600 px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          <FaUserPlus /> {showForm ? "Cancel" : "Add Teacher"}
        </button>
      </div>

      {showForm && (
        <div className="bg-gray-800 p-6 rounded-lg mb-6">
          <h3 className="text-xl font-bold mb-4">
            {editingTeacher ? "Edit Teacher" : "Add New Teacher"}
          </h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Name *"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="p-3 rounded bg-gray-700 text-white"
              required
            />
            <input
              type="email"
              placeholder="Email *"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="p-3 rounded bg-gray-700 text-white"
              required
            />
            <input
              type="tel"
              placeholder="Phone *"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="p-3 rounded bg-gray-700 text-white"
              required
            />
            <input
              type="text"
              placeholder="Department *"
              value={formData.department}
              onChange={(e) => setFormData({ ...formData, department: e.target.value })}
              className="p-3 rounded bg-gray-700 text-white"
              required
            />
            <input
              type="text"
              placeholder="Qualification"
              value={formData.qualification}
              onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
              className="p-3 rounded bg-gray-700 text-white"
            />
            <input
              type="number"
              placeholder="Experience (years)"
              value={formData.experience}
              onChange={(e) => setFormData({ ...formData, experience: parseInt(e.target.value) || 0 })}
              className="p-3 rounded bg-gray-700 text-white"
              min="0"
            />
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="p-3 rounded bg-gray-700 text-white"
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
            <button
              type="submit"
              className="bg-green-600 p-3 rounded hover:bg-green-700 transition"
            >
              {editingTeacher ? "Update Teacher" : "Add Teacher"}
            </button>
          </form>
        </div>
      )}

      <div className="bg-gray-800 rounded-lg overflow-hidden overflow-x-auto">
        <table className="w-full min-w-[700px]">
          <thead className="bg-gray-700">
            <tr className="text-left">
              <th className="p-3 font-medium">Teacher ID</th>
              <th className="p-3 font-medium">Name</th>
              <th className="p-3 font-medium">Email</th>
              <th className="p-3 font-medium">Phone</th>
              <th className="p-3 font-medium">Department</th>
              <th className="p-3 font-medium">Status</th>
              <th className="p-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {teachers.length > 0 ? (
              teachers.map((teacher) => (
                <tr
                  key={teacher._id}
                  className="border-b border-gray-700 hover:bg-gray-700 transition"
                >
                  <td className="p-3 font-mono text-sm text-blue-400">
                    {teacher.teacherId || "N/A"}
                  </td>
                  <td className="p-3">{teacher.name}</td>
                  <td className="p-3">{teacher.email}</td>
                  <td className="p-3">{teacher.phone}</td>
                  <td className="p-3">{teacher.department}</td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-1 rounded text-xs ${
                        (teacher.status || "Active") === "Active"
                          ? "bg-green-500/20 text-green-300"
                          : "bg-red-500/20 text-red-300"
                      }`}
                    >
                      {teacher.status || "Active"}
                    </span>
                  </td>
                  <td className="p-3">
                    <div className="flex gap-3">
                      <button
                        onClick={() => handleEdit(teacher)}
                        className="text-yellow-500 hover:text-yellow-300 transition"
                      >
                        <FaEdit size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(teacher._id)}
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
                <td colSpan="7" className="p-8 text-center text-gray-400">
                  No teachers found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TeacherManagement;

