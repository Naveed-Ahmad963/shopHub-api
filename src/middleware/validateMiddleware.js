// src/middleware/validateMiddleware.js (NEW)
// ============================================
import { AppError } from "../utils/errorHandler.js";

export const validateRequestBody = (schema) => (req, res, next) => {
  const { error, value } = schema.validate(req.body, { abortEarly: false });

  if (error) {
    const messages = error.details.map((detail) => detail.message).join(", ");
    throw new AppError(messages, 400);
  }

  req.body = value;
  next();
};
