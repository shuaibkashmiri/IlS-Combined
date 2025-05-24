import express from "express";
import {
  loginHandler,
  registerHandler,
  googleAuth,
  googleCallback,
  editUser,
  changePassword,
  userDetail,
  verifyEmail,
  resendVerification,
  initiateTeachingApplication,
  verifyTeachingOTP,
  completeTeachingApplication,
  instructorLogin
} from "../controllers/authController.js";
import { isAuthenticated, roleMiddleware } from "../middlewares/auth.js";
import { upload } from '../utils/multer.js';
const router = express.Router();
// user Routes
router.post("/register", registerHandler);
router.post("/login", loginHandler);
router.post("/instructor/login", instructorLogin);
router.get("/google", googleAuth);
router.get("/google/callback", googleCallback);
router.put("/edit", isAuthenticated, editUser);
router.put("/changepass", isAuthenticated, changePassword);
router.get("/userdetails", isAuthenticated, userDetail);



// Teaching application routes
router.post(
  "/teach/initiate",
  initiateTeachingApplication
);

router.post(
  "/teach/verify-otp",
  verifyTeachingOTP
);

router.post(
  "/teach/complete",
  upload.any(),
  completeTeachingApplication
);

//protected User route auth for clientSide
router.get("/user-auth", isAuthenticated, (req, res) => {
  res.status(200).json({ success: true });
});
//protected Admin route auth for admin
router.get(
  "/admin-auth",
  isAuthenticated,
  roleMiddleware(["admin"]),
  (req, res) => {
    res.status(200).json({ success: true });
  }
);
//protected Admin route auth for instructor
router.get(
  "/instructor-auth",
  isAuthenticated,
  roleMiddleware(["instructor"]),
  (req, res) => {
    res.status(200).json({ success: true });
  }
);
//protected Admin route auth for superAdmin
router.get(
  "/superadmin-auth",
  isAuthenticated,
  roleMiddleware(["superAdmin"]),
  (req, res) => {
    res.status(200).json({ success: true });
  }
);

// Add new routes
router.get("/verify-email/:token", verifyEmail);
router.post("/resend-verification", resendVerification);

export default router;
