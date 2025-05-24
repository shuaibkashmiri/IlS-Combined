import { Schema, model } from "mongoose";
import mongoose from "mongoose";
const userSchema = new Schema(
  {
    fullname: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, minlength: 8 },
    googleId: { type: String },
    picture: { type: String },
    enrolledCourses: [
      {
        courseId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Course",
          required: true,
        },
        enrolledAt: {
          type: Date,
          default: Date.now,
        },
        paymentId: {
          type: String,
          required: true,
        },
        orderId: {
          type: String,
          required: true,
        },
        completedLessons: [
          {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Video",
          },
        ],
        progress: {
          type: Number,
          default: 0,
        },
      },
    ],
    role: {
      type: String,
      enum: ["student", "instructor", "admin","superAdmin"],
      default: "student",
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    isOflineStudent: {
      type: Boolean,
      default: false,
    },
    verificationToken: {
      type: String,
    },
    verificationTokenExpiry: {
      type: Date,
    },
    instructorProfile: {
      createdCourses: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Course",
        },
      ],
      isApproved: {
        type: {
          status: {
            type: String,
            enum: ["pending", "approved", "rejected"],
            default: "pending"
          },
          reason: {
            type: String,
            default: ""
          }
        },
        default: { status: "pending", reason: "" }
      },
      applicationStatus: {
        type: String,
        enum: ['pending_verification', 'email_verified', 'completed'],
        default: 'pending_verification'
      },
      verificationOTP: String,
      verificationOTPExpiry: Date,
      expertise: String,
      bio: String,
      documents: String,
    },
  },
  { timestamps: true }
);

const User = model("User", userSchema);
export default User;
