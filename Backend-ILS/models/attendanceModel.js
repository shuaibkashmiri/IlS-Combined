// models/Attendance.js
import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema({
  employee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Employee",
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  type: {
    type: String,
    enum: ["IN", "OUT"],
    required: true,
  },
  method: {
    type: String,
    enum: ["Fingerprint", "Card", "Password"],
    default: "Fingerprint",
  },
  deviceId: {
    type: String,
  },
});

export default mongoose.model("Attendance", attendanceSchema);
