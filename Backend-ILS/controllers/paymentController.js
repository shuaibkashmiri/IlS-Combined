import Razorpay from "razorpay";
import crypto from "crypto";
import axios from "axios";
import User from "../models/userModel.js";
import Course from "../models/courseModel.js";

export const instance = new Razorpay({
  key_id: "rzp_test_WoG9mH6d3QrW0B",
  key_secret: "RUosMzj4EpX7oyV0qGGMEOWF",
});

export const createOrder = async (req, res) => {
  try {
    console.log("Creating order with amount:", req.body.amount);

    if (!req.body.amount) {
      return res.status(400).json({
        success: false,
        message: "Amount is required",
      });
    }

    const options = {
      amount: Number(req.body.amount), // amount should already be in paise from frontend
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };

    console.log("Creating order with options:", options);

    const order = await instance.orders.create(options);
    console.log("Order created:", order);

    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({
      success: false,
      message: "Error creating order",
      error: error.message,
    });
  }
};

export const verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      courseId,
    } = req.body;

    if (
      !razorpay_order_id ||
      !razorpay_payment_id ||
      !razorpay_signature ||
      !courseId
    ) {
      return res.status(400).json({
        success: false,
        message: "Missing required payment verification parameters",
      });
    }

    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    const isAuthentic = expectedSignature === razorpay_signature;

    if (isAuthentic) {
      try {
        // Get user ID from authenticated request
        const userId = req.user;
        console.log("User ID:", userId);

        // First check if user is already enrolled
        const user = await User.findById(userId);
        if (!user) {
          throw new Error("User not found");
        }

        const isAlreadyEnrolled = user.enrolledCourses?.some(
          (course) => course.courseId.toString() === courseId
        );

        if (isAlreadyEnrolled) {
          return res.status(400).json({
            success: false,
            message: "You are already enrolled in this course",
          });
        }

        // Initialize enrolledCourses array if it doesn't exist
        if (!user.enrolledCourses) {
          await User.findByIdAndUpdate(userId, { enrolledCourses: [] });
        }

        // Update user's enrolledCourses
        const updatedUser = await User.findByIdAndUpdate(
          userId,
          {
            $push: {
              enrolledCourses: {
                courseId: courseId,
                paymentId: razorpay_payment_id,
                orderId: razorpay_order_id,
                enrolledAt: new Date(),
              },
            },
          },
          { new: true }
        );

        // Update course's enrolledStudents
        const updatedCourse = await Course.findByIdAndUpdate(
          courseId,
          {
            $addToSet: { enrolledStudents: userId },
          },
          { new: true }
        );

        if (!updatedUser || !updatedCourse) {
          throw new Error("Failed to update enrollment status");
        }

        res.status(200).json({
          success: true,
          message: "Payment verified and course enrollment successful",
          enrollmentDetails: {
            courseId: courseId,
            enrolledAt: new Date(),
            paymentId: razorpay_payment_id,
            orderId: razorpay_order_id,
            userId: userId,
          },
        });
      } catch (enrollError) {
        console.error("Error enrolling in course:", enrollError);
        res.status(500).json({
          success: false,
          message: "Payment verified but course enrollment failed",
          error: enrollError.message,
        });
      }
    } else {
      res.status(400).json({
        success: false,
        message: "Payment verification failed",
      });
    }
  } catch (error) {
    console.error("Error verifying payment:", error);
    res.status(500).json({
      success: false,
      message: "Error verifying payment",
      error: error.message,
    });
  }
};

export const handleWebhook = async (req, res) => {
  try {
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
    const signature = req.headers["x-razorpay-signature"];

    if (!webhookSecret || !signature) {
      return res.status(400).json({
        success: false,
        message: "Missing webhook secret or signature",
      });
    }

    const shasum = crypto.createHmac("sha256", webhookSecret);
    shasum.update(JSON.stringify(req.body));
    const digest = shasum.digest("hex");

    if (digest === signature) {
      const event = req.body;
      console.log("Webhook event received:", event);

      switch (event.event) {
        case "payment.captured":
          // Handle successful payment
          console.log("Payment captured:", event);
          break;
        case "payment.failed":
          // Handle failed payment
          console.log("Payment failed:", event);
          break;
        default:
          // Handle other events
          console.log("Other payment event:", event);
          break;
      }

      res.status(200).json({ received: true });
    } else {
      res.status(400).json({ message: "Invalid webhook signature" });
    }
  } catch (error) {
    console.error("Error processing webhook:", error);
    res.status(500).json({
      success: false,
      message: "Error processing webhook",
      error: error.message,
    });
  }
};
