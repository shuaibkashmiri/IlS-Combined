import cloudinary from "../config/cloudinary.js";
import Course from "../models/courseModel.js";
import Video from "../models/videoModel.js";
import User from "../models/userModel.js";

export const createCourse = async (req, res) => {
  try {
    const { title, price, duration, category, description } = req.body;

    // Log the received data for debugging
    console.log("Received data:", req.body);

    // Check if thumbnail file exists
    if (!req.files || !req.files.thumbnail || !req.files.thumbnail[0]) {
      return res.status(400).json({
        success: false,
        message: "Please upload a thumbnail",
      });
    }

    // Validate required fields
    if (!title || !price || !duration || !category || !description) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const image = req.files.thumbnail[0].path;
    const userId = req.user;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }

    const upload = await cloudinary.uploader.upload(image);
    if (!upload) {
      return res.status(400).json({ message: "Cloudinary Error" });
    }

    const thumbnail = upload.secure_url;
    const course = await Course.create({
      title,
      description,
      thumbnail,
      price,
      duration,
      category,
      instructor_id: userId,
    });

    // Add course ID to instructor's createdCourses array (robust version)
    const user = await User.findById(userId);
    if (
      user &&
      (user.role === "instructor" ||
        user.role === "admin" ||
        user.role === "superAdmin")
    ) {
      user.instructorProfile = user.instructorProfile || {};
      user.instructorProfile.createdCourses =
        user.instructorProfile.createdCourses || [];
      user.instructorProfile.createdCourses.push(course._id);
      await user.save();
    }

    return res.status(201).json({
      success: true,
      message: "Course created successfully",
      course,
    });
  } catch (error) {
    console.error("Create course error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Edit Course Handler
export const editCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { title, price, duration, category, description } = req.body;
    let updatedFields = {};

    if (title) updatedFields.title = title;
    if (price) updatedFields.price = price;
    if (duration) updatedFields.duration = duration;
    if (category) updatedFields.category = category;
    if (description) updatedFields.description = description;

    // If a new thumbnail is uploaded
    if (req.file) {
      const upload = await cloudinary.uploader.upload(req.file.path);
      if (!upload) {
        return res.status(400).json({ message: "Cloudinary Error" });
      }
      updatedFields.thumbnail = upload.secure_url;
    }

    // Set approval status back to pending since course was edited
    updatedFields.isApproved = {
      status: "pending",
      reason: "",
    };

    const course = await Course.findByIdAndUpdate(
      courseId,
      { $set: updatedFields },
      { new: true }
    );

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Course updated successfully and sent for review",
      course,
    });
  } catch (error) {
    console.error("Edit course error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const getSingleCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.cid)
      .populate("instructor_id")
      .populate("videos");
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Course found",
      course,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const getallCourse = async (req, res) => {
  try {
    // Only show approved courses for regular users
    const courses = await Course.find({
      "isApproved.status": "approved",
    }).populate({
      path: "instructor_id",
      select: "-password",
    });

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
