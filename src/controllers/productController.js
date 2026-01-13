// src/controllers/productController.js (REFACTORED)
// ============================================
import asyncHandler from "express-async-handler";
import Product from "../models/productModel.js";
import Review from "../models/reviewModel.js";
import { cloudinaryService } from "../services/cloudinaryService.js";
import { validateRequiredFields } from "../utils/validators.js";
import { sendSuccess, sendError } from "../utils/responses.js";
import { MESSAGES } from "../constants/messages.js";
import { PAGINATION_DEFAULTS } from "../constants/validationRules.js";

export const getProducts = asyncHandler(async (req, res) => {
  const {
    category,
    search,
    page = PAGINATION_DEFAULTS.PAGE,
    limit = PAGINATION_DEFAULTS.LIMIT,
  } = req.query;

  const query = {};
  if (category) query.category = category;
  if (search) {
    query.$or = [
      { title: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
    ];
  }

  const products = await Product.find(query)
    .populate("category", "name slug")
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .sort({ createdAt: -1 });

  const count = await Product.countDocuments(query);

  sendSuccess(res, 200, "Products retrieved", {
    products,
    totalPages: Math.ceil(count / limit),
    currentPage: Number(page),
    total: count,
  });
});

export const getProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id).populate(
    "category",
    "name slug"
  );

  if (!product) {
    return sendError(res, 404, MESSAGES.PRODUCT.NOT_FOUND);
  }

  const reviews = await Review.find({ product: req.params.id })
    .populate("user", "name")
    .sort({ createdAt: -1 });

  const productWithReviews = product.toObject();
  productWithReviews.reviews = reviews;

  sendSuccess(res, 200, "Product retrieved", { product: productWithReviews });
});

export const getProductsForAdmin = asyncHandler(async (req, res) => {
  const products = await Product.find()
    .populate("category", "name slug")
    .sort({ createdAt: -1 });
  sendSuccess(res, 200, "Admin products retrieved", { products });
});

export const createProduct = asyncHandler(async (req, res) => {
  const { title, description, price, stock, category, brand, images } =
    req.body;

  const product = new Product({
    title: title?.trim() || "Sample product",
    slug: (title || "sample-product").toLowerCase().replace(/\s+/g, "-"),
    description: description?.trim() || "Sample description",
    price: price || 0,
    stock: stock || 0,
    category: category || null,
    brand: brand?.trim() || "",
    images: images || [],
    ratings: 0,
    numReviews: 0,
  });

  const created = await product.save();
  sendSuccess(res, 201, MESSAGES.PRODUCT.CREATED, { product: created });
});

export const updateProduct = asyncHandler(async (req, res) => {
  const {
    title,
    description,
    price,
    stock,
    category,
    brand,
    variants,
    images,
  } = req.body;

  const product = await Product.findById(req.params.id);
  if (!product) {
    return sendError(res, 404, MESSAGES.PRODUCT.NOT_FOUND);
  }

  product.title = title?.trim() ?? product.title;
  product.slug = (title || product.title).toLowerCase().replace(/\s+/g, "-");
  product.description = description?.trim() ?? product.description;
  product.price = price ?? product.price;
  product.stock = stock ?? product.stock;
  product.category = category ?? product.category;
  product.brand = brand?.trim() ?? product.brand;

  if (variants) product.variants = variants;
  if (images) product.images = images;

  const updated = await product.save();
  sendSuccess(res, 200, MESSAGES.PRODUCT.UPDATED, { product: updated });
});

export const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return sendError(res, 404, MESSAGES.PRODUCT.NOT_FOUND);
  }

  // Delete from Cloudinary
  if (product.images?.length) {
    const publicIds = product.images
      .map((img) => img.public_id)
      .filter(Boolean);
    if (publicIds.length > 0) {
      await cloudinaryService.deleteMultipleImages(publicIds);
    }
  }

  // Delete reviews
  await Review.deleteMany({ product: req.params.id });
  await product.deleteOne();

  sendSuccess(res, 200, MESSAGES.PRODUCT.DELETED);
});

export const uploadProductImages = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return sendError(res, 404, MESSAGES.PRODUCT.NOT_FOUND);
  }

  if (!req.files || req.files.length === 0) {
    return sendError(res, 400, MESSAGES.PRODUCT.NO_FILES);
  }

  const uploadedImages = await cloudinaryService.uploadMultipleImages(
    req.files
  );
  product.images.push(...uploadedImages);
  await product.save();

  sendSuccess(res, 200, MESSAGES.PRODUCT.IMAGES_UPLOADED, {
    images: uploadedImages,
  });
});

export const deleteProductImage = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return sendError(res, 404, MESSAGES.PRODUCT.NOT_FOUND);
  }

  const publicId = req.params.publicId;
  await cloudinaryService.deleteImage(publicId);

  product.images = product.images.filter((img) => img.public_id !== publicId);
  await product.save();

  sendSuccess(res, 200, MESSAGES.PRODUCT.IMAGE_DELETED);
});
