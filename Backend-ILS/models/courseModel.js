import mongoose from "mongoose";
const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    instructor_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    price: {
      type: mongoose.Schema.Types.Decimal128,
      required: true,
    },
    category: {
      type: String,
      trim: true,
    },
    level: {
      type: String,
      enum: ["Beginner", "Intermediate", "Advanced"],
      default: "Beginner",
    },
    duration: {
      type: Number,
      comment: "Duration in hours",
    },
    thumbnail: {
      type: String,
      trim: true,
    },

    isApproved: {
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

    videos: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Video",
      },
    ],
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
    enrolledStudents: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },

  { timestamps: true }
);

const Course = mongoose.model("Course", courseSchema);

export default Course;
