// src/controllers/paymentController.js (FIXED)
// ============================================
import asyncHandler from "express-async-handler";
import { paymentService } from "../services/paymentService.js";
import { orderService } from "../services/orderService.js";
import Order from "../models/orderModel.js";
import { validateRequiredFields } from "../utils/validators.js";
import { sendSuccess, sendError } from "../utils/responses.js";
import { MESSAGES } from "../constants/messages.js";

export const createPaymentIntent = asyncHandler(async (req, res) => {
  const { amount, orderId, currency = "usd" } = req.body;

  // Debug logging
  console.log("Payment Intent Request Body:", req.body);
  console.log("Received orderId:", orderId);

  // Validate with proper error messages
  if (!amount) {
    return sendError(res, 400, "Amount is required");
  }
  if (!orderId) {
    return sendError(res, 400, "Order ID is required");
  }

  // Verify order exists and belongs to user
  const order = await Order.findById(orderId);
  if (!order) {
    return sendError(res, 404, "Order not found");
  }

  if (order.user.toString() !== req.user._id.toString()) {
    return sendError(res, 403, "Not authorized to pay for this order");
  }

  const paymentIntent = await paymentService.createPaymentIntent(
    amount,
    orderId,
    req.user._id,
    currency
  );

  sendSuccess(res, 200, "Payment intent created", {
    clientSecret: paymentIntent.client_secret,
    paymentIntentId: paymentIntent.id,
  });
});

export const verifyPayment = asyncHandler(async (req, res) => {
  const { paymentIntentId, orderId } = req.body;

  console.log("Verify Payment Request:", req.body);

  if (!paymentIntentId) {
    return sendError(res, 400, "Payment Intent ID is required");
  }
  if (!orderId) {
    return sendError(res, 400, "Order ID is required");
  }

  const paymentIntent = await paymentService.verifyPaymentIntent(
    paymentIntentId
  );

  if (paymentIntent.status !== "succeeded") {
    return sendError(res, 400, MESSAGES.PAYMENT.NOT_COMPLETED);
  }

  const order = await Order.findById(orderId);
  if (!order) {
    return sendError(res, 404, MESSAGES.ORDER.NOT_FOUND);
  }

  if (order.user.toString() !== req.user._id.toString()) {
    return sendError(res, 403, MESSAGES.COMMON.NOT_AUTHORIZED);
  }

  const updated = await orderService.updatePaymentInfo(orderId, {
    id: paymentIntentId,
  });

  sendSuccess(res, 200, MESSAGES.PAYMENT.SUCCESS, { order: updated });
});

export const handleWebhook = asyncHandler(async (req, res) => {
  const sig = req.headers["stripe-signature"];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    const stripe = getStripe();
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  const result = await paymentService.handleWebhookEvent(event);
  res.json({ received: true });
});

const getStripe = () => {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error("STRIPE_SECRET_KEY is not defined");
  }
  return new (require("stripe"))(process.env.STRIPE_SECRET_KEY);
};
