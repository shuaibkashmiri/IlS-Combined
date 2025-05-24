import express from "express";
import { addOfflineStudent, addCourse, getAllOfflineCourses, offlineStudentLogin, getOfflineStudentDetails, getAllOfflineStudents } from "../controllers/offlineCourseController.js";
import multmid from "../middlewares/multer.js";
import { isAuthenticated, isOfflineStudent, roleMiddleware } from "../middlewares/auth.js";
const router = express.Router();
// add student
router.post("/add-offline-student", addOfflineStudent);


// login student
router.post("/offline-student-login", offlineStudentLogin);

// get student details
router.get("/get-offline-student-details",isOfflineStudent, getOfflineStudentDetails);

// get all students
router.get("/get-all-offline-students",isAuthenticated,roleMiddleware(["admin","superAdmin"]), getAllOfflineStudents);

// Route to add a new offline course
router.post("/add-course",isAuthenticated,roleMiddleware(["admin","superAdmin"]), multmid, addCourse);

router.get("/get-all-offline-courses",isAuthenticated,roleMiddleware(["admin","superAdmin"]), getAllOfflineCourses);

export default router;
  

