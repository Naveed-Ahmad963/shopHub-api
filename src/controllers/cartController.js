// src/controllers/cartController.js (REFACTORED)
// ============================================
import { validateRequiredFields } from "../utils/validators.js";
import asyncHandler from "express-async-handler";
export const getCart = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id)
    .populate("cart.product", "title price images stock description")
    .select("cart");

  if (!user) {
    return sendError(res, 404, MESSAGES.CART.USER_NOT_FOUND);
  }

  const cartItems = user.cart
    .filter((item) => item.product)
    .map((item) => ({
      _id: item.product._id,
      title: item.product.title,
      price: item.product.price,
      images: item.product.images,
      stock: item.product.stock,
      description: item.product.description,
      quantity: item.quantity,
      variant: item.variant,
    }));

  sendSuccess(res, 200, "Cart retrieved", { cartItems });
});

export const updateCart = asyncHandler(async (req, res) => {
  const { cartItems } = req.body;
  validateRequiredFields({ cartItems }, ["cartItems"]);

  const user = await User.findById(req.user._id);
  if (!user) {
    return sendError(res, 404, MESSAGES.CART.USER_NOT_FOUND);
  }

  user.cart = cartItems.map((item) => ({
    product: item._id,
    quantity: item.quantity,
    variant: item.variant || "",
  }));

  await user.save();

  sendSuccess(res, 200, MESSAGES.CART.UPDATED, { cartItems });
});

export const clearCart = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) {
    return sendError(res, 404, MESSAGES.CART.USER_NOT_FOUND);
  }

  user.cart = [];
  await user.save();

  sendSuccess(res, 200, MESSAGES.CART.CLEARED);
});
