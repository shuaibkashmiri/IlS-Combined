import Employee from "../models/employeeModel.js";
import Attendance from "../models/attendanceModel.js";

export const recordAttendance = async (req, res) => {
  try {
    // Extract fields from the request body
    const { employeeId, name, type, timestamp, method, deviceId } = req.body;

    // Validation check
    if (!employeeId || !name || !type) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Find or create employee
    let employee = await Employee.findOne({ employeeId });
    if (!employee) {
      employee = await Employee.create({
        employeeId,
        name,
      });
    }

    // Create new attendance record
    const newAttendance = new Attendance({
      employee: employee._id, // Link employee by ID
      type, // IN/OUT
      timestamp: timestamp ? new Date(timestamp) : Date.now(), // Default to current time if timestamp is missing
      method: method || "Fingerprint", // Default to "Fingerprint"
      deviceId, // Device ID
    });

    // Save the attendance
    await newAttendance.save();

    res.status(201).json({ message: "Attendance saved", data: newAttendance });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};
