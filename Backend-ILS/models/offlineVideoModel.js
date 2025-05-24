import mongoose from "mongoose";

const offlineVideoSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  videoUrl: { type: String, required: true }, // URL or path to the video file
  course: { type: mongoose.Schema.Types.ObjectId, ref: "OfflineCourse", required: true },
  semester: { type: String }, // Optional: can be semester ID or name
  subject: { type: String }, // Optional: can be subject ID or name
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  uploadedAt: { type: Date, default: Date.now },
}, { timestamps: true });

export default mongoose.model("OfflineVideo", offlineVideoSchema);
