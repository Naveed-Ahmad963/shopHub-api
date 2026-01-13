// src/routes/productRoutes.js (REFACTORED)
// ============================================
import express from "express";
import * as productController from "../controllers/productController.js";
import { protect } from "../middleware/authMiddleware.js";
import { admin } from "../middleware/adminMiddleware.js";
import { uploadMultiple } from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.get("/", productController.getProducts);
router.get("/admin", protect, admin, productController.getProductsForAdmin);
router.get("/:id", productController.getProduct);

router.post("/", protect, admin, productController.createProduct);
router.put("/:id", protect, admin, productController.updateProduct);
router.delete("/:id", protect, admin, productController.deleteProduct);

router.post(
  "/:id/images",
  protect,
  admin,
  uploadMultiple,
  productController.uploadProductImages
);
router.delete(
  "/:id/images/:publicId",
  protect,
  admin,
  productController.deleteProductImage
);

export default router;
