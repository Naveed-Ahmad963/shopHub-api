// src/utils/validators.js
// ============================================
import { MESSAGES } from "../constants/messages.js";
import { VALIDATION_RULES } from "../constants/validationRules.js";

export const validateEmail = (email) => {
  if (!email) throw new Error(MESSAGES.AUTH.EMAIL_REQUIRED);
  if (!VALIDATION_RULES.EMAIL_REGEX.test(email)) {
    throw new Error(MESSAGES.AUTH.INVALID_EMAIL);
  }
  return email.toLowerCase();
};

export const validatePhone = (phone) => {
  if (!phone) return null;
  if (!VALIDATION_RULES.PHONE_REGEX.test(phone)) {
    throw new Error("Please provide a valid phone number");
  }
  return phone;
};

export const validatePassword = (
  password,
  minLength = VALIDATION_RULES.MIN_PASSWORD_LENGTH
) => {
  if (!password) throw new Error("Password is required");
  if (password.length < minLength) {
    throw new Error(`Password must be at least ${minLength} characters`);
  }
  return password;
};

export const validateMessage = (
  message,
  minLength = VALIDATION_RULES.MIN_MESSAGE_LENGTH
) => {
  if (!message) throw new Error("Message is required");
  if (message.length < minLength) {
    throw new Error(MESSAGES.CONTACT.MESSAGE_TOO_SHORT);
  }
  return message;
};

export const validateRequiredFields = (fields, fieldNames) => {
  const missing = fieldNames.filter((name) => !fields[name]);
  if (missing.length > 0) {
    throw new Error(`${missing.join(", ")} are required`);
  }
};
