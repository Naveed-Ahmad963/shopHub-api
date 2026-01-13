// src/controllers/reviewController.js (REFACTORED)
// ============================================
import asyncHandler from "express-async-handler";
import Review from "../models/reviewModel.js";
import Product from "../models/productModel.js";
import { validateRequiredFields } from "../utils/validators.js";
import { sendSuccess, sendError } from "../utils/responses.js";
import { MESSAGES } from "../constants/messages.js";

export const createReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;
  const { productId } = req.params;

  validateRequiredFields({ rating, productId }, ["rating", "productId"]);

  const product = await Product.findById(productId);
  if (!product) {
    return sendError(res, 404, MESSAGES.PRODUCT.NOT_FOUND);
  }

  const review = await Review.create({
    rating,
    comment: comment?.trim() || "",
    user: req.user._id,
    product: productId,
  });

  // Update product ratings
  const reviews = await Review.find({ product: productId });
  product.numReviews = reviews.length;
  product.ratings =
    reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length;
  await product.save();

  sendSuccess(res, 201, MESSAGES.REVIEW.CREATED, { review });
});

export const getReviewsByProduct = asyncHandler(async (req, res) => {
  const reviews = await Review.find({ product: req.params.productId }).populate(
    "user",
    "name"
  );
  sendSuccess(res, 200, "Reviews retrieved", { reviews });
});

export const deleteReview = asyncHandler(async (req, res) => {
  const review = await Review.findByIdAndDelete(req.params.id);

  if (!review) {
    return sendError(res, 404, MESSAGES.REVIEW.NOT_FOUND);
  }

  // Update product ratings
  const reviews = await Review.find({ product: review.product });
  const product = await Product.findById(review.product);

  if (product && reviews.length > 0) {
    product.numReviews = reviews.length;
    product.ratings =
      reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length;
    await product.save();
  }

  sendSuccess(res, 200, MESSAGES.REVIEW.DELETED);
});
