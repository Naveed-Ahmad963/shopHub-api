// src/constants/validationRules.js
// ============================================
export const VALIDATION_RULES = {
  EMAIL_REGEX: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
  PHONE_REGEX:
    /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/,
  MIN_PASSWORD_LENGTH: 6,
  MIN_MESSAGE_LENGTH: 10,
  OTP_EXPIRY_MINUTES: 10,
  VERIFICATION_TOKEN_EXPIRY_HOURS: 1,
  RESET_TOKEN_EXPIRY_MINUTES: 15,
  MAX_OTP_ATTEMPTS: 5,
  COOKIE_EXPIRES_DAYS: 7,
};

export const PAGINATION_DEFAULTS = {
  PAGE: 1,
  LIMIT: 12,
};

export const STATUSES = {
  ORDER: {
    PENDING: "Pending",
    PROCESSING: "Processing",
    SHIPPED: "Shipped",
    DELIVERED: "Delivered",
    CANCELLED: "Cancelled",
  },
  CONTACT: {
    NEW: "new",
    READ: "read",
    REPLIED: "replied",
  },
  PAYMENT: {
    PENDING: "pending",
    PAID: "Paid",
    FAILED: "Failed",
  },
};

export const ROLES = {
  USER: "user",
  ADMIN: "admin",
};
