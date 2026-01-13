// src/middleware/adminMiddleware.js (REFACTORED)
// ============================================
import { AuthorizationError } from "../utils/errorHandler.js";
import { MESSAGES } from "../constants/messages.js";
import { ROLES } from "../constants/validationRules.js";

export const admin = (req, res, next) => {
  if (req.user && req.user.role === ROLES.ADMIN) {
    next();
  } else {
    throw new AuthorizationError(MESSAGES.COMMON.NOT_AUTHORIZED_ADMIN);
  }
};
