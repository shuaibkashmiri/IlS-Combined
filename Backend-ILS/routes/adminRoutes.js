import express from "express";
import {
  approveInstructor,
  rejectInstructor,
  approveCourse,
  rejectCourse,
  approveVideo,
  rejectVideo,
  getAllUsers,
  deleteUser,
  getallCourseforAdmin,
  deleteVideo,
  deleteCourse,
  addOfflineStudent,
  enrollOfflineStudentInCourse,
  updateOfflineStudentStatus
} from "../controllers/adminController.js";
import { isAuthenticated, roleMiddleware } from "../middlewares/auth.js";

const router = express.Router();

router.get("/getall", isAuthenticated, roleMiddleware(["admin","superAdmin"]), getAllUsers);

// Admin adds offline student
router.post(
  "/add-offline-student",
  isAuthenticated,
  roleMiddleware(["admin","superAdmin"]),
  addOfflineStudent
);

// Admin enrolls offline student in a course
router.post(
  "/enroll-offline-student-in-course/:studentId/:courseId",
  isAuthenticated,
  roleMiddleware(["admin","superAdmin"]),
  enrollOfflineStudentInCourse
);

// Admin updates isOflineStudent status
router.patch(
  "/offline-student/:id/status",
  isAuthenticated,
  roleMiddleware(["admin","superAdmin"]),
  updateOfflineStudentStatus
);

router.delete(
  "/deleteuser",
  isAuthenticated,
  roleMiddleware(["admin","superAdmin"]),
  deleteUser
);

router.get(
  "/getallforadmin",
  isAuthenticated,
  roleMiddleware(["admin", "superAdmin"]),
  getallCourseforAdmin
);

// Instructor approval/rejection
router.post(
  "/instructor/approve/:instructorId",
  isAuthenticated,
  roleMiddleware(["admin", "superAdmin"]),
  approveInstructor
);
router.post(
  "/instructor/reject/:instructorId",
  isAuthenticated,
  roleMiddleware(["admin", "superAdmin"]),
  rejectInstructor
);

// Course approval/rejection
router.post(
  "/course/approve/:courseId",
  isAuthenticated,
  roleMiddleware(["admin", "superAdmin"]),
  approveCourse
);
router.post(
  "/course/reject/:courseId",
  isAuthenticated,
  roleMiddleware(["admin", "superAdmin"]),
  rejectCourse
);

// Video approval/rejection
router.post(
  "/video/approve/:videoId",
  isAuthenticated,
  roleMiddleware(["admin", "superAdmin"]),
  approveVideo
);
router.post(
  "/video/reject/:videoId",
  isAuthenticated,
  roleMiddleware(["admin", "superAdmin"]),
  rejectVideo
);
router.delete(
  "/video/delete/:videoId",
  isAuthenticated,
  roleMiddleware(["admin", "superAdmin", "instructor"]),
  deleteVideo
);

// Course deletion
router.delete(
  "/course/delete/:courseId",
  isAuthenticated,
  roleMiddleware(["admin", "superAdmin"]),
  deleteCourse
);

// User deletion
router.delete(
  "/user/delete/:userId",
  isAuthenticated,
  roleMiddleware(["admin", "superAdmin"]),
  deleteUser
);

export default router;
