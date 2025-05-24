import express from "express";
import { recordAttendance } from "../controllers/attendanceController.js";

const router = express.Router();
// record attendance
router.post("/device-data", recordAttendance);

export default router;
