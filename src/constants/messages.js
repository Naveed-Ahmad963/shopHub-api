// src/constants/messages.js
// ============================================
export const MESSAGES = {
  // Auth Messages
  AUTH: {
    EMAIL_REQUIRED: "Email is required",
    INVALID_EMAIL: "Please provide a valid email address",
    USER_EXISTS: "User already exists with this email",
    OTP_SENT: (email) => `OTP sent to ${email}. It will expire in 10 minutes.`,
    EMAIL_VERIFIED: "Email verified successfully",
    EMAIL_NOT_VERIFIED: "Email not verified. Please verify your email first.",
    INVALID_TOKEN: "Invalid verification token",
    TOKEN_EXPIRED:
      "Verification token expired. Please verify your email again.",
    REGISTRATION_SUCCESS: "Registration successful",
    LOGIN_SUCCESS: "Logged in successfully",
    INVALID_CREDENTIALS: "Invalid email or password",
    LOGOUT_SUCCESS: "Logged out successfully",
    PROFILE_RETRIEVED: "Profile retrieved successfully",
    PASSWORD_RESET_SENT: "Reset link sent to your email!",
    PASSWORD_RESET_SUCCESS: "Password reset successful! You can now log in.",
    PASSWORD_CHANGED: "Password changed successfully",
  },

  // Contact Messages
  CONTACT: {
    REQUIRED_FIELDS: "Please provide all required fields",
    MESSAGE_TOO_SHORT: "Message must be at least 10 characters",
    SUBMISSION_SUCCESS:
      "Your message has been sent successfully! We'll get back to you soon.",
    REPLY_REQUIRED: "Reply message is required",
    REPLY_SENT: "Reply sent successfully",
    NOT_FOUND: "Contact not found",
  },

  // Product Messages
  PRODUCT: {
    NOT_FOUND: "Product not found",
    CREATED: "Product created successfully",
    UPDATED: "Product updated successfully",
    DELETED: "Product removed",
    NO_FILES: "No files uploaded",
    IMAGES_UPLOADED: "Images uploaded successfully",
    IMAGE_DELETED: "Image removed successfully",
  },

  // Category Messages
  CATEGORY: {
    EXISTS: "Category exists",
    NOT_FOUND: "Category not found",
    CREATED: "Category created successfully",
    UPDATED: "Category updated successfully",
    DELETED: "Category removed",
  },

  // Order Messages
  ORDER: {
    NO_ITEMS: "No order items",
    CREATED: "Order created successfully",
    NOT_FOUND: "Order not found",
    UPDATED: "Order updated successfully",
    DELETED: "Order deleted successfully",
  },

  // Payment Messages
  PAYMENT: {
    AMOUNT_REQUIRED: "Amount and order ID are required",
    INTENT_ID_REQUIRED: "Payment intent ID and order ID are required",
    SUCCESS: "Payment verified successfully",
    NOT_COMPLETED: "Payment not completed",
    VERIFICATION_FAILED: "Payment verification failed",
    PROCESSING_FAILED: "Payment processing failed",
  },

  // Cart Messages
  CART: {
    UPDATED: "Cart updated successfully",
    CLEARED: "Cart cleared successfully",
    USER_NOT_FOUND: "User not found",
  },

  // User Messages
  USER: {
    NAME_EMAIL_PASSWORD_REQUIRED: "Please provide name, email, and password",
    CREATED: "User created successfully! Email is pre-verified.",
    UPDATED: "User updated successfully",
    DELETED: "User removed successfully",
    NOT_FOUND: "User not found",
  },

  // Review Messages
  REVIEW: {
    CREATED: "Review created successfully",
    NOT_FOUND: "Review not found",
    DELETED: "Review deleted successfully",
  },

  // Common Messages
  COMMON: {
    ERROR: "An error occurred",
    NOT_AUTHORIZED_ADMIN: "Not authorized as admin",
    NOT_AUTHORIZED: "Not authorized",
    UNAUTHORIZED: "Not authorized, no token",
    SERVER_ERROR: "Server error",
    INVALID_REQUEST: "Invalid request",
  },
};
