import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const Dashboard = () => {
  const [students, setStudents] = useState([]);
  const [totalStudents, setTotalStudents] = useState(0);
  const [batchData, setBatchData] = useState([]);
  const [genderData, setGenderData] = useState([]);
  const [maleCount, setMaleCount] = useState(0);
  const [femaleCount, setFemaleCount] = useState(0);
  const navigate = useNavigate();

  const COLORS = ["#4f46e5", "#ec4899", "#10b981", "#f59e0b"];

  useEffect(() => {
    fetchStudent();
  }, []);

  const fetchStudent = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/students");
      const data = res.data || [];
      setStudents(data);
      setTotalStudents(data.length);

      // Batch-wise count
      const batchCount = data.reduce((acc, s) => {
        const batch = s.batchYear || "Unknown";
        acc[batch] = (acc[batch] || 0) + 1;
        return acc;
      }, {});

      // Convert to array for chart
      const chartData = Object.keys(batchCount).map(batch => ({
        batchYear: batch,
        count: batchCount[batch]
      }));

      setBatchData(chartData);

      // Gender statistics
      const male = data.filter(s => s.gender === "Male").length;
      const female = data.filter(s => s.gender === "Female").length;
      setMaleCount(male);
      setFemaleCount(female);
      setGenderData([
        { name: "Male", value: male },
        { name: "Female", value: female }
      ]);
    } catch (error) {
      console.error("Error:", error);
      if (error.response?.status === 401) {
        alert("Session expired. Please login again.");
        window.location.href = "/login";
      }
    }
  };

  return (
    <div className="flex-1 p-6 ml-64 bg-gray-900 text-white min-h-screen">
      <h2 className="text-3xl font-bold mb-6">Admin Dashboard</h2>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-r from-indigo-600 to-indigo-800 p-6 rounded-lg text-center shadow-lg transform hover:scale-105 transition">
          <h3 className="text-lg font-semibold text-gray-200">Total Students</h3>
          <p className="text-4xl font-bold mt-2">{totalStudents}</p>
        </div>
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-6 rounded-lg text-center shadow-lg transform hover:scale-105 transition">
          <h3 className="text-lg font-semibold text-gray-200">Male Students</h3>
          <p className="text-4xl font-bold mt-2">{maleCount}</p>
        </div>
        <div className="bg-gradient-to-r from-pink-600 to-pink-800 p-6 rounded-lg text-center shadow-lg transform hover:scale-105 transition">
          <h3 className="text-lg font-semibold text-gray-200">Female Students</h3>
          <p className="text-4xl font-bold mt-2">{femaleCount}</p>
        </div>
        <div className="bg-gradient-to-r from-green-600 to-green-800 p-6 rounded-lg text-center shadow-lg transform hover:scale-105 transition">
          <h3 className="text-lg font-semibold text-gray-200">Batches</h3>
          <p className="text-4xl font-bold mt-2">{batchData.length}</p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Batch-wise Bar Chart */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
          <h3 className="text-xl font-bold mb-4 text-center">Students by Batch Year</h3>
          {batchData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={batchData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                <XAxis dataKey="batchYear" stroke="#ccc" />
                <YAxis stroke="#ccc" />
                <Tooltip
                  contentStyle={{ backgroundColor: "#1a1a1a", border: "1px solid #444" }}
                  labelStyle={{ color: "#fff" }}
                />
                <Legend />
                <Bar dataKey="count" fill="#4f46e5" radius={[10, 10, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-center text-gray-400">No data available</p>
          )}
        </div>

        {/* Gender Distribution Pie Chart */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
          <h3 className="text-xl font-bold mb-4 text-center">Gender Distribution</h3>
          {genderData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={genderData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {genderData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: "#1a1a1a", border: "1px solid #444" }}
                  labelStyle={{ color: "#fff" }}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-center text-gray-400">No data available</p>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8 flex gap-4 justify-center">
        <button
          onClick={() => navigate("/add")}
          className="bg-blue-600 px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition"
        >
          Add Student
        </button>
        <button
          onClick={() => navigate("/manage")}
          className="bg-purple-600 px-6 py-3 rounded-lg font-medium hover:bg-purple-700 transition"
        >
          Manage Students
        </button>
      </div>
    </div>
  );
};

export default Dashboard;