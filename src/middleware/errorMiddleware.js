// src/middleware/errorMiddleware.js (REFACTORED)
// ============================================
import {
  AppError,
  AuthenticationError,
  AuthorizationError,
} from "../utils/errorHandler.js";
import { MESSAGES } from "../constants/messages.js";
import { logger } from "../utils/logger.js";

export const notFound = (req, res, next) => {
  const error = new AppError(`Not Found - ${req.originalUrl}`, 404);
  next(error);
};

export const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || MESSAGES.COMMON.ERROR;

  logger.error(`${statusCode}: ${message}`);

  const isDevelopment = process.env.NODE_ENV !== "production";

  res.status(statusCode).json({
    success: false,
    message,
    ...(isDevelopment && { stack: err.stack }),
  });
};
