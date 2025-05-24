import mongoose from "mongoose";

const offlineDocsSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  docUrl: { type: String, required: true }, // URL or path to the document (PDF, etc.)
  fileType: { type: String, enum: ["pdf", "doc", "ppt", "xls", "other"], default: "pdf" },
  course: { type: mongoose.Schema.Types.ObjectId, ref: "OfflineCourse", required: true },
  semester: { type: String }, // Optional: can be semester ID or name
  subject: { type: String }, // Optional: can be subject ID or name
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  uploadedAt: { type: Date, default: Date.now },
}, { timestamps: true });

export default mongoose.model("OfflineDocs", offlineDocsSchema);
