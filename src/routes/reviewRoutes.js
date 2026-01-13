// src/routes/reviewRoutes.js (NEW)
// ============================================
import express from "express";
import * as reviewController from "../controllers/reviewController.js";
import { protect } from "../middleware/authMiddleware.js";
import { admin } from "../middleware/adminMiddleware.js";

const router = express.Router();

router.post("/:productId", protect, reviewController.createReview);
router.get("/:productId", reviewController.getReviewsByProduct);
router.delete("/:id", protect, admin, reviewController.deleteReview);

export default router;
