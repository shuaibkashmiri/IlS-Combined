import express from "express";
import { isAuthenticated, roleMiddleware } from "../middlewares/auth.js";
import {
  createCourse,
  getallCourse,
  getSingleCourse,
  editCourse
} from "../controllers/courseController.js";
import multmid from "../middlewares/multer.js";

const router = express.Router();

router.post("/create", isAuthenticated, roleMiddleware(["instructor","admin","superAdmin"]),multmid, createCourse);
router.get("/get/:cid", getSingleCourse);
router.get("/getall", getallCourse);

// Edit course route
router.patch(
  "/edit/:courseId",
  isAuthenticated,
  roleMiddleware(["instructor","admin","superAdmin"]),
  multmid,
  editCourse
);

export default router;
