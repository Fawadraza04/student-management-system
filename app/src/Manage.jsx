import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaEdit, FaTrash, FaEye, FaFilter, FaSort } from "react-icons/fa";
import API_BASE_URL from "./config/api";

const Manage = () => {
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [studentsPerPage] = useState(10);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [filters, setFilters] = useState({
    gender: "",
    class: "",
    batchYear: "",
    status: "",
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchStudents();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filters]);

  const fetchStudents = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/students`);
      setStudents(res.data || []);
    } catch (error) {
      console.error("Error fetching students:", error);
      if (error.response?.status === 401) {
        alert("Session expired. Please login again.");
        navigate("/login");
      }
    }
  };

  const deleteStudent = async (id) => {
    if (window.confirm("Are you sure you want to delete this student?")) {
      try {
        await axios.delete(`${API_BASE_URL}/api/student/${id}`);
        setStudents(students.filter((s) => s._id !== id));
        setSelectedStudents(selectedStudents.filter((sid) => sid !== id));
        alert("Student deleted!");
      } catch (error) {
        alert("Failed to delete student: " + (error.response?.data?.error || error.message));
      }
    }
  };

  const handleBulkDelete = async () => {
    if (selectedStudents.length === 0) {
      alert("Please select at least one student");
      return;
    }
    if (window.confirm(`Are you sure you want to delete ${selectedStudents.length} student(s)?`)) {
      try {
        await axios.post(`${API_BASE_URL}/api/students/bulk-delete`, {
          ids: selectedStudents,
        });
        setStudents(students.filter((s) => !selectedStudents.includes(s._id)));
        setSelectedStudents([]);
        alert(`${selectedStudents.length} student(s) deleted successfully!`);
      } catch (error) {
        alert("Failed to delete students: " + (error.response?.data?.error || error.message));
      }
    }
  };


  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedStudents(filteredAndSortedStudents.map((s) => s._id));
    } else {
      setSelectedStudents([]);
    }
  };

  const handleSelectStudent = (id) => {
    if (selectedStudents.includes(id)) {
      setSelectedStudents(selectedStudents.filter((sid) => sid !== id));
    } else {
      setSelectedStudents([...selectedStudents, id]);
    }
  };

  // Filter students
  let filteredStudents = (students || [])
    .filter((student) => student && student.name && student._id)
    .filter(
      (student) =>
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.class.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.batchYear.includes(searchTerm) ||
        (student.studentId && student.studentId.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    .filter((student) => !filters.gender || student.gender === filters.gender)
    .filter((student) => !filters.class || student.class === filters.class)
    .filter((student) => !filters.batchYear || student.batchYear === filters.batchYear)
    .filter((student) => !filters.status || (student.status || "Active") === filters.status);

  // Sort students
  const filteredAndSortedStudents = [...filteredStudents].sort((a, b) => {
    let aValue = a[sortBy] || "";
    let bValue = b[sortBy] || "";

    if (sortBy === "createdAt") {
      aValue = new Date(a.createdAt);
      bValue = new Date(b.createdAt);
    } else {
      aValue = String(aValue).toLowerCase();
      bValue = String(bValue).toLowerCase();
    }

    if (sortOrder === "asc") {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  // Pagination
  const indexOfLastStudent = currentPage * studentsPerPage;
  const indexOfFirstStudent = indexOfLastStudent - studentsPerPage;
  const currentStudents = filteredAndSortedStudents.slice(indexOfFirstStudent, indexOfLastStudent);
  const totalPages = Math.ceil(filteredAndSortedStudents.length / studentsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
  };

  // Get unique values for filters
  const uniqueClasses = [...new Set(students.map((s) => s.class).filter(Boolean))];
  const uniqueBatches = [...new Set(students.map((s) => s.batchYear).filter(Boolean))];

  return (
    <div className="flex-1 p-4 lg:p-6 mt-16 lg:mt-0 lg:ml-64 bg-gray-900 text-white min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Manage Students</h2>
        {selectedStudents.length > 0 && (
          <button
            onClick={handleBulkDelete}
            className="flex items-center gap-2 bg-red-600 px-4 py-2 rounded-lg hover:bg-red-700 transition"
          >
            <FaTrash /> Delete Selected ({selectedStudents.length})
          </button>
        )}
      </div>

      {/* Search and Filters */}
      <div className="bg-gray-800 p-4 rounded-lg mb-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-4">
          <input
            type="text"
            placeholder="Search by name, ID, class, or batch..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="p-2 rounded bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <select
            value={filters.gender}
            onChange={(e) => setFilters({ ...filters, gender: e.target.value })}
            className="p-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Genders</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
          <select
            value={filters.class}
            onChange={(e) => setFilters({ ...filters, class: e.target.value })}
            className="p-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Classes</option>
            {uniqueClasses.map((cls) => (
              <option key={cls} value={cls}>
                {cls}
              </option>
            ))}
          </select>
          <select
            value={filters.batchYear}
            onChange={(e) => setFilters({ ...filters, batchYear: e.target.value })}
            className="p-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Batches</option>
            {uniqueBatches.map((batch) => (
              <option key={batch} value={batch}>
                {batch}
              </option>
            ))}
          </select>
          <select
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            className="p-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Status</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>
        {(filters.gender || filters.class || filters.batchYear || filters.status) && (
          <button
            onClick={() => setFilters({ gender: "", class: "", batchYear: "", status: "" })}
            className="text-blue-400 hover:text-blue-300 text-sm"
          >
            Clear Filters
          </button>
        )}
      </div>

      {/* Table */}
      <div className="bg-gray-800 rounded-lg overflow-hidden overflow-x-auto">
        <table className="w-full min-w-[800px]">
          <thead className="bg-gray-700">
            <tr className="text-left">
              <th className="p-3">
                <input
                  type="checkbox"
                  checked={selectedStudents.length === currentStudents.length && currentStudents.length > 0}
                  onChange={handleSelectAll}
                  className="cursor-pointer"
                />
              </th>
              <th
                className="p-3 font-medium cursor-pointer hover:bg-gray-600"
                onClick={() => handleSort("studentId")}
              >
                <div className="flex items-center gap-2">
                  Student ID
                  <FaSort className="text-xs" />
                </div>
              </th>
              <th
                className="p-3 font-medium cursor-pointer hover:bg-gray-600"
                onClick={() => handleSort("name")}
              >
                <div className="flex items-center gap-2">
                  Name
                  <FaSort className="text-xs" />
                </div>
              </th>
              <th
                className="p-3 font-medium cursor-pointer hover:bg-gray-600"
                onClick={() => handleSort("class")}
              >
                <div className="flex items-center gap-2">
                  Class
                  <FaSort className="text-xs" />
                </div>
              </th>
              <th
                className="p-3 font-medium cursor-pointer hover:bg-gray-600"
                onClick={() => handleSort("batchYear")}
              >
                <div className="flex items-center gap-2">
                  Batch
                  <FaSort className="text-xs" />
                </div>
              </th>
              <th className="p-3 font-medium">Gender</th>
              <th className="p-3 font-medium">Status</th>
              <th className="p-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentStudents.length > 0 ? (
              currentStudents.map((student) => (
                <tr
                  key={student._id}
                  className="border-b border-gray-700 hover:bg-gray-700 transition"
                >
                  <td className="p-3">
                    <input
                      type="checkbox"
                      checked={selectedStudents.includes(student._id)}
                      onChange={() => handleSelectStudent(student._id)}
                      className="cursor-pointer"
                    />
                  </td>
                  <td className="p-3 font-mono text-sm text-blue-400">
                    {student.studentId || "N/A"}
                  </td>
                  <td className="p-3">{student.name}</td>
                  <td className="p-3">{student.class}</td>
                  <td className="p-3">{student.batchYear}</td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-1 rounded text-xs ${
                        student.gender === "Male"
                          ? "bg-blue-500/20 text-blue-300"
                          : "bg-pink-500/20 text-pink-300"
                      }`}
                    >
                      {student.gender}
                    </span>
                  </td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-1 rounded text-xs ${
                        (student.status || "Active") === "Active"
                          ? "bg-green-500/20 text-green-300"
                          : "bg-red-500/20 text-red-300"
                      }`}
                    >
                      {student.status || "Active"}
                    </span>
                  </td>
                  <td className="p-3">
                    <div className="flex gap-3 items-center">
                      <button
                        onClick={() => navigate(`/student/${student._id}`)}
                        className="text-blue-500 hover:text-blue-300 transition transform hover:scale-110 cursor-pointer"
                        title="View Profile"
                      >
                        <FaEye size={18} />
                      </button>
                      <button
                        onClick={() => navigate(`/edit/${student._id}`)}
                        className="text-yellow-500 hover:text-yellow-300 transition transform hover:scale-110 cursor-pointer"
                        title="Edit Student"
                      >
                        <FaEdit size={18} />
                      </button>
                      <button
                        onClick={() => deleteStudent(student._id)}
                        className="text-red-500 hover:text-red-300 transition transform hover:scale-110 cursor-pointer"
                        title="Delete Student"
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
                  No students found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-6 flex justify-center items-center gap-2">
          <button
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          {[...Array(totalPages)].map((_, index) => {
            const page = index + 1;
            if (
              page === 1 ||
              page === totalPages ||
              (page >= currentPage - 1 && page <= currentPage + 1)
            ) {
              return (
                <button
                  key={page}
                  onClick={() => paginate(page)}
                  className={`px-4 py-2 rounded-lg ${
                    currentPage === page
                      ? "bg-blue-600 text-white"
                      : "bg-gray-700 text-white hover:bg-gray-600"
                  }`}
                >
                  {page}
                </button>
              );
            } else if (page === currentPage - 2 || page === currentPage + 2) {
              return <span key={page} className="text-gray-400">...</span>;
            }
            return null;
          })}
          <button
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      )}

      <div className="mt-4 text-center text-gray-400">
        Showing {indexOfFirstStudent + 1} to {Math.min(indexOfLastStudent, filteredAndSortedStudents.length)} of{" "}
        {filteredAndSortedStudents.length} students
      </div>
    </div>
  );
};

export default Manage;
