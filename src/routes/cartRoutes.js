// src/routes/cartRoutes.js (REFACTORED)
// ============================================
import express from "express";
import * as cartController from "../controllers/cartController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, cartController.getCart);
router.put("/", protect, cartController.updateCart);
router.delete("/", protect, cartController.clearCart);

export default router;
