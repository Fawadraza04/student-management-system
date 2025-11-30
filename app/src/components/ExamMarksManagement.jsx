import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaGraduationCap, FaEdit, FaTrash, FaUserPlus, FaChartLine } from "react-icons/fa";
import API_BASE_URL from "../config/api";

const ExamMarksManagement = () => {
  const [exams, setExams] = useState([]);
  const [courses, setCourses] = useState([]);
  const [students, setStudents] = useState([]);
  const [marks, setMarks] = useState([]);
  const [showExamForm, setShowExamForm] = useState(false);
  const [showMarksForm, setShowMarksForm] = useState(false);
  const [selectedExam, setSelectedExam] = useState(null);
  const [examFormData, setExamFormData] = useState({
    examName: "",
    courseId: "",
    examDate: "",
    maxMarks: 100,
    examType: "Quiz",
    description: "",
  });
  const [marksFormData, setMarksFormData] = useState({
    examId: "",
    courseId: "",
    marksList: [],
  });

  useEffect(() => {
    fetchExams();
    fetchCourses();
    fetchStudents();
  }, []);

  useEffect(() => {
    if (selectedExam) {
      fetchMarks();
    }
  }, [selectedExam]);

  const fetchExams = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/exams`);
      setExams(res.data || []);
    } catch (error) {
      console.error("Error fetching exams:", error);
    }
  };

  const fetchCourses = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/courses`);
      setCourses(res.data || []);
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  const fetchStudents = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/students`);
      setStudents(res.data || []);
    } catch (error) {
      console.error("Error fetching students:", error);
    }
  };

  const fetchMarks = async () => {
    if (!selectedExam) return;
    try {
      const res = await axios.get(`${API_BASE_URL}/api/marks`, {
        params: { examId: selectedExam._id },
      });
      setMarks(res.data || []);
    } catch (error) {
      console.error("Error fetching marks:", error);
    }
  };

  const handleExamSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_BASE_URL}/api/exam`, examFormData);
      alert("Exam created successfully!");
      setShowExamForm(false);
      setExamFormData({
        examName: "",
        courseId: "",
        examDate: "",
        maxMarks: 100,
        examType: "Quiz",
        description: "",
      });
      fetchExams();
    } catch (error) {
      alert("Error: " + (error.response?.data?.error || error.message));
    }
  };

  const handleMarksSubmit = async (e) => {
    e.preventDefault();
    if (!marksFormData.examId || !marksFormData.courseId) {
      alert("Please select exam and course");
      return;
    }
    if (marksFormData.marksList.length === 0) {
      alert("Please enter marks for at least one student");
      return;
    }

    try {
      await axios.post(`${API_BASE_URL}/api/marks/bulk`, {
        examId: marksFormData.examId,
        courseId: marksFormData.courseId,
        marksList: marksFormData.marksList,
      });
      alert("Marks added successfully!");
      setShowMarksForm(false);
      setMarksFormData({
        examId: "",
        courseId: "",
        marksList: [],
      });
      if (selectedExam) fetchMarks();
    } catch (error) {
      alert("Error: " + (error.response?.data?.error || error.message));
    }
  };

  const handleDeleteExam = async (id) => {
    if (window.confirm("Are you sure you want to delete this exam?")) {
      try {
        await axios.delete(`${API_BASE_URL}/api/exam/${id}`);
        alert("Exam deleted!");
        fetchExams();
      } catch (error) {
        alert("Failed to delete: " + (error.response?.data?.error || error.message));
      }
    }
  };

  const handleDeleteMarks = async (id) => {
    if (window.confirm("Are you sure you want to delete these marks?")) {
      try {
        await axios.delete(`${API_BASE_URL}/api/marks/${id}`);
        alert("Marks deleted!");
        fetchMarks();
      } catch (error) {
        alert("Failed to delete: " + (error.response?.data?.error || error.message));
      }
    }
  };

  const initializeMarksList = () => {
    if (!marksFormData.courseId) return;
    const course = courses.find((c) => c._id === marksFormData.courseId);
    if (!course) return;

    const courseStudents = students.filter(
      (s) => s.class === course.class && s.batchYear === course.batchYear
    );

    const exam = exams.find((e) => e._id === marksFormData.examId);
    const maxMarks = exam?.maxMarks || 100;

    setMarksFormData({
      ...marksFormData,
      marksList: courseStudents.map((student) => ({
        studentId: student._id,
        marksObtained: 0,
        maxMarks: maxMarks,
      })),
    });
  };

  useEffect(() => {
    if (marksFormData.examId && marksFormData.courseId) {
      initializeMarksList();
    }
  }, [marksFormData.examId, marksFormData.courseId]);

  return (
    <div className="flex-1 p-4 lg:p-6 mt-16 lg:mt-0 lg:ml-64 bg-gray-900 text-white min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <FaGraduationCap /> Exam & Marks Management
        </h2>
        <div className="flex gap-3">
          <button
            onClick={() => setShowExamForm(!showExamForm)}
            className="flex items-center gap-2 bg-blue-600 px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            <FaUserPlus /> {showExamForm ? "Cancel" : "Create Exam"}
          </button>
          <button
            onClick={() => setShowMarksForm(!showMarksForm)}
            className="flex items-center gap-2 bg-green-600 px-4 py-2 rounded-lg hover:bg-green-700 transition"
          >
            <FaChartLine /> {showMarksForm ? "Cancel" : "Add Marks"}
          </button>
        </div>
      </div>

      {showExamForm && (
        <div className="bg-gray-800 p-6 rounded-lg mb-6">
          <h3 className="text-xl font-bold mb-4">Create New Exam</h3>
          <form onSubmit={handleExamSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Exam Name *"
                value={examFormData.examName}
                onChange={(e) => setExamFormData({ ...examFormData, examName: e.target.value })}
                className="p-3 rounded bg-gray-700 text-white"
                required
              />
              <select
                value={examFormData.courseId}
                onChange={(e) => setExamFormData({ ...examFormData, courseId: e.target.value })}
                className="p-3 rounded bg-gray-700 text-white"
                required
              >
                <option value="">Select Course *</option>
                {courses.map((course) => (
                  <option key={course._id} value={course._id}>
                    {course.courseCode} - {course.courseName}
                  </option>
                ))}
              </select>
              <input
                type="date"
                value={examFormData.examDate}
                onChange={(e) => setExamFormData({ ...examFormData, examDate: e.target.value })}
                className="p-3 rounded bg-gray-700 text-white"
                required
              />
              <select
                value={examFormData.examType}
                onChange={(e) => setExamFormData({ ...examFormData, examType: e.target.value })}
                className="p-3 rounded bg-gray-700 text-white"
              >
                <option value="Quiz">Quiz</option>
                <option value="Midterm">Midterm</option>
                <option value="Final">Final</option>
                <option value="Assignment">Assignment</option>
              </select>
              <input
                type="number"
                placeholder="Max Marks"
                value={examFormData.maxMarks}
                onChange={(e) => setExamFormData({ ...examFormData, maxMarks: parseInt(e.target.value) || 100 })}
                className="p-3 rounded bg-gray-700 text-white"
                min="1"
                required
              />
            </div>
            <textarea
              placeholder="Description"
              value={examFormData.description}
              onChange={(e) => setExamFormData({ ...examFormData, description: e.target.value })}
              className="w-full p-3 rounded bg-gray-700 text-white"
              rows="3"
            />
            <button
              type="submit"
              className="bg-green-600 p-3 rounded hover:bg-green-700 transition w-full"
            >
              Create Exam
            </button>
          </form>
        </div>
      )}

      {showMarksForm && (
        <div className="bg-gray-800 p-6 rounded-lg mb-6">
          <h3 className="text-xl font-bold mb-4">Add Marks</h3>
          <form onSubmit={handleMarksSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <select
                value={marksFormData.examId}
                onChange={(e) => setMarksFormData({ ...marksFormData, examId: e.target.value, marksList: [] })}
                className="p-3 rounded bg-gray-700 text-white"
                required
              >
                <option value="">Select Exam *</option>
                {exams.map((exam) => (
                  <option key={exam._id} value={exam._id}>
                    {exam.examName} ({exam.courseId?.courseCode})
                  </option>
                ))}
              </select>
              <select
                value={marksFormData.courseId}
                onChange={(e) => setMarksFormData({ ...marksFormData, courseId: e.target.value, marksList: [] })}
                className="p-3 rounded bg-gray-700 text-white"
                required
              >
                <option value="">Select Course *</option>
                {courses.map((course) => (
                  <option key={course._id} value={course._id}>
                    {course.courseCode} - {course.courseName}
                  </option>
                ))}
              </select>
            </div>
            {marksFormData.marksList.length > 0 && (
              <div className="max-h-96 overflow-y-auto">
                <table className="w-full">
                  <thead className="bg-gray-700 sticky top-0">
                    <tr>
                      <th className="p-3 text-left">Student</th>
                      <th className="p-3 text-left">Marks Obtained</th>
                      <th className="p-3 text-left">Max Marks</th>
                    </tr>
                  </thead>
                  <tbody>
                    {marksFormData.marksList.map((item, index) => {
                      const student = students.find((s) => s._id === item.studentId);
                      return (
                        <tr key={index} className="border-b border-gray-700">
                          <td className="p-3">{student?.name || "N/A"}</td>
                          <td className="p-3">
                            <input
                              type="number"
                              value={item.marksObtained}
                              onChange={(e) => {
                                const newList = [...marksFormData.marksList];
                                newList[index].marksObtained = parseInt(e.target.value) || 0;
                                setMarksFormData({ ...marksFormData, marksList: newList });
                              }}
                              className="w-24 p-2 rounded bg-gray-700 text-white"
                              min="0"
                              max={item.maxMarks}
                            />
                          </td>
                          <td className="p-3">{item.maxMarks}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
            {marksFormData.marksList.length > 0 && (
              <button
                type="submit"
                className="bg-green-600 p-3 rounded hover:bg-green-700 transition w-full"
              >
                Save Marks
              </button>
            )}
          </form>
        </div>
      )}

      <div className="bg-gray-800 rounded-lg overflow-hidden mb-6 overflow-x-auto">
        <h3 className="text-xl font-bold p-4 border-b border-gray-700">Exams</h3>
        <table className="w-full min-w-[800px]">
          <thead className="bg-gray-700">
            <tr className="text-left">
              <th className="p-3 font-medium">Exam Name</th>
              <th className="p-3 font-medium">Course</th>
              <th className="p-3 font-medium">Type</th>
              <th className="p-3 font-medium">Date</th>
              <th className="p-3 font-medium">Max Marks</th>
              <th className="p-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {exams.length > 0 ? (
              exams.map((exam) => (
                <tr
                  key={exam._id}
                  className="border-b border-gray-700 hover:bg-gray-700 transition cursor-pointer"
                  onClick={() => setSelectedExam(exam)}
                >
                  <td className="p-3">{exam.examName}</td>
                  <td className="p-3">
                    {exam.courseId?.courseCode || "N/A"} - {exam.courseId?.courseName || "N/A"}
                  </td>
                  <td className="p-3">{exam.examType}</td>
                  <td className="p-3">{new Date(exam.examDate).toLocaleDateString()}</td>
                  <td className="p-3">{exam.maxMarks}</td>
                  <td className="p-3">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteExam(exam._id);
                      }}
                      className="text-red-500 hover:text-red-300 transition"
                    >
                      <FaTrash size={18} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="p-8 text-center text-gray-400">
                  No exams found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {selectedExam && (
        <div className="bg-gray-800 rounded-lg overflow-hidden overflow-x-auto">
          <div className="p-4 border-b border-gray-700 flex justify-between items-center">
            <h3 className="text-xl font-bold">
              Marks for {selectedExam.examName} ({selectedExam.courseId?.courseCode})
            </h3>
            <button
              onClick={() => setSelectedExam(null)}
              className="text-gray-400 hover:text-white"
            >
              Close
            </button>
          </div>
          <table className="w-full min-w-[700px]">
            <thead className="bg-gray-700">
              <tr className="text-left">
                <th className="p-3 font-medium">Student ID</th>
                <th className="p-3 font-medium">Name</th>
                <th className="p-3 font-medium">Marks Obtained</th>
                <th className="p-3 font-medium">Max Marks</th>
                <th className="p-3 font-medium">Grade</th>
                <th className="p-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {marks.length > 0 ? (
                marks.map((mark) => (
                  <tr
                    key={mark._id}
                    className="border-b border-gray-700 hover:bg-gray-700 transition"
                  >
                    <td className="p-3 font-mono text-sm text-blue-400">
                      {mark.studentId?.studentId || "N/A"}
                    </td>
                    <td className="p-3">{mark.studentId?.name || "N/A"}</td>
                    <td className="p-3">{mark.marksObtained}</td>
                    <td className="p-3">{mark.maxMarks}</td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-1 rounded text-xs ${
                          mark.grade === "A+" || mark.grade === "A"
                            ? "bg-green-500/20 text-green-300"
                            : mark.grade === "B+" || mark.grade === "B"
                            ? "bg-blue-500/20 text-blue-300"
                            : mark.grade === "C"
                            ? "bg-yellow-500/20 text-yellow-300"
                            : "bg-red-500/20 text-red-300"
                        }`}
                      >
                        {mark.grade}
                      </span>
                    </td>
                    <td className="p-3">
                      <button
                        onClick={() => handleDeleteMarks(mark._id)}
                        className="text-red-500 hover:text-red-300 transition"
                      >
                        <FaTrash size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-gray-400">
                    No marks recorded for this exam
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

export default ExamMarksManagement;

