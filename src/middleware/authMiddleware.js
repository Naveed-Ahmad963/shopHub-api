// src/middleware/authMiddleware.js (REFACTORED)
// ============================================
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import asyncHandler from "express-async-handler";
import { AuthenticationError } from "../utils/errorHandler.js";
import { MESSAGES } from "../constants/messages.js";

export const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (req.cookies?.token) {
    token = req.cookies.token;
  } else if (req.headers.authorization?.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    throw new AuthenticationError(MESSAGES.COMMON.UNAUTHORIZED);
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  req.user = await User.findById(decoded.id).select("-password");

  if (!req.user) {
    throw new AuthenticationError(MESSAGES.USER.NOT_FOUND);
  }

  next();
});
