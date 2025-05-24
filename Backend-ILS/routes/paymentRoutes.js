import express from "express";
import { isAuthenticated } from "../middlewares/auth.js";
import { instance } from "../controllers/paymentController.js";
import {
  createOrder,
  verifyPayment,
  handleWebhook,
} from "../controllers/paymentController.js";

const router = express.Router();

// Create order for payment
router.post("/create-order", isAuthenticated, createOrder);

// Verify payment after success
router.post("/verify", isAuthenticated, verifyPayment);

// Webhook for payment events
router.post("/webhook", handleWebhook);

export default router;
