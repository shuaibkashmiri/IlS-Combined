import express from "express";
import { isAuthenticated, roleMiddleware } from "../middlewares/auth.js";
import { createVideo, editVideo, deleteVideo } from "../controllers/videoController.js";
import multmid from "../middlewares/multer.js";

const router = express.Router();

router.post("/add", isAuthenticated, roleMiddleware(["instructor","admin","superAdmin"]), multmid, createVideo);

// Edit video route
router.patch(
  "/edit/:videoId",
  isAuthenticated,
  roleMiddleware(["instructor","admin","superAdmin"]),
  multmid,
  editVideo
);

// Delete video route
router.delete(
  "/delete/:videoId",
  isAuthenticated,
  roleMiddleware(["instructor","admin","superAdmin"]),
  deleteVideo
);

export default router;
