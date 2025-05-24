import Course from "../models/courseModel.js";
import Video from "../models/videoModel.js";
import cloudinary from "../config/cloudinary.js";
import fs from "fs";
import { mkdir } from "fs/promises";

// Ensure uploads directory exists
try {
  await mkdir("uploads", { recursive: true });
} catch (err) {
  if (err.code !== "EEXIST") {
    console.error("Error creating uploads directory:", err);
  }
}

export const createVideo = async (req, res) => {
  try {
    const { title, description, videoUrl, course } = req.body;
    const { Id } = req.user;

    // Check if either videoUrl is provided or video file is uploaded
    if (!videoUrl && !req.files?.video) {
      return res.status(400).json({
        success: false,
        message: "Please provide either a video URL or upload a video file",
      });
    }

    // Check if thumbnail is provided
    if (!req.files?.thumbnail) {
      return res.status(400).json({
        success: false,
        message: "Please upload a thumbnail",
      });
    }

    const foundCourse = await Course.findOne({ title: course });
    if (!foundCourse) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    // Upload thumbnail to Cloudinary
    const thumbnailResult = await cloudinary.uploader.upload(
      req.files.thumbnail[0].path
    );
    fs.unlinkSync(req.files.thumbnail[0].path);

    if (!thumbnailResult) {
      return res.status(400).json({
        success: false,
        message: "Error uploading thumbnail to Cloudinary",
      });
    }

    let finalVideoUrl = videoUrl;

    // If video file is uploaded, upload it to Cloudinary
    if (req.files?.video) {
      const videoResult = await cloudinary.uploader.upload(
        req.files.video[0].path,
        {
          resource_type: "video",
          folder: "course_videos",
          chunk_size: 6000000, // 6MB chunks for better upload
          eager: [
            { streaming_profile: "full_hd", format: "m3u8" }, // HLS streaming
          ],
          eager_async: true,
          eager_notification_url: process.env.CLOUDINARY_NOTIFICATION_URL, // Optional: for status updates
        }
      );
      fs.unlinkSync(req.files.video[0].path);

      if (!videoResult) {
        return res.status(400).json({
          success: false,
          message: "Error uploading video to Cloudinary",
        });
      }

      finalVideoUrl = videoResult.secure_url;
    }

    const video = await Video.create({
      title,
      description,
      videoUrl: finalVideoUrl,
      thumbnail: thumbnailResult.secure_url,
      course: foundCourse._id,
      user: Id,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    const updatedCourse = await Course.findByIdAndUpdate(
      foundCourse._id,
      { $push: { videos: video._id } },
      { new: true }
    ).populate("videos");

    res.status(200).json({
      success: true,
      message: "Video created and course updated successfully",
      data: updatedCourse,
    });
  } catch (error) {
    // Clean up uploaded files in case of error
    if (req.files?.thumbnail) {
      fs.unlinkSync(req.files.thumbnail[0].path);
    }
    if (req.files?.video) {
      fs.unlinkSync(req.files.video[0].path);
    }

    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Edit Video Handler
export const editVideo = async (req, res) => {
  try {
    const { videoId } = req.params;
    const { title, description, videoUrl, course } = req.body;
    const { Id } = req.user;

    const video = await Video.findById(videoId);
    if (!video) {
      return res
        .status(404)
        .json({ success: false, message: "Video not found" });
    }

    // If a new thumbnail is provided, upload and replace
    if (req.files?.thumbnail) {
      const thumbnailResult = await cloudinary.uploader.upload(
        req.files.thumbnail[0].path
      );
      fs.unlinkSync(req.files.thumbnail[0].path);
      if (!thumbnailResult) {
        return res.status(400).json({
          success: false,
          message: "Error uploading thumbnail to Cloudinary",
        });
      }
      video.thumbnail = thumbnailResult.secure_url;
    }

    // If a new video file is provided, upload and replace
    if (req.files?.video) {
      const videoResult = await cloudinary.uploader.upload(
        req.files.video[0].path,
        {
          resource_type: "video",
          folder: "course_videos",
          chunk_size: 6000000,
          eager: [{ streaming_profile: "full_hd", format: "m3u8" }],
          eager_async: true,
          eager_notification_url: process.env.CLOUDINARY_NOTIFICATION_URL,
        }
      );
      fs.unlinkSync(req.files.video[0].path);
      if (!videoResult) {
        return res.status(400).json({
          success: false,
          message: "Error uploading video to Cloudinary",
        });
      }
      video.videoUrl = videoResult.secure_url;
    } else if (videoUrl) {
      video.videoUrl = videoUrl;
    }

    if (title) video.title = title;
    if (description) video.description = description;
    if (course) {
      const foundCourse = await Course.findOne({ title: course });
      if (!foundCourse) {
        return res
          .status(404)
          .json({ success: false, message: "Course not found" });
      }
      // Remove from old course
      if (video.course.toString() !== foundCourse._id.toString()) {
        await Course.findByIdAndUpdate(video.course, {
          $pull: { videos: video._id },
        });
        await Course.findByIdAndUpdate(foundCourse._id, {
          $push: { videos: video._id },
        });
        video.course = foundCourse._id;
      }
    }

    // Set approval status back to pending since video was edited
    video.isApproved.status = "pending";
    video.isApproved.reason = "";
    video.updatedAt = Date.now();
    await video.save();

    res.status(200).json({
      success: true,
      message: "Video updated successfully and sent for review",
      data: video,
    });
  } catch (error) {
    // Clean up uploaded files in case of error
    if (req.files?.thumbnail) {
      fs.unlinkSync(req.files.thumbnail[0].path);
    }
    if (req.files?.video) {
      fs.unlinkSync(req.files.video[0].path);
    }
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Delete Video Handler
export const deleteVideo = async (req, res) => {
  try {
    const { videoId } = req.params;
    const video = await Video.findById(videoId);
    if (!video) {
      return res
        .status(404)
        .json({ success: false, message: "Video not found" });
    }
    // Remove video from course's videos array
    await Course.findByIdAndUpdate(video.course, {
      $pull: { videos: video._id },
    });
    // Optionally: Remove from Cloudinary if you store public_id
    // await cloudinary.uploader.destroy(video.cloudinaryPublicId, { resource_type: "video" });
    await Video.findByIdAndDelete(videoId);
    res.status(200).json({
      success: true,
      message: "Video deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};
