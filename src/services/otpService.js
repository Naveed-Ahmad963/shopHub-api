// src/services/otpService.js (REFACTORED)
// ============================================
import crypto from "crypto";
import { VALIDATION_RULES } from "../constants/validationRules.js";
import { logger } from "../utils/logger.js";

const otpStore = new Map();

export const otpService = {
  generateOtp() {
    return Math.floor(100000 + Math.random() * 900000).toString();
  },

  storeOtp(email, otp) {
    const expiryTime =
      Date.now() + VALIDATION_RULES.OTP_EXPIRY_MINUTES * 60 * 1000;
    otpStore.set(email, { otp, expiryTime, attempts: 0 });
  },

  async verifyOtp(email, enteredOtp) {
    const storedData = otpStore.get(email);

    if (!storedData) {
      throw new Error("OTP not found. Please request a new one.");
    }

    if (Date.now() > storedData.expiryTime) {
      otpStore.delete(email);
      throw new Error("OTP expired. Please request a new one.");
    }

    if (storedData.attempts >= VALIDATION_RULES.MAX_OTP_ATTEMPTS) {
      otpStore.delete(email);
      throw new Error("Too many failed attempts. Please request a new OTP.");
    }

    if (storedData.otp !== enteredOtp) {
      storedData.attempts += 1;
      throw new Error(
        `Invalid OTP. ${
          VALIDATION_RULES.MAX_OTP_ATTEMPTS - storedData.attempts
        } attempts remaining`
      );
    }

    otpStore.delete(email);
    logger.success(`OTP verified for ${email}`);
    return true;
  },

  cleanupExpiredOtps() {
    const now = Date.now();
    for (const [email, data] of otpStore.entries()) {
      if (now > data.expiryTime) {
        otpStore.delete(email);
      }
    }
  },
};

// Cleanup expired OTPs every 5 minutes
setInterval(() => otpService.cleanupExpiredOtps(), 5 * 60 * 1000);
