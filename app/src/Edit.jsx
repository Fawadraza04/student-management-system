import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaBook } from "react-icons/fa";

const Edit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ 
    name: "", 
    class: "", 
    batchYear: "", 
    gender: "",
    email: "",
    phone: "",
    address: "",
    status: "Active",
    courses: []
  });
  const [availableCourses, setAvailableCourses] = useState([]);

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/student/${id}`)
      .then((res) => {
        const student = res.data;
        setFormData({
          ...student,
          courses: student.courses ? student.courses.map(c => c._id || c) : []
        });
      })
      .catch((error) => {
        console.error("Error fetching student:", error);
        if (error.response?.status === 401) {
          navigate("/login");
        }
      });
    
    axios
      .get("http://localhost:5000/api/courses")
      .then((res) => {
        setAvailableCourses(res.data || []);
      })
      .catch((error) => {
        console.error("Error fetching courses:", error);
      });
  }, [id, navigate]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const { courses, ...studentData } = formData;
      await axios.put(`http://localhost:5000/api/student/${id}`, studentData);
      
      // Update courses separately
      if (courses) {
        await axios.put(`http://localhost:5000/api/student/${id}/courses`, {
          courseIds: courses
        });
      }
      
      alert("Student updated!");
      navigate("/manage");
    } catch (error) {
      alert("Error updating student: " + (error.response?.data?.error || error.message));
    }
  };

  const handleCourseToggle = (courseId) => {
    setFormData(prev => {
      const currentCourses = prev.courses || [];
      if (currentCourses.includes(courseId)) {
        return { ...prev, courses: currentCourses.filter(id => id !== courseId) };
      } else {
        return { ...prev, courses: [...currentCourses, courseId] };
      }
    });
  };

  const filteredCourses = availableCourses.filter(
    course => course.class === formData.class && course.batchYear === formData.batchYear
  );

  return (
      <div className="flex-1 p-4 lg:p-6 mt-16 lg:mt-0 lg:ml-64 bg-gray-900 text-white min-h-screen">
        <h2 className="text-2xl font-bold mb-6">Edit Student</h2>
        <form onSubmit={handleUpdate} className="space-y-4 max-w-2xl">
          <input
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Name"
            className="w-full p-3 rounded bg-gray-700 text-white"
            required
          />
          <input
            value={formData.class}
            onChange={(e) => setFormData({ ...formData, class: e.target.value })}
            placeholder="Class"
            className="w-full p-3 rounded bg-gray-700 text-white"
            required
          />
          <input
            value={formData.batchYear}
            onChange={(e) => setFormData({ ...formData, batchYear: e.target.value })}
            placeholder="Batch Year"
            className="w-full p-3 rounded bg-gray-700 text-white"
            required
          />
          <select
            value={formData.gender}
            onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
            className="w-full p-3 rounded bg-gray-700 text-white"
            required
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
          <input
            type="email"
            value={formData.email || ""}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="Email"
            className="w-full p-3 rounded bg-gray-700 text-white"
          />
          <input
            type="tel"
            value={formData.phone || ""}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            placeholder="Phone"
            className="w-full p-3 rounded bg-gray-700 text-white"
          />
          <textarea
            value={formData.address || ""}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            placeholder="Address"
            className="w-full p-3 rounded bg-gray-700 text-white"
            rows="3"
          />
          <select
            value={formData.status || "Active"}
            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            className="w-full p-3 rounded bg-gray-700 text-white"
          >
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>

          {/* Course Assignment */}
          {formData.class && formData.batchYear && (
            <div className="mt-6 p-4 bg-gray-800 rounded-lg">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <FaBook /> Assign Courses
              </h3>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {filteredCourses.length > 0 ? (
                  filteredCourses.map((course) => (
                    <label
                      key={course._id}
                      className="flex items-center gap-3 p-3 bg-gray-700 rounded hover:bg-gray-600 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={(formData.courses || []).includes(course._id)}
                        onChange={() => handleCourseToggle(course._id)}
                        className="w-5 h-5 cursor-pointer"
                      />
                      <div className="flex-1">
                        <p className="font-medium">{course.courseCode} - {course.courseName}</p>
                        <p className="text-sm text-gray-400">
                          Teacher: {course.teacherId?.name || "N/A"}
                        </p>
                      </div>
                    </label>
                  ))
                ) : (
                  <p className="text-gray-400 text-center py-4">
                    No courses available for {formData.class} - Batch {formData.batchYear}
                  </p>
                )}
              </div>
            </div>
          )}

          <button type="submit" className="bg-green-600 p-3 rounded w-full text-white font-bold hover:bg-green-700 transition mt-4">
            Update Student
          </button>
        </form>
      </div>
  );
};

export default Edit;