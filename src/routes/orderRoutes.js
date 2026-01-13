// src/routes/orderRoutes.js (REFACTORED)
// ============================================
import express from "express";
import * as orderController from "../controllers/orderController.js";
import { protect } from "../middleware/authMiddleware.js";
import { admin } from "../middleware/adminMiddleware.js";

const router = express.Router();

router.post("/", protect, orderController.createOrder);
router.get("/my", protect, orderController.getMyOrders);
router.get("/admin/all", protect, admin, orderController.getAllOrders);
router.get("/:id", protect, orderController.getOrderById);
router.put("/:id/status", protect, admin, orderController.updateOrderStatus);
router.delete("/:id", protect, admin, orderController.deleteOrder);

export default router;
