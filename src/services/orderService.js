// src/services/orderService.js (NEW)
// ============================================
import Order from "../models/orderModel.js";
import Product from "../models/productModel.js";
import { STATUSES } from "../constants/validationRules.js";
import { logger } from "../utils/logger.js";

export const orderService = {
  async createOrder(orderData) {
    const order = new Order(orderData);
    const created = await order.save();

    // Update product stocks
    for (const item of orderData.orderItems) {
      const product = await Product.findById(item.product);
      if (product) {
        product.stock = Math.max(0, product.stock - item.qty);
        product.sold = (product.sold || 0) + item.qty;
        await product.save();
      }
    }

    logger.success(`Order created: ${created._id}`);
    return created;
  },

  async updateOrderStatus(orderId, newStatus) {
    const order = await Order.findById(orderId);
    if (!order) throw new Error("Order not found");

    order.orderStatus = newStatus;

    if (newStatus === STATUSES.ORDER.PROCESSING) {
      order.paidAt = Date.now();
    }
    if (newStatus === STATUSES.ORDER.DELIVERED) {
      order.deliveredAt = Date.now();
    }

    const updated = await order.save();
    logger.success(`Order ${orderId} status updated to ${newStatus}`);
    return updated;
  },

  async updatePaymentInfo(orderId, paymentData) {
    const order = await Order.findById(orderId);
    if (!order) throw new Error("Order not found");

    order.paymentInfo = {
      id: paymentData.id,
      status: STATUSES.PAYMENT.PAID,
      method: "Credit Card",
    };
    order.orderStatus = STATUSES.ORDER.PROCESSING;
    order.paidAt = Date.now();

    return await order.save();
  },
};
