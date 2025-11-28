import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaCalendarCheck, FaCheck, FaTimes, FaClock } from "react-icons/fa";

const AttendanceManagement = () => {
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
  const [attendanceList, setAttendanceList] = useState([]);
  const [viewMode, setViewMode] = useState("mark"); // 'mark' or 'view'

  useEffect(() => {
    fetchStudents();
    fetchCourses();
  }, []);

  useEffect(() => {
    if (selectedCourse && selectedDate && viewMode === "view") {
      fetchAttendance();
    }
  }, [selectedCourse, selectedDate, viewMode]);

  const fetchStudents = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/students");
      setStudents(res.data || []);
    } catch (error) {
      console.error("Error fetching students:", error);
    }
  };

  const fetchCourses = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/courses");
      setCourses(res.data || []);
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  const fetchAttendance = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/attendance", {
        params: { courseId: selectedCourse, date: selectedDate },
      });
      setAttendanceList(res.data || []);
    } catch (error) {
      console.error("Error fetching attendance:", error);
    }
  };

  const handleAttendanceChange = (studentId, status) => {
    setAttendanceList((prev) => {
      const existing = prev.find((a) => a.studentId._id === studentId || a.studentId === studentId);
      if (existing) {
        return prev.map((a) =>
          (a.studentId._id === studentId || a.studentId === studentId)
            ? { ...a, status }
            : a
        );
      } else {
        return [...prev, { studentId, status, courseId: selectedCourse }];
      }
    });
  };

  const handleBulkAttendance = async () => {
    if (!selectedCourse) {
      alert("Please select a course");
      return;
    }
    if (attendanceList.length === 0) {
      alert("Please mark attendance for at least one student");
      return;
    }

    try {
      const attendanceData = attendanceList.map((item) => ({
        studentId: typeof item.studentId === "object" ? item.studentId._id : item.studentId,
        status: item.status,
        remarks: item.remarks || "",
      }));

      await axios.post("http://localhost:5000/api/attendance/bulk", {
        courseId: selectedCourse,
        date: selectedDate,
        attendanceList: attendanceData,
      });

      alert("Attendance marked successfully!");
      setAttendanceList([]);
    } catch (error) {
      alert("Error: " + (error.response?.data?.error || error.message));
    }
  };

  const filteredStudents = selectedCourse
    ? students.filter((student) => {
        const course = courses.find((c) => c._id === selectedCourse);
        return (
          course &&
          student.class === course.class &&
          student.batchYear === course.batchYear
        );
      })
    : [];

  return (
    <div className="flex-1 p-6 ml-64 bg-gray-900 text-white min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <FaCalendarCheck /> Attendance Management
        </h2>
        <div className="flex gap-3">
          <button
            onClick={() => setViewMode("mark")}
            className={`px-4 py-2 rounded-lg transition ${
              viewMode === "mark"
                ? "bg-blue-600 text-white"
                : "bg-gray-700 text-gray-300 hover:bg-gray-600"
            }`}
          >
            Mark Attendance
          </button>
          <button
            onClick={() => setViewMode("view")}
            className={`px-4 py-2 rounded-lg transition ${
              viewMode === "view"
                ? "bg-blue-600 text-white"
                : "bg-gray-700 text-gray-300 hover:bg-gray-600"
            }`}
          >
            View Attendance
          </button>
        </div>
      </div>

      <div className="bg-gray-800 p-6 rounded-lg mb-6">
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block mb-2 text-sm font-medium">Select Course</label>
            <select
              value={selectedCourse}
              onChange={(e) => {
                setSelectedCourse(e.target.value);
                setAttendanceList([]);
              }}
              className="w-full p-3 rounded bg-gray-700 text-white"
              required
            >
              <option value="">Select Course</option>
              {courses.map((course) => (
                <option key={course._id} value={course._id}>
                  {course.courseCode} - {course.courseName}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium">Date</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full p-3 rounded bg-gray-700 text-white"
              required
            />
          </div>
          {viewMode === "mark" && (
            <div className="flex items-end">
              <button
                onClick={handleBulkAttendance}
                disabled={!selectedCourse || attendanceList.length === 0}
                className="w-full bg-green-600 px-4 py-3 rounded-lg hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Save Attendance
              </button>
            </div>
          )}
        </div>
      </div>

      {viewMode === "mark" && selectedCourse && (
        <div className="bg-gray-800 rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-700">
              <tr className="text-left">
                <th className="p-3 font-medium">Student ID</th>
                <th className="p-3 font-medium">Name</th>
                <th className="p-3 font-medium">Class</th>
                <th className="p-3 font-medium">Present</th>
                <th className="p-3 font-medium">Absent</th>
                <th className="p-3 font-medium">Late</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.length > 0 ? (
                filteredStudents.map((student) => {
                  const attendance = attendanceList.find(
                    (a) => a.studentId._id === student._id || a.studentId === student._id
                  );
                  const status = attendance?.status || "Present";
                  return (
                    <tr
                      key={student._id}
                      className="border-b border-gray-700 hover:bg-gray-700 transition"
                    >
                      <td className="p-3 font-mono text-sm text-blue-400">
                        {student.studentId || "N/A"}
                      </td>
                      <td className="p-3">{student.name}</td>
                      <td className="p-3">{student.class}</td>
                      <td className="p-3">
                        <button
                          onClick={() => handleAttendanceChange(student._id, "Present")}
                          className={`p-2 rounded ${
                            status === "Present"
                              ? "bg-green-600 text-white"
                              : "bg-gray-700 text-gray-400 hover:bg-gray-600"
                          }`}
                        >
                          <FaCheck />
                        </button>
                      </td>
                      <td className="p-3">
                        <button
                          onClick={() => handleAttendanceChange(student._id, "Absent")}
                          className={`p-2 rounded ${
                            status === "Absent"
                              ? "bg-red-600 text-white"
                              : "bg-gray-700 text-gray-400 hover:bg-gray-600"
                          }`}
                        >
                          <FaTimes />
                        </button>
                      </td>
                      <td className="p-3">
                        <button
                          onClick={() => handleAttendanceChange(student._id, "Late")}
                          className={`p-2 rounded ${
                            status === "Late"
                              ? "bg-yellow-600 text-white"
                              : "bg-gray-700 text-gray-400 hover:bg-gray-600"
                          }`}
                        >
                          <FaClock />
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-gray-400">
                    No students found for this course
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {viewMode === "view" && selectedCourse && (
        <div className="bg-gray-800 rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-700">
              <tr className="text-left">
                <th className="p-3 font-medium">Student ID</th>
                <th className="p-3 font-medium">Name</th>
                <th className="p-3 font-medium">Status</th>
                <th className="p-3 font-medium">Remarks</th>
              </tr>
            </thead>
            <tbody>
              {attendanceList.length > 0 ? (
                attendanceList.map((attendance) => (
                  <tr
                    key={attendance._id}
                    className="border-b border-gray-700 hover:bg-gray-700 transition"
                  >
                    <td className="p-3 font-mono text-sm text-blue-400">
                      {attendance.studentId?.studentId || "N/A"}
                    </td>
                    <td className="p-3">{attendance.studentId?.name || "N/A"}</td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-1 rounded text-xs ${
                          attendance.status === "Present"
                            ? "bg-green-500/20 text-green-300"
                            : attendance.status === "Late"
                            ? "bg-yellow-500/20 text-yellow-300"
                            : "bg-red-500/20 text-red-300"
                        }`}
                      >
                        {attendance.status}
                      </span>
                    </td>
                    <td className="p-3">{attendance.remarks || "-"}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="p-8 text-center text-gray-400">
                    No attendance records found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AttendanceManagement;

