// src/routes/paymentRoutes.js (REFACTORED)
// ============================================
import express from "express";
import * as paymentController from "../controllers/paymentController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Webhook must be before express.json()
router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  paymentController.handleWebhook
);

router.post(
  "/create-payment-intent",
  protect,
  paymentController.createPaymentIntent
);
router.post("/verify-payment", protect, paymentController.verifyPayment);

export default router;
