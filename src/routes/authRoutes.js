// src/routes/authRoutes.js (REFACTORED)
// ============================================
import express from "express";
import * as authController from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/send-otp", authController.sendOTP);
router.post("/verify-otp", authController.verifyOTP);
router.post("/register", authController.registerUser);
router.post("/login", authController.loginUser);
router.post("/logout", authController.logoutUser);
router.get("/profile", protect, authController.getProfile);
router.post("/forgot-password", authController.forgotPassword);
router.put("/reset-password/:resetToken", authController.resetPassword);

export default router;
