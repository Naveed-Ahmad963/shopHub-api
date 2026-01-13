// src/routes/userRoutes.js (NEW)
// ============================================
import express from "express";
import * as userController from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";
import { admin } from "../middleware/adminMiddleware.js";

const router = express.Router();

router.get("/", protect, admin, userController.getUsers);
router.get("/:id", protect, admin, userController.getUserById);
router.post("/", protect, admin, userController.createUser);
router.put("/:id", protect, admin, userController.updateUser);
router.delete("/:id", protect, admin, userController.deleteUser);

export default router;
