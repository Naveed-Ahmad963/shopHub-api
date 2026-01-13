// src/routes/index.js (NEW - Consolidated Routes)
// ============================================
import express from "express";
import authRoutes from "./authRoutes.js";
import cartRoutes from "./cartRoutes.js";
import categoryRoutes from "./categoryRoutes.js";
import contactRoutes from "./contactRoutes.js";
import orderRoutes from "./orderRoutes.js";
import paymentRoutes from "./paymentRoutes.js";
import productRoutes from "./productRoutes.js";
import reviewRoutes from "./reviewRoutes.js";
import userRoutes from "./userRoutes.js";

const router = express.Router();

router.use("/api/auth", authRoutes);
router.use("/api/cart", cartRoutes);
router.use("/api/categories", categoryRoutes);
router.use("/api/contact", contactRoutes);
router.use("/api/orders", orderRoutes);
router.use("/api/payment", paymentRoutes);
router.use("/api/products", productRoutes);
router.use("/api/reviews", reviewRoutes);
router.use("/api/users", userRoutes);

export default router;
