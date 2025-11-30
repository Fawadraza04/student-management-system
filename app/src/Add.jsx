import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import API_BASE_URL from "./config/api";

const Add = () => {
  const [studentData, setStudentData] = useState({
    name: "",
    class: "",
    batchYear: "",
    gender: "",
    email: "",
    phone: "",
    address: "",
    status: "Active",
  });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_BASE_URL}/api/student`, studentData);
      alert("Student added: " + studentData.name);
      setStudentData({ name: "", class: "", batchYear: "", gender: "", email: "", phone: "", address: "", status: "Active" });
      navigate("/manage");
    } catch (error) {
      alert("Error: " + (error.response?.data?.error || error.message));
    }
  };

  return (
      <div className="flex-1 p-4 lg:p-6 mt-16 lg:mt-0 lg:ml-64 bg-gray-900 text-white min-h-screen">
        <h2 className="text-2xl font-bold mb-6">Add New Student</h2>

        <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl">
          <input
            type="text"
            placeholder="Name"
            value={studentData.name}
            onChange={(e) => setStudentData({ ...studentData, name: e.target.value })}
            className="w-full p-2 rounded bg-gray-700 text-white"
            required
          />

          <input
            type="text"
            placeholder="Class"
            value={studentData.class}
            onChange={(e) => setStudentData({ ...studentData, class: e.target.value })}
            className="w-full p-2 rounded bg-gray-700 text-white"
            required
          />

          <input
            type="text"
            placeholder="Batch Year"
            value={studentData.batchYear}
            onChange={(e) => setStudentData({ ...studentData, batchYear: e.target.value })}
            className="w-full p-2 rounded bg-gray-700 text-white"
            required
          />

          <select
            value={studentData.gender}
            onChange={(e) => setStudentData({ ...studentData, gender: e.target.value })}
            className="w-full p-2 rounded bg-gray-700 text-white"
            required
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>

          <input
            type="email"
            placeholder="Email (Optional)"
            value={studentData.email}
            onChange={(e) => setStudentData({ ...studentData, email: e.target.value })}
            className="w-full p-2 rounded bg-gray-700 text-white"
          />

          <input
            type="tel"
            placeholder="Phone (Optional)"
            value={studentData.phone}
            onChange={(e) => setStudentData({ ...studentData, phone: e.target.value })}
            className="w-full p-2 rounded bg-gray-700 text-white"
          />

          <textarea
            placeholder="Address (Optional)"
            value={studentData.address}
            onChange={(e) => setStudentData({ ...studentData, address: e.target.value })}
            className="w-full p-2 rounded bg-gray-700 text-white"
            rows="3"
          />

          <select
            value={studentData.status}
            onChange={(e) => setStudentData({ ...studentData, status: e.target.value })}
            className="w-full p-2 rounded bg-gray-700 text-white"
          >
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>

          <button
            type="submit"
            className="bg-blue-500 p-2 rounded hover:bg-blue-600 transition cursor-pointer w-full py-3 font-semibold"
          >
            Add Student
          </button>
        </form>
    </div>
  );
};

export default Add;