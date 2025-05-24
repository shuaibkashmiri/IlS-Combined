import mongoose from "mongoose";
import User from "../models/userModel.js";
import Course from "../models/courseModel.js";
import Video from "../models/videoModel.js";
import {
  sendInstructorApprovalEmail,
  sendInstructorRejectionEmail,
} from "../utils/instructorStatusEmails.js";
import {
  sendCourseStatusEmail,
  sendVideoStatusEmail,
} from "../utils/courseVideoStatusEmails.js";
import { sendStudentCredentials } from "../utils/studentCredentialsEmail.js";
import bcrypt from "bcrypt";

// Add Offline Student (Admin Only)
export const addOfflineStudent = async (req, res) => {
  try {
    const { fullname, email, password } = req.body;
    if (!fullname || !email || !password) {
      return res.status(400).json({ message: "Full name, email, and password are required." });
    }
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "User with this email already exists." });
    }
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    // Create offline student user
    const newUser = await User.create({
      fullname,
      email,
      password: hashedPassword,
      role: "student",
      isVerified: true,
      isOflineStudent: true
    });
    // Send credentials email
    const emailSent = await sendStudentCredentials(email, password, fullname);
    if (!emailSent) {
      return res.status(201).json({
        message: "Offline student created, but email could not be sent. Please verify email configuration.",
        user: { id: newUser._id, fullname, email },
        emailSent: false
      });
    }
    return res.status(201).json({ message: "Offline student created and credentials sent via email.", user: { id: newUser._id, fullname, email }, emailSent: true });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Approve instructor controller
export const approveInstructor = async (req, res) => {
  try {
    const { instructorId } = req.params;
    if (!instructorId) {
      return res.status(400).json({ message: "Instructor ID is required" });
    }
    const user = await User.findById(instructorId);
    if (!user || user.role !== "instructor") {
      return res.status(404).json({ message: "Instructor not found" });
    }
    if (
      typeof user.instructorProfile.isApproved !== "object" ||
      user.instructorProfile.isApproved === null ||
      Array.isArray(user.instructorProfile.isApproved)
    ) {
      user.instructorProfile.isApproved = { status: "pending", reason: "" };
    }
    user.instructorProfile.isApproved.status = "approved";
    user.instructorProfile.isApproved.reason = "";
    await user.save();
    await sendInstructorApprovalEmail(user.email, user.fullname);
    return res
      .status(200)
      .json({ message: "Instructor approved and email sent" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Approve course controller
export const approveCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    if (!courseId) {
      return res.status(400).json({ message: "Course ID is required" });
    }
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }
    course.isApproved.status = "approved";
    course.isApproved.reason = "";
    await course.save();
    // Notify instructor
    if (course.instructor_id) {
      const instructor = await User.findById(course.instructor_id);
      if (instructor) {
        await sendCourseStatusEmail(
          instructor.email,
          instructor.fullname,
          course.title,
          "approved"
        );
      }
    }
    return res
      .status(200)
      .json({ message: "Course approved and instructor notified" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Reject course controller
export const rejectCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { reason } = req.body;
    if (!courseId) {
      return res.status(400).json({ message: "Course ID is required" });
    }
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }
    course.isApproved.status = "rejected";
    course.isApproved.reason = reason || "";
    await course.save();
    // Notify instructor
    if (course.instructor_id) {
      const instructor = await User.findById(course.instructor_id);
      if (instructor) {
        await sendCourseStatusEmail(
          instructor.email,
          instructor.fullname,
          course.title,
          "rejected",
          reason
        );
      }
    }
    return res
      .status(200)
      .json({ message: "Course rejected and instructor notified" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Approve video controller
export const approveVideo = async (req, res) => {
  try {
    const { videoId } = req.params;
    if (!videoId) {
      return res.status(400).json({ message: "Video ID is required" });
    }
    const video = await Video.findById(videoId);
    if (!video) {
      return res.status(404).json({ message: "Video not found" });
    }
    video.isApproved.status = "approved";
    video.isApproved.reason = "";
    await video.save();
    // Notify instructor
    if (video.user) {
      const instructor = await User.findById(video.user);
      if (instructor) {
        await sendVideoStatusEmail(
          instructor.email,
          instructor.fullname,
          video.title,
          "approved"
        );
      }
    }
    return res
      .status(200)
      .json({ message: "Video approved and instructor notified" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Reject video controller
export const rejectVideo = async (req, res) => {
  try {
    const { videoId } = req.params;
    const { reason } = req.body;
    if (!videoId) {
      return res.status(400).json({ message: "Video ID is required" });
    }
    const video = await Video.findById(videoId);
    if (!video) {
      return res.status(404).json({ message: "Video not found" });
    }
    video.isApproved.status = "rejected";
    video.isApproved.reason = reason || "";
    await video.save();
    // Notify instructor
    if (video.user) {
      const instructor = await User.findById(video.user);
      if (instructor) {
        await sendVideoStatusEmail(
          instructor.email,
          instructor.fullname,
          video.title,
          "rejected",
          reason
        );
      }
    }
    return res
      .status(200)
      .json({ message: "Video rejected and instructor notified" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Reject instructor controller
export const rejectInstructor = async (req, res) => {
  try {
    const { instructorId } = req.params;
    const { reason } = req.body;
    if (!instructorId) {
      return res.status(400).json({ message: "Instructor ID is required" });
    }
    const user = await User.findById(instructorId);
    if (!user || user.role !== "instructor") {
      return res.status(404).json({ message: "Instructor not found" });
    }
    if (
      typeof user.instructorProfile.isApproved !== "object" ||
      user.instructorProfile.isApproved === null ||
      Array.isArray(user.instructorProfile.isApproved)
    ) {
      user.instructorProfile.isApproved = { status: "pending", reason: "" };
    }
    user.instructorProfile.isApproved.status = "rejected";
    user.instructorProfile.isApproved.reason = reason || "";
    await user.save();
    await sendInstructorRejectionEmail(user.email, user.fullname, reason);
    return res
      .status(200)
      .json({ message: "Instructor rejected and email sent" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Get All Users
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select("-password")
      .populate("enrolledCourses");
    if (users) {
      return res
        .status(200)
        .json({ message: "User Fetched Sucessfully", payload: users });
    } else {
      return res.status(404).json({ message: "No Users" });
    }
  } catch (error) {
    console.log(error);
  }
};

// Delete User
export const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const user = await User.findByIdAndDelete(userId);
    if (!user) {
      return res.status(404).json({ message: "User Not Found" });
    }

    res.status(200).json({
      message: "User Deleted Successfully",
      user: { id: user._id, fullname: user.fullname, email: user.email },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getallCourseforAdmin = async (req, res) => {
  try {
    // Show all courses (approved and pending) to admin/instructor
    const courses = await Course.find()
      .populate("videos")
      .populate("enrolledStudents")
      .populate("instructor_id");

    if (!courses || courses.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No courses available",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Courses fetched Successfully",
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

export const getAllVideos = async (req, res) => {
  try {
    const videos = await Video.find();
    if (!videos) {
      return res.status(404).json({
        success: false,
        message: "No videos available",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Videos fetched successfully",
      videos,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Delete Video
export const deleteVideo = async (req, res) => {
  try {
    const { videoId } = req.params;
    const userId = req.user; // Get the authenticated user's ID

    if (!videoId) {
      return res.status(400).json({ message: "Video ID is required" });
    }

    const video = await Video.findById(videoId);
    if (!video) {
      return res.status(404).json({ message: "Video not found" });
    }

    // Get the user making the request
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if user is admin/superAdmin or the instructor who created the video
    const isAdmin = user.role === "admin" || user.role === "superAdmin";
    const isInstructor =
      user.role === "instructor" && video.user.toString() === userId;

    if (!isAdmin && !isInstructor) {
      return res.status(403).json({
        message:
          "Unauthorized: Only admins or the video creator can delete this video",
      });
    }

    // Delete the video
    await Video.findByIdAndDelete(videoId);

    // Remove video reference from course if it exists
    if (video.course) {
      await Course.findByIdAndUpdate(video.course, {
        $pull: { videos: videoId },
      });
    }

    return res.status(200).json({
      success: true,
      message: "Video deleted successfully",
      video: { id: video._id, title: video.title },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Delete Course
export const deleteCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    if (!courseId) {
      return res.status(400).json({ message: "Course ID is required" });
    }

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // Delete all videos associated with the course
    await Video.deleteMany({ course: courseId });

    // Remove course from enrolled students
    const courseObjectId = new mongoose.Types.ObjectId(courseId);
    await User.updateMany(
      { enrolledCourses: courseObjectId },
      { $pull: { enrolledCourses: courseObjectId } }
    );

    // Delete the course
    await Course.findByIdAndDelete(courseId);

    return res.status(200).json({
      success: true,
      message: "Course and associated videos deleted successfully",
      course: { id: course._id, title: course.title },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Admin: Enroll offline student in a course
export const enrollOfflineStudentInCourse = async (req, res) => {
 try {
    const { studentId, courseId } = req.params;
    if (!studentId || !courseId) {
      return res.status(400).json({ message: "studentId and courseId are required." });
    }
    // Find student
    const student = await User.findOne({ _id: studentId, isOflineStudent: true, role: "student" });
    if (!student) {
      return res.status(404).json({ message: "Offline student not found." });
    }
    // Find course
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found." });
    }
    // Check if already enrolled
    const alreadyEnrolled = student.enrolledCourses.some(
      (c) => c.courseId.toString() === courseId
    );
    if (alreadyEnrolled) {
      return res.status(409).json({ message: "Student already enrolled in this course." });
    }
    // Push course (no payment/orderId for offline)
    student.enrolledCourses.push({
      courseId: course._id,
      enrolledAt: new Date(),
      paymentId: "offline",
      orderId: "offline",
      completedLessons: [],
      progress: 0
    });
    // Defensive fix for invalid instructorProfile.isApproved.status
    if (student.role === "student" && student.instructorProfile) {
      delete student.instructorProfile;
    }
    await student.save();
    // Add student to course's enrolledStudents if not already present
    if (!course.enrolledStudents) course.enrolledStudents = [];
    if (!course.enrolledStudents.some(id => id.toString() === student._id.toString())) {
      course.enrolledStudents.push(student._id);
      await course.save();
    }
    return res.status(200).json({ 
      message: "Course added to offline student's enrolledCourses.", 
      student: { id: student._id, fullname: student.fullname, courses: student.enrolledCourses },
      course: { id: course._id, title: course.title, enrolledStudents: course.enrolledStudents }
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const updateOfflineStudentStatus=async(req,res)=>{
    try {
        const {studentId}=req.params;
        const {status}=req.body;
        if(!studentId||!status){
            return res.status(400).json({ message: "Student ID and status are required." });
        }
        const student=await User.findById(studentId);
        if(!student){
            return res.status(404).json({ message: "Student not found." });
        }
        student.isOflineStudent=status;
        await student.save();
        return res.status(200).json({ message: "Student status updated successfully.", student: { id: student._id, fullname: student.fullname, status: student.isOflineStudent } });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};    