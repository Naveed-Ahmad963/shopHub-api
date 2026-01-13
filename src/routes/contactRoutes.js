// src/routes/contactRoutes.js (REFACTORED)
// ============================================
import express from "express";
import * as contactController from "../controllers/contactController.js";
import { protect } from "../middleware/authMiddleware.js";
import { admin } from "../middleware/adminMiddleware.js";

const router = express.Router();

router.post("/", contactController.submitContactForm);
router.get("/admin/all", protect, admin, contactController.getAllContacts);
router.get("/:id", protect, admin, contactController.getContact);
router.put("/:id/reply", protect, admin, contactController.replyToContact);
router.delete("/:id", protect, admin, contactController.deleteContact);

export default router;
