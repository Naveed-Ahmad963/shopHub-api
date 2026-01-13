// src/controllers/orderController.js (REFACTORED)
// ============================================
import asyncHandler from "express-async-handler";
import Order from "../models/orderModel.js";
import { orderService } from "../services/orderService.js";
import { validateRequiredFields } from "../utils/validators.js";
import { sendSuccess, sendError } from "../utils/responses.js";
import { MESSAGES } from "../constants/messages.js";

export const createOrder = asyncHandler(async (req, res) => {
  const {
    orderItems,
    shippingAddress,
    paymentInfo,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  } = req.body;

  validateRequiredFields({ orderItems }, ["orderItems"]);

  if (!orderItems.length) {
    return sendError(res, 400, MESSAGES.ORDER.NO_ITEMS);
  }

  const order = await orderService.createOrder({
    user: req.user._id,
    orderItems,
    shippingAddress,
    paymentInfo,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  });

  sendSuccess(res, 201, MESSAGES.ORDER.CREATED, { order });
});

export const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id })
    .populate("orderItems.product", "title images price")
    .sort({ createdAt: -1 });

  sendSuccess(res, 200, "Orders retrieved", { orders });
});

export const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id)
    .populate("user", "name email")
    .populate("orderItems.product", "title images price");

  if (!order) {
    return sendError(res, 404, MESSAGES.ORDER.NOT_FOUND);
  }

  sendSuccess(res, 200, "Order retrieved", { order });
});

export const getAllOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find()
    .populate("user", "name email")
    .populate("orderItems.product", "title images price")
    .sort({ createdAt: -1 });

  sendSuccess(res, 200, "All orders retrieved", { orders });
});

export const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  validateRequiredFields({ status }, ["status"]);

  const order = await orderService.updateOrderStatus(req.params.id, status);
  sendSuccess(res, 200, MESSAGES.ORDER.UPDATED, { order });
});

export const deleteOrder = asyncHandler(async (req, res) => {
  const order = await Order.findByIdAndDelete(req.params.id);

  if (!order) {
    return sendError(res, 404, MESSAGES.ORDER.NOT_FOUND);
  }

  sendSuccess(res, 200, MESSAGES.ORDER.DELETED);
});
