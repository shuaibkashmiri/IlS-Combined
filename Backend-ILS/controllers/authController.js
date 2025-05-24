import User from "../models/userModel.js";
import Course from "../models/courseModel.js";
import Video from "../models/videoModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import passport from "passport";
import crypto from "crypto";
import nodemailer from "nodemailer";
import { uploadToCloudinary } from "../utils/cloudinary.js";
import { teachingApplicationTemplate } from "../utils/emailTemplates.js";

// Email configuration
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

// Add a verification function
const verifyEmailConfig = async () => {
  try {
    await transporter.verify();
    console.log("Email service is ready");
    return true;
  } catch (error) {
    console.error("Email service failed:", error);
    return false;
  }
};

// User Register Handler
export const registerHandler = async (req, res) => {
  try {
    const { fullname, email, password } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      // If user exists but isn't verified and token has expired
      if (
        !existingUser.isVerified &&
        (!existingUser.verificationTokenExpiry ||
          existingUser.verificationTokenExpiry < new Date())
      ) {
        // Generate new verification token
        const verificationToken = crypto.randomBytes(32).toString("hex");
        const verificationTokenExpiry = new Date(
          Date.now() + 24 * 60 * 60 * 1000
        );

        // Update existing user
        existingUser.fullname = fullname;
        existingUser.password = await bcrypt.hash(password, 10);
        existingUser.verificationToken = verificationToken;
        existingUser.verificationTokenExpiry = verificationTokenExpiry;
        await existingUser.save();

        // Send new verification email
        const verificationUrl = `${process.env.FRONTEND_URL}/banglore/verify-email/${verificationToken}`;

        try {
          await transporter.sendMail({
            from: {
              name: "ILS Learning Platform",
              address: process.env.EMAIL_USER,
            },
            to: email,
            subject: "Verify Your Email - ILS Learning Platform",
            html: `
              <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
                <div style="background-color: #00965f; padding: 20px; text-align: center;">
                  <h1 style="color: white; margin: 0;">Welcome to ILS Learning Platform!</h1>
                </div>
                <div style="padding: 20px; background-color: #f9f9f9; border-radius: 5px; margin-top: 20px;">
                  <h2 style="color: #333;">Hello ${fullname},</h2>
                  <p style="color: #666; line-height: 1.6;">Please verify your email address by clicking the button below:</p>
                  <div style="text-align: center; margin: 30px 0;">
                    <a href="${verificationUrl}" 
                       style="background-color: #00965f; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold;">
                      Verify Email
                    </a>
                  </div>
                  <p style="color: #666; font-size: 14px;">This link will expire in 24 hours.</p>
                </div>
              </div>
            `,
          });

          return res.status(200).json({
            message: "Verification email sent! Please check your inbox.",
          });
        } catch (emailError) {
          console.error("Email sending failed:", emailError);
          return res.status(500).json({
            message: "Failed to send verification email. Please try again.",
          });
        }
      } else if (!existingUser.isVerified) {
        // If user exists, isn't verified, but token hasn't expired
        return res.status(400).json({
          message:
            "Account pending verification. Please check your email or wait for the verification link to expire.",
          needsVerification: true,
          email: email,
        });
      } else {
        // If user exists and is verified
        return res.status(400).json({
          message: "This email is already registered. Please login instead.",
          alreadyRegistered: true,
        });
      }
    }

    // If no existing user, proceed with new registration
    const verificationToken = crypto.randomBytes(32).toString("hex");
    const verificationTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000);

    // Hash password
    const hashpass = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = await User.create({
      fullname,
      email,
      password: hashpass,
      verificationToken,
      verificationTokenExpiry,
      isVerified: false,
    });

    // Send verification email
    const verificationUrl = `${process.env.FRONTEND_URL}/banglore/verify-email/${verificationToken}`;

    try {
      await transporter.sendMail({
        from: {
          name: "ILS Learning Platform",
          address: process.env.EMAIL_USER,
        },
        to: email,
        subject: "Verify Your Email - ILS Learning Platform",
        html: `
          <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
            <div style="background-color: #00965f; padding: 20px; text-align: center;">
              <h1 style="color: white; margin: 0;">Welcome to ILS Learning Platform!</h1>
            </div>
            <div style="padding: 20px; background-color: #f9f9f9; border-radius: 5px; margin-top: 20px;">
              <h2 style="color: #333;">Hello ${fullname},</h2>
              <p style="color: #666; line-height: 1.6;">Thank you for registering with ILS Learning Platform. To complete your registration, please verify your email address by clicking the button below:</p>
              <div style="text-align: center; margin: 30px 0;">
                <a href="${verificationUrl}" 
                   style="background-color: #00965f; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold;">
                  Verify Email
                </a>
              </div>
      
              <p style="color: #666; font-size: 14px;">This link will expire in 24 hours.</p>
            </div>
          </div>
        `,
      });

      res.status(201).json({
        message:
          "Registration successful! Please check your email to verify your account.",
      });
    } catch (emailError) {
      // If email fails, delete the created user
      await User.findByIdAndDelete(newUser._id);
      console.error("Email sending failed:", emailError);
      return res.status(500).json({
        message: "Failed to send verification email. Please try again.",
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Email Verification Handler
export const verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;

    const user = await User.findOne({
      verificationToken: token,
      verificationTokenExpiry: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        message:
          "Invalid or expired verification token. Please request a new verification email.",
      });
    }

    // Update user verification status
    user.isVerified = true;
    user.verifo = undefined;
    user.verificationTokenExpiry = undefined;
    await user.save();

    res.status(200).json({
      message: "Email verified successfully! You can now login.",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "An error occurred during verification. Please try again.",
    });
  }
};

// User Login Handler
export const loginHandler = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res.status(400).json({ message: "No User Found" });
    }

    // Check if email is verified
    if (!existingUser.isVerified) {
      return res.status(401).json({
        message: "Please verify your email before logging in",
        needsVerification: true,
      });
    }

    // Compare password
    const comparrPass = await bcrypt.compare(password, existingUser.password);
    if (!comparrPass) {
      return res.status(400).json({ message: "Incorrect Password" });
    }

    // Create JWT token
    const payload = { id: existingUser._id };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    // Set token in the cookie
    return res
      .status(200)
      .cookie("token", token, {
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      })
      .json({
        message: "User Logged In Successfully",
        tempdata: existingUser.enrolledCourses,
        token,
      });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Google Login Handler
export const googleAuth = (req, res, next) => {
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })(req, res, next);
};

export const googleCallback = (req, res, next) => {
  passport.authenticate("google", async (err, user) => {
    try {
      if (err) {
        console.error("Google Auth Error:", err);
        return res.redirect(
          `${process.env.FRONTEND_URL}/banglore?error=auth_failed`
        );
      }

      if (!user) {
        return res.redirect(
          `${process.env.FRONTEND_URL}/banglore?error=no_user`
        );
      }

      // Create JWT token
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "7d",
      });

      // Set cookie
      res.cookie("token", token, {
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      });

      // Return user data along with success parameter and token as query param
      return res.redirect(
        `${process.env.FRONTEND_URL}/banglore/auth/google/callback?success=true&token=${token}`
      );
    } catch (error) {
      console.error("Google Callback Error:", error);
      return res.redirect(
        `${process.env.FRONTEND_URL}/banglore?error=server_error`
      );
    }
  })(req, res, next);
};

// User Detail
export const userDetail = async (req, res) => {
  try {
    const userid = req.user;
    let user = await User.findById(userid)
      .select("-password")
      .populate("enrolledCourses")
      .lean(); // Use lean for plain JS object
    if (!user) {
      return res.status(400).json({ message: "User Not found" });
    }

    // Manually populate instructorProfile.createdCourses
    if (
      user.role === "instructor" &&
      user.instructorProfile &&
      user.instructorProfile.createdCourses &&
      user.instructorProfile.createdCourses.length > 0
    ) {
      const courses = await Course.find({
        _id: { $in: user.instructorProfile.createdCourses },
      }).populate("videos"); // Do NOT use .lean() here
      user.instructorProfile.createdCourses = courses;
    } else if (user.role !== "instructor") {
      delete user.instructorProfile;
    }

    return res.status(200).json({ payload: user });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server Error" });
  }
};

// Edit User
export const editUser = async (req, res) => {
  try {
    const id = req.user;
    const { fullname, email } = req.body;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User Not Found" });
    }

    if (fullname) user.fullname = fullname;
    if (email) user.email = email;

    await user.save();

    res.status(200).json({
      message: "User Updated Successfully",
      user: { id: user._id, fullname: user.fullname, email: user.email },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Change Password
export const changePassword = async (req, res) => {
  try {
    const id = req.user;
    const { oldPassword, newPassword } = req.body;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User Not Found" });
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Old Password is Incorrect" });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.status(200).json({ message: "Password Changed Successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Resend Verification Email
export const resendVerification = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    if (user.isVerified) {
      return res.status(400).json({ message: "Email already verified" });
    }

    // Generate new verification token
    const verificationToken = crypto.randomBytes(32).toString("hex");
    const verificationTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000);

    user.verificationToken = verificationToken;
    user.verificationTokenExpiry = verificationTokenExpiry;
    await user.save();

    // Send new verification email
    const verificationUrl = `${process.env.FRONTEND_URL}/banglore/verify-email/${verificationToken}`;

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Verify Your Email - ILS Learning Platform",
      html: `
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #00965f;">Email Verification</h2>
          <p>Please verify your email by clicking the button below:</p>
          <a href="${verificationUrl}" style="display: inline-block; padding: 10px 20px; margin: 20px 0; background-color: #00965f; color: white; text-decoration: none; border-radius: 5px;">Verify Email</a>
          <p>This link will expire in 24 hours.</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({
      message: "Verification email resent successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Instructor Login
export const instructorLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("Login attempt for:", email);

    // Find instructor
    const instructor = await User.findOne({
      email,
      role: "instructor",
    });

    console.log("Instructor found:", instructor ? "Yes" : "No");
    if (instructor) {
      console.log(
        "Application status:",
        instructor.instructorProfile?.applicationStatus
      );
      console.log("Is approved:", instructor.instructorProfile?.isApproved);
      console.log("Has password:", !!instructor.password);
    }

    if (!instructor) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    // Check if instructor is approved
    if (
      instructor.instructorProfile.isApproved.status !== "approved"
    ) {
      return res.status(403).json({
        message: "Your instructor account is pending approval",
      });
    }

    // Check if password exists
    if (!instructor.password) {
      return res.status(401).json({
        message: "Please complete your registration first",
      });
    }

    // Verify password
    try {
      const isMatch = await bcrypt.compare(password, instructor.password);
      if (!isMatch) {
        return res.status(401).json({
          message: "Invalid email or password",
        });
      }
    } catch (error) {
      console.error("Password comparison error:", error);
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    // Create JWT token
    const token = jwt.sign({ id: instructor._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    // Set cookie
    res.cookie("token", token, {
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    });

    // Return success with instructor data
    res.status(200).json({
      message: "Login successful",
      instructor: {
        id: instructor._id,
        name: instructor.fullname,
        email: instructor.email,
        role: instructor.role,
        instructorProfile: instructor.instructorProfile,
      },
      token,
    });
  } catch (error) {
    console.error("Error in instructorLogin:", error);
    res.status(500).json({ message: error.message });
  }
};

// Teach on ILS - Step 1: Email Verification
export const initiateTeachingApplication = async (req, res) => {
  try {
    const { email } = req.body;

    // Generate OTP (used for both new and existing users)
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes expiry

    // Check if email already exists
    const existingUser = await User.findOne({ email });

    let user;
    if (existingUser) {
      // Check if user is already an instructor
      if (existingUser.role === "instructor") {
        if (existingUser.instructorProfile.applicationStatus === "completed") {
          return res.status(400).json({
            message: "You are already registered as an instructor.",
          });
        }
      } else if (existingUser.role === "student") {
        // Allow students to apply as instructors
        existingUser.role = "instructor";
      }

      // Update existing user
      existingUser.instructorProfile = {
        ...existingUser.instructorProfile,
        applicationStatus: "pending_verification",
        verificationOTP: otp,
        verificationOTPExpiry: otpExpiry,
      };

      user = await existingUser.save();
    } else {
      // Create new user
      user = await User.create({
        email,
        fullname: "Pending Verification", // Temporary name until final step
        role: "instructor",
        instructorProfile: {
          applicationStatus: "pending_verification",
          verificationOTP: otp,
          verificationOTPExpiry: otpExpiry,
        },
      });
    }

    // Send OTP email
    try {
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Verify your email for teaching application",
        html: `
          <h1>Email Verification</h1>
          <p>Your OTP for teaching application is: <strong>${otp}</strong></p>
          <p>This OTP will expire in 10 minutes.</p>
        `,
      });
    } catch (emailError) {
      console.warn("Email sending failed:", emailError.message);
      // Continue anyway in development
      if (process.env.NODE_ENV === "production") {
        throw emailError;
      }
    }

    // In development, include OTP in response
    const response = {
      message: "Verification code sent to your email",
    };

    if (process.env.NODE_ENV !== "production") {
      response.otp = otp; // Include OTP in development only
    }

    res.status(200).json(response);
  } catch (error) {
    console.error("Error in initiateTeachingApplication:", error);
    res.status(500).json({ message: error.message });
  }
};

// Teach on ILS - Step 2: Verify OTP
export const verifyTeachingOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    // Find user by email and OTP
    const user = await User.findOne({
      email,
      "instructorProfile.applicationStatus": "pending_verification",
      "instructorProfile.verificationOTP": otp,
      "instructorProfile.verificationOTPExpiry": { $gt: new Date() },
    });

    if (!user) {
      return res.status(400).json({
        message: "Invalid or expired verification code",
      });
    }

    // Update application status
    user.instructorProfile.applicationStatus = "email_verified";
    user.isVerified = true;
    await user.save();

    res.status(200).json({
      message: "Email verified successfully",
      email: email,
    });
  } catch (error) {
    console.error("Error in verifyTeachingOTP:", error);
    res.status(500).json({ message: error.message });
  }
};

// Teach on ILS - Step 3: Complete Application
export const completeTeachingApplication = async (req, res) => {
  try {
    const { email, name, mobile, expertise, bio, password } = req.body;

    // Find user by email and verified status
    const user = await User.findOne({
      email,
      "instructorProfile.applicationStatus": "email_verified",
    });

    if (!user) {
      return res.status(400).json({
        message: "Please verify your email first",
      });
    }

    let documentsUrl = null;

    // Handle document upload
    if (process.env.NODE_ENV === "production") {
      // In production, require documents
      if (!req.files || req.files.length === 0) {
        return res.status(400).json({
          message: "Please upload required documents",
        });
      }

      try {
        // Upload documents to Cloudinary
        documentsUrl = await uploadToCloudinary(
          req.files[0].path,
          "teacher-documents"
        );
      } catch (uploadError) {
        console.error("Cloudinary upload error:", uploadError);
        return res.status(500).json({
          message: "Document upload failed. Please try again.",
        });
      }
    } else {
      // In development, make documents optional
      if (req.files && req.files.length > 0) {
        try {
          documentsUrl = await uploadToCloudinary(
            req.files[0].path,
            "teacher-documents"
          );
        } catch (uploadError) {
          console.warn(
            "Development: Cloudinary upload skipped:",
            uploadError.message
          );
          documentsUrl = "http://placeholder-url.com/document.pdf";
        }
      } else {
        documentsUrl = "http://placeholder-url.com/document.pdf";
      }
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Update user with complete information
    user.fullname = name; // Using fullname instead of name to match schema
    user.mobile = mobile;
    user.password = hashedPassword;
    user.instructorProfile = {
      ...user.instructorProfile,
      applicationStatus: "completed",
      expertise,
      bio,
      documents: documentsUrl,
      isApproved: {
        status: "pending",
        reason: "",
      },
    };

    await user.save();

    // Send confirmation email
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Thank You for Your Teaching Application - ILS",
      html: teachingApplicationTemplate(name),
    });

    res.status(201).json({
      message: "Application completed successfully",
      data: user,
    });
  } catch (error) {
    console.error("Error in completeTeachingApplication:", error);
    res.status(500).json({ message: error.message });
  }
};
