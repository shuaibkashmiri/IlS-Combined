import mongoose from "mongoose";

const progressTrackerSchema = new mongoose.Schema({
  semester: { type: String }, // Optional: can be semester ID or name
  subject: { type: String }, // Optional: can be subject ID or name
  completedTopics: [{ type: String }], // List of completed topics/lessons
  attendance: { type: Number, default: 0 }, // Attendance percentage or count
  progressPercent: { type: Number, default: 0 }, // Progress percentage for this subject/semester
}, { _id: false });

const offlineStudentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  parentName:{type:String},
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String },
  alternativePhone:{type:String},
  address: { type: String },
  myCourses: {course:{ type: mongoose.Schema.Types.ObjectId, ref: "OfflineCourse", required: true },
  discount:{type:Number},
  regFee:{type:Number},
finalPrice:{type:Number},
paidFee:{type:Number},
installments:{type:Number},
},
academicDetails:{
qualification:{type:String},
institution:{type:String},
year:{type:String},
percentage:{type:Number},
},
profileImage:{type:String},
dob:{type:Date},
gender:{type:String},

  enrollmentDate: { type: Date, default: Date.now },
  progress: [progressTrackerSchema], // Array to track progress per semester/subject
  overallProgress: { type: Number, default: 0 }, // Overall course progress percentage
  status: { type: String, enum: ["active", "completed", "dropped"], default: "active" },
}, { timestamps: true });

export default mongoose.model("OfflineStudent", offlineStudentSchema);