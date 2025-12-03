const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const app = express();

// Middleware
// CORS configuration - allow frontend origin
const corsOptions = {
  origin: process.env.FRONTEND_URL || 'https://student-management-frontend-production-1ddb.up.railway.app',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};
app.use(cors(corsOptions));
app.use(bodyParser.json());

// JWT Secret (in production, use environment variable)
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production";

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/stu3";

mongoose
  .connect(MONGODB_URI)
  .then(() => console.log("DB connected"))
  .catch((err) => console.log("DB Error:", err));

// Admin Schema
const adminSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const Admin = mongoose.model("Admin", adminSchema);

// Teacher Schema
const teacherSchema = new mongoose.Schema({
  teacherId: { type: String, unique: true, sparse: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  department: { type: String, required: true },
  qualification: { type: String },
  experience: { type: Number, default: 0 },
  status: { type: String, enum: ["Active", "Inactive"], default: "Active" },
  createdAt: { type: Date, default: Date.now },
});

// Course Schema
const courseSchema = new mongoose.Schema({
  courseCode: { type: String, required: true, unique: true },
  courseName: { type: String, required: true },
  description: { type: String },
  credits: { type: Number, default: 3 },
  teacherId: { type: mongoose.Schema.Types.ObjectId, ref: "Teacher", required: true },
  class: { type: String, required: true },
  batchYear: { type: String, required: true },
  status: { type: String, enum: ["Active", "Inactive"], default: "Active" },
  createdAt: { type: Date, default: Date.now },
});

// Student Schema
const studentSchema = new mongoose.Schema({
  studentId: { type: String, unique: true, sparse: true },
  name: { type: String, required: true },
  class: { type: String, required: true },
  batchYear: { type: String, required: true },
  gender: { type: String, required: true, enum: ["Male", "Female"] },
  email: { type: String },
  phone: { type: String },
  address: { type: String },
  courses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Course" }],
  status: { type: String, enum: ["Active", "Inactive"], default: "Active" },
  createdAt: { type: Date, default: Date.now },
});

// Attendance Schema
const attendanceSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true },
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
  date: { type: Date, required: true, default: Date.now },
  status: { type: String, enum: ["Present", "Absent", "Late"], required: true },
  remarks: { type: String },
  createdAt: { type: Date, default: Date.now },
});

// Exam Schema
const examSchema = new mongoose.Schema({
  examName: { type: String, required: true },
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
  examDate: { type: Date, required: true },
  maxMarks: { type: Number, required: true, default: 100 },
  examType: { type: String, enum: ["Quiz", "Midterm", "Final", "Assignment"], default: "Quiz" },
  description: { type: String },
  createdAt: { type: Date, default: Date.now },
});

// Marks Schema
const marksSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true },
  examId: { type: mongoose.Schema.Types.ObjectId, ref: "Exam", required: true },
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
  marksObtained: { type: Number, required: true, min: 0 },
  maxMarks: { type: Number, required: true },
  grade: { type: String },
  remarks: { type: String },
  createdAt: { type: Date, default: Date.now },
});

// Generate unique Student ID before saving
studentSchema.pre("save", async function (next) {
  if (!this.studentId && this.isNew) {
    const year = new Date().getFullYear().toString().slice(-2);
    let studentId;
    let isUnique = false;
    let counter = 1;
    
    while (!isUnique) {
      const batchShort = this.batchYear.toString().slice(-2);
      studentId = `STU${year}${batchShort}${String(counter).padStart(4, "0")}`;
      const exists = await Student.findOne({ studentId });
      if (!exists) {
        isUnique = true;
      } else {
        counter++;
      }
    }
    this.studentId = studentId;
  }
  next();
});

const Teacher = mongoose.model("Teacher", teacherSchema);
const Course = mongoose.model("Course", courseSchema);
const Student = mongoose.model("Student", studentSchema);
const Attendance = mongoose.model("Attendance", attendanceSchema);
const Exam = mongoose.model("Exam", examSchema);
const Marks = mongoose.model("Marks", marksSchema);

// Generate unique Teacher ID
teacherSchema.pre("save", async function (next) {
  if (!this.teacherId && this.isNew) {
    let teacherId;
    let isUnique = false;
    let counter = 1;
    while (!isUnique) {
      teacherId = `TCH${String(counter).padStart(4, "0")}`;
      const exists = await Teacher.findOne({ teacherId });
      if (!exists) {
        isUnique = true;
      } else {
        counter++;
      }
    }
    this.teacherId = teacherId;
  }
  next();
});

// JWT Authentication Middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Access token required" });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: "Invalid or expired token" });
    }
    req.user = user;
    next();
  });
};

// ====================
// AUTHENTICATION ROUTES
// ====================

// Register Admin
app.post("/api/auth/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ $or: [{ email }, { username }] });
    if (existingAdmin) {
      return res.status(400).json({ error: "Admin already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create admin
    const admin = new Admin({
      username,
      email,
      password: hashedPassword,
    });

    await admin.save();
    res.status(201).json({ message: "Admin registered successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Login Admin
app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find admin
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, admin.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: admin._id, email: admin.email, username: admin.username },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(200).json({
      token,
      user: {
        id: admin._id,
        username: admin.username,
        email: admin.email,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Verify Token
app.get("/api/auth/verify", authenticateToken, (req, res) => {
  res.status(200).json({ user: req.user });
});

// ====================
// CRUD ROUTES (Protected)
// ====================

// CREATE - Add new student
app.post("/api/student", authenticateToken, async (req, res) => {
  console.log("POST /student - Received:", req.body);
  const { name, class: studentClass, batchYear, gender, email, phone, address } = req.body;
  const newStudent = new Student({ 
    name, 
    class: studentClass, 
    batchYear, 
    gender,
    email,
    phone,
    address
  });
  try {
    const saved = await newStudent.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// READ - Get all students
app.get("/api/students", authenticateToken, async (req, res) => {
  try {
    const students = await Student.find().populate("courses").sort({ createdAt: -1 });
    res.status(200).json(students);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// READ - Get single student by ID
app.get("/api/student/:id", authenticateToken, async (req, res) => {
  try {
    const student = await Student.findById(req.params.id).populate({
      path: "courses",
      populate: { path: "teacherId" }
    });
    if (!student) return res.status(404).json({ error: "Student not found" });
    res.status(200).json(student);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// UPDATE - Edit student
app.put("/api/student/:id", authenticateToken, async (req, res) => {
  try {
    const updated = await Student.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updated) return res.status(404).json({ error: "Student not found" });
    res.status(200).json(updated);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// DELETE - Delete student
app.delete("/api/student/:id", authenticateToken, async (req, res) => {
  try {
    const deleted = await Student.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Student not found" });
    res.status(200).json({ message: "Student deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// BULK DELETE - Delete multiple students
app.post("/api/students/bulk-delete", authenticateToken, async (req, res) => {
  try {
    const { ids } = req.body;
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ error: "Invalid student IDs" });
    }
    const result = await Student.deleteMany({ _id: { $in: ids } });
    res.status(200).json({ message: `${result.deletedCount} students deleted successfully` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ====================
// TEACHER ROUTES
// ====================

// CREATE - Add teacher
app.post("/api/teacher", authenticateToken, async (req, res) => {
  try {
    const teacher = new Teacher(req.body);
    const saved = await teacher.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// READ - Get all teachers
app.get("/api/teachers", authenticateToken, async (req, res) => {
  try {
    const teachers = await Teacher.find().sort({ createdAt: -1 });
    res.status(200).json(teachers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// READ - Get single teacher
app.get("/api/teacher/:id", authenticateToken, async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.params.id);
    if (!teacher) return res.status(404).json({ error: "Teacher not found" });
    res.status(200).json(teacher);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// UPDATE - Edit teacher
app.put("/api/teacher/:id", authenticateToken, async (req, res) => {
  try {
    const updated = await Teacher.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updated) return res.status(404).json({ error: "Teacher not found" });
    res.status(200).json(updated);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// DELETE - Delete teacher
app.delete("/api/teacher/:id", authenticateToken, async (req, res) => {
  try {
    const deleted = await Teacher.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Teacher not found" });
    res.status(200).json({ message: "Teacher deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ====================
// COURSE ROUTES
// ====================

// CREATE - Add course
app.post("/api/course", authenticateToken, async (req, res) => {
  try {
    const course = new Course(req.body);
    const saved = await course.save();
    const populated = await Course.findById(saved._id).populate("teacherId");
    res.status(201).json(populated);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// READ - Get all courses
app.get("/api/courses", authenticateToken, async (req, res) => {
  try {
    const courses = await Course.find().populate("teacherId").sort({ createdAt: -1 });
    res.status(200).json(courses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// READ - Get single course
app.get("/api/course/:id", authenticateToken, async (req, res) => {
  try {
    const course = await Course.findById(req.params.id).populate("teacherId");
    if (!course) return res.status(404).json({ error: "Course not found" });
    res.status(200).json(course);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// UPDATE - Edit course
app.put("/api/course/:id", authenticateToken, async (req, res) => {
  try {
    const updated = await Course.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate("teacherId");
    if (!updated) return res.status(404).json({ error: "Course not found" });
    res.status(200).json(updated);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// DELETE - Delete course
app.delete("/api/course/:id", authenticateToken, async (req, res) => {
  try {
    const deleted = await Course.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Course not found" });
    res.status(200).json({ message: "Course deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ====================
// ATTENDANCE ROUTES
// ====================

// CREATE - Mark attendance
app.post("/api/attendance", authenticateToken, async (req, res) => {
  try {
    const attendance = new Attendance(req.body);
    const saved = await attendance.save();
    const populated = await Attendance.findById(saved._id)
      .populate("studentId")
      .populate("courseId");
    res.status(201).json(populated);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// READ - Get attendance by student and course
app.get("/api/attendance", authenticateToken, async (req, res) => {
  try {
    const { studentId, courseId, date } = req.query;
    let query = {};
    if (studentId) query.studentId = studentId;
    if (courseId) query.courseId = courseId;
    if (date) {
      const startDate = new Date(date);
      startDate.setHours(0, 0, 0, 0);
      const endDate = new Date(date);
      endDate.setHours(23, 59, 59, 999);
      query.date = { $gte: startDate, $lte: endDate };
    }
    const attendance = await Attendance.find(query)
      .populate("studentId")
      .populate("courseId")
      .sort({ date: -1 });
    res.status(200).json(attendance);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// BULK ATTENDANCE - Mark attendance for multiple students
app.post("/api/attendance/bulk", authenticateToken, async (req, res) => {
  try {
    const { courseId, date, attendanceList } = req.body;
    const attendanceRecords = attendanceList.map((item) => ({
      studentId: item.studentId,
      courseId,
      date: new Date(date),
      status: item.status,
      remarks: item.remarks || "",
    }));
    const saved = await Attendance.insertMany(attendanceRecords);
    res.status(201).json({ message: `${saved.length} attendance records created` });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// ====================
// EXAM ROUTES
// ====================

// CREATE - Create exam
app.post("/api/exam", authenticateToken, async (req, res) => {
  try {
    const exam = new Exam(req.body);
    const saved = await exam.save();
    const populated = await Exam.findById(saved._id).populate("courseId");
    res.status(201).json(populated);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// READ - Get all exams
app.get("/api/exams", authenticateToken, async (req, res) => {
  try {
    const { courseId } = req.query;
    let query = {};
    if (courseId) query.courseId = courseId;
    const exams = await Exam.find(query).populate("courseId").sort({ examDate: -1 });
    res.status(200).json(exams);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// READ - Get single exam
app.get("/api/exam/:id", authenticateToken, async (req, res) => {
  try {
    const exam = await Exam.findById(req.params.id).populate("courseId");
    if (!exam) return res.status(404).json({ error: "Exam not found" });
    res.status(200).json(exam);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// UPDATE - Edit exam
app.put("/api/exam/:id", authenticateToken, async (req, res) => {
  try {
    const updated = await Exam.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate("courseId");
    if (!updated) return res.status(404).json({ error: "Exam not found" });
    res.status(200).json(updated);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// DELETE - Delete exam
app.delete("/api/exam/:id", authenticateToken, async (req, res) => {
  try {
    const deleted = await Exam.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Exam not found" });
    res.status(200).json({ message: "Exam deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ====================
// MARKS ROUTES
// ====================

// CREATE - Add marks
app.post("/api/marks", authenticateToken, async (req, res) => {
  try {
    const { marksObtained, maxMarks } = req.body;
    let grade = "F";
    const percentage = (marksObtained / maxMarks) * 100;
    if (percentage >= 90) grade = "A+";
    else if (percentage >= 80) grade = "A";
    else if (percentage >= 70) grade = "B+";
    else if (percentage >= 60) grade = "B";
    else if (percentage >= 50) grade = "C";
    else if (percentage >= 40) grade = "D";
    
    const marks = new Marks({ ...req.body, grade });
    const saved = await marks.save();
    const populated = await Marks.findById(saved._id)
      .populate("studentId")
      .populate("examId")
      .populate("courseId");
    res.status(201).json(populated);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// READ - Get marks
app.get("/api/marks", authenticateToken, async (req, res) => {
  try {
    const { studentId, examId, courseId } = req.query;
    let query = {};
    if (studentId) query.studentId = studentId;
    if (examId) query.examId = examId;
    if (courseId) query.courseId = courseId;
    const marks = await Marks.find(query)
      .populate("studentId")
      .populate("examId")
      .populate("courseId")
      .sort({ createdAt: -1 });
    res.status(200).json(marks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// UPDATE - Edit marks
app.put("/api/marks/:id", authenticateToken, async (req, res) => {
  try {
    const { marksObtained, maxMarks } = req.body;
    let grade = "F";
    if (maxMarks && marksObtained) {
      const percentage = (marksObtained / maxMarks) * 100;
      if (percentage >= 90) grade = "A+";
      else if (percentage >= 80) grade = "A";
      else if (percentage >= 70) grade = "B+";
      else if (percentage >= 60) grade = "B";
      else if (percentage >= 50) grade = "C";
      else if (percentage >= 40) grade = "D";
    }
    const updated = await Marks.findByIdAndUpdate(
      req.params.id,
      { ...req.body, grade },
      { new: true, runValidators: true }
    )
      .populate("studentId")
      .populate("examId")
      .populate("courseId");
    if (!updated) return res.status(404).json({ error: "Marks not found" });
    res.status(200).json(updated);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// DELETE - Delete marks
app.delete("/api/marks/:id", authenticateToken, async (req, res) => {
  try {
    const deleted = await Marks.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Marks not found" });
    res.status(200).json({ message: "Marks deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// BULK MARKS - Add marks for multiple students
app.post("/api/marks/bulk", authenticateToken, async (req, res) => {
  try {
    const { examId, courseId, marksList } = req.body;
    const marksRecords = marksList.map((item) => {
      const percentage = (item.marksObtained / item.maxMarks) * 100;
      let grade = "F";
      if (percentage >= 90) grade = "A+";
      else if (percentage >= 80) grade = "A";
      else if (percentage >= 70) grade = "B+";
      else if (percentage >= 60) grade = "B";
      else if (percentage >= 50) grade = "C";
      else if (percentage >= 40) grade = "D";
      
      return {
        studentId: item.studentId,
        examId,
        courseId,
        marksObtained: item.marksObtained,
        maxMarks: item.maxMarks,
        grade,
        remarks: item.remarks || "",
      };
    });
    const saved = await Marks.insertMany(marksRecords);
    res.status(201).json({ message: `${saved.length} marks records created` });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// UPDATE - Assign courses to student
app.put("/api/student/:id/courses", authenticateToken, async (req, res) => {
  try {
    const { courseIds } = req.body;
    const student = await Student.findByIdAndUpdate(
      req.params.id,
      { courses: courseIds },
      { new: true }
    ).populate("courses");
    if (!student) return res.status(404).json({ error: "Student not found" });
    res.status(200).json(student);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});