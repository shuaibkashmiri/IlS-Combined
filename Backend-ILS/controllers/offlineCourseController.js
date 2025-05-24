import OfflineStudent from "../models/offlineStudentModel.js";
import { sendStudentCredentials } from "../utils/studentCredentialsEmail.js";
import bcrypt from "bcrypt";
import OfflineCourse from "../models/offlineCourseModel.js";
// Handler to add a new offline course
import { uploadToCloudinary } from "../utils/cloudinary.js";
import fs from "fs";
import jwt from "jsonwebtoken";

// add student
export const addOfflineStudent = async (req, res) => {
    try {
        const {
            name,
            parentName,
            email,
            password,
            phone,
            alternativePhone,
            address,
            myCourses, // expects { course, regFee, finalPrice, paidFee, installments }
            academicDetails, // expects { qualification, institution, year, percentage }
            dob,
            gender
        } = req.body;

        // Handle profile image upload if file is present
        let profileImageUrl = undefined;
        if (req.file && req.file.path) {
            try {
                profileImageUrl = await uploadToCloudinary(req.file.path, "offline-students/profile-images");
            } catch (err) {
                return res.status(500).json({ error: "Profile image upload failed.", details: err.message });
            } finally {
                // Remove local file after upload
                const fs = await import('fs');
                fs.unlinkSync(req.file.path);
            }
        }

        // Hash the password before saving
        const hashedPassword = await bcrypt.hash(password, 10);

        // Prepare student data (omit discount)
        const studentData = {
            name,
            parentName,
            email,
            password: hashedPassword,
            phone,
            alternativePhone,
            address,
            myCourses: {
                course: myCourses?.course,
                regFee: myCourses?.regFee,
                finalPrice: myCourses?.finalPrice,
                paidFee: myCourses?.paidFee,
                installments: myCourses?.installments
            },
            academicDetails,
            profileImage: profileImageUrl,
            dob,
            gender
        };

        const student = await OfflineStudent.create(studentData);

        // Push student ID to the course's enrolledStudents array
        if (myCourses && myCourses.course) {
            const updatedCourse = await OfflineCourse.findByIdAndUpdate(
                myCourses.course,
                { $push: { enrolledStudents: student._id } },
                { new: true }
            );
            if (!updatedCourse) {
                return res.status(404).json({ error: "Course not found. Student created but not enrolled in course." });
            }
        }

        // Send credentials email with original password
        const emailSent = await sendStudentCredentials(email, password, name);

        if (!emailSent) {
            return res.status(201).json({ student, warning: "Student created and enrolled, but email sending failed." });
        }
        res.status(201).json(student);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
// add course
export const addCourse = async (req, res) => {
    try {
        let { title, description, duration, category, level, semesters, instructor_name, fee } = req.body;
        const createdBy = req.user;
        // Parse semesters if it's a string (from form-data)
        if (typeof semesters === "string") {
            try {
                semesters = JSON.parse(semesters);
            } catch (err) {
                semesters = [];
            }
        }

        // Sanitize semesters: Remove empty or incomplete objects
        if (Array.isArray(semesters)) {
            semesters = semesters.filter(sem => sem && typeof sem === 'object' && sem.name && sem.name.trim() !== '');
            if (semesters.length === 0) {
                semesters = undefined; // or [] if you want the field present but empty
            }
        } else {
            semesters = undefined;
        }

        // Trim level value to remove any leading/trailing spaces
        if (typeof level === "string") {
            level = level.trim();
        }

        // Check if thumbnail file exists
        if (!req.files || !req.files.thumbnail || !req.files.thumbnail[0]) {
            return res.status(400).json({
                success: false,
                message: "Please upload a thumbnail image for the course."
            });
        }

        // Upload thumbnail to Cloudinary
        const thumbnailPath = req.files.thumbnail[0].path;
        let thumbnailUrl;
        try {
            thumbnailUrl = await uploadToCloudinary(thumbnailPath, "offline-courses/thumbnails");
        } catch (err) {
            return res.status(500).json({ success: false, message: "Thumbnail upload failed.", error: err.message });
        } finally {
            // Remove local file after upload
            fs.unlinkSync(thumbnailPath);
        }

        const course = await OfflineCourse.create({
            title,
            description,
            duration,
            category,
            level,
            semesters,
            createdBy: req.user,
            thumbnail: thumbnailUrl,
            fee,
            instructor_name
        });

        res.status(201).json({ success: true, course });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// get all courses
export const getAllOfflineCourses = async (req, res) => {
    try {
        const courses = await OfflineCourse.find().populate("enrolledStudents");
        if (!courses || courses.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No courses available",
            });
        }
        return res.status(200).json({
            success: true,
            message: "Courses fetched successfully",
            courses,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }
};

// Handler for offline student login
export const offlineStudentLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ success: false, message: "Email and password are required." });
        }
        const student = await OfflineStudent.findOne({ email });
        if (!student) {
            return res.status(401).json({ success: false, message: "Invalid email or password." });
        }
        const isMatch = await bcrypt.compare(password, student.password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: "Invalid email or password." });
        }
        const token = jwt.sign(
            { id: student._id, email: student.email, type: "offline-student" },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );
        // Send token in HTTP-only cookie and in JSON
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });
        res.status(200).json({ success: true, token, student: {
            _id: student._id,
            name: student.name,
            email: student.email,
            phone: student.phone,
            address: student.address,
            course: student.course
        }});
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Handler to get offline student details (requires authentication middleware)
export const getOfflineStudentDetails = async (req, res) => {
    try {
        // req.user should be set by authentication middleware after verifying JWT
        const studentId = req.user && req.user.id;
        if (!studentId) {
            return res.status(401).json({ success: false, message: "Unauthorized: No student ID found." });
        }
        const student = await OfflineStudent.findById(studentId).select("-password").populate("myCourses.course");
        if (!student) {
            return res.status(404).json({ success: false, message: "Student not found." });
        }
        res.status(200).json({ success: true, student });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Handler to get all offline students (excluding passwords)
export const getAllOfflineStudents = async (req, res) => {
    try {
        const students = await OfflineStudent.find().select("-password").populate("myCourse.course");
        if (!students || students.length === 0) {
            return res.status(404).json({ success: false, message: "No offline students found." });
        }
        res.status(200).json({ success: true, students });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

