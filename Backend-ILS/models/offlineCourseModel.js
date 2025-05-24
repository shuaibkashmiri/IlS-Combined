import mongoose from "mongoose";

// Exam Schema
const examSchema = new mongoose.Schema({
  name: { type: String, required: true },
  date: { type: Date },
  totalMarks: { type: Number },
  passingMarks: { type: Number },
  description: { type: String },
}, { _id: false });

// Subject Schema
const subjectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  code: { type: String },
  description: { type: String },
  exams: [examSchema],
}, { _id: false });

// Semester Schema
const semesterSchema = new mongoose.Schema({
  name: { type: String, required: true },
  number: { type: Number },
  subjects: [subjectSchema],
}, { _id: false });

// Offline Course Schema
const offlineCourseSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String },
  duration: { type: Number, comment: "Duration in hours" },
  category: { type: String },
  fee: { type: Number },
  instructor_name:{type:String},
  level: { type: String, enum: ["Beginner", "Intermediate", "Advanced"], default: "Beginner" },
  semesters: {
    type: [semesterSchema],
    required: false,
    default: undefined // allows omission
  },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  enrolledStudents: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "OfflineStudent",
    },
  ],
  thumbnail: { type: String, required: true }, 
  // Cloudinary URL for the thumbnail
}, { timestamps: true });

export default mongoose.model("OfflineCourse", offlineCourseSchema);
