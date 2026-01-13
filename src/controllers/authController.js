// src/controllers/authController.js (REFACTORED)
// ============================================
import asyncHandler from "express-async-handler";
// import crypto from "crypto";
import User from "../models/userModel.js";
import generateToken from "../utils/generateToken.js";
import { emailService } from "../services/emailService.js";
import { otpService } from "../services/otpService.js";
import {
  validateEmail,
  validatePassword,
  validateRequiredFields,
} from "../utils/validators.js";
import { sendSuccess, sendError } from "../utils/responses.js";
import { setAuthCookie, getCookieConfig } from "../utils/cookieConfig.js";
import { MESSAGES } from "../constants/messages.js";
import { VALIDATION_RULES } from "../constants/validationRules.js";
import crypto from "crypto";

const verifiedEmails = new Map();

export const sendOTP = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const validatedEmail = validateEmail(email);

  const userExists = await User.findOne({ email: validatedEmail });
  if (userExists) {
    return sendError(res, 400, MESSAGES.AUTH.USER_EXISTS);
  }

  const otp = otpService.generateOtp();
  otpService.storeOtp(validatedEmail, otp);

  await emailService.sendOtpEmail(validatedEmail, otp);

  sendSuccess(res, 200, MESSAGES.AUTH.OTP_SENT(validatedEmail), {
    email: validatedEmail,
  });
});

export const verifyOTP = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;
  validateRequiredFields({ email, otp }, ["email", "otp"]);

  const validatedEmail = validateEmail(email);
  await otpService.verifyOtp(validatedEmail, otp);

  const verificationToken = crypto.randomBytes(16).toString("hex");
  verifiedEmails.set(validatedEmail, {
    token: verificationToken,
    expiryTime:
      Date.now() +
      VALIDATION_RULES.VERIFICATION_TOKEN_EXPIRY_HOURS * 60 * 60 * 1000,
  });

  sendSuccess(res, 200, MESSAGES.AUTH.EMAIL_VERIFIED, {
    email: validatedEmail,
    verificationToken,
  });
});

export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, verificationToken } = req.body;
  validateRequiredFields({ name, email, password, verificationToken }, [
    "name",
    "email",
    "password",
    "verificationToken",
  ]);

  const validatedEmail = validateEmail(email);
  validatePassword(password);

  const verifiedData = verifiedEmails.get(validatedEmail);
  if (!verifiedData) {
    return sendError(res, 400, MESSAGES.AUTH.EMAIL_NOT_VERIFIED);
  }

  if (verifiedData.token !== verificationToken) {
    return sendError(res, 400, MESSAGES.AUTH.INVALID_TOKEN);
  }

  if (Date.now() > verifiedData.expiryTime) {
    verifiedEmails.delete(validatedEmail);
    return sendError(res, 400, MESSAGES.AUTH.TOKEN_EXPIRED);
  }

  const exists = await User.findOne({ email: validatedEmail });
  if (exists) {
    return sendError(res, 400, MESSAGES.AUTH.USER_EXISTS);
  }

  const user = await User.create({
    name: name.trim(),
    email: validatedEmail,
    password,
    role: "user",
  });

  verifiedEmails.delete(validatedEmail);
  const token = generateToken(user._id, user.role);
  setAuthCookie(res, token);

  sendSuccess(res, 201, MESSAGES.AUTH.REGISTRATION_SUCCESS, {
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
    token,
  });
});

export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  validateRequiredFields({ email, password }, ["email", "password"]);

  const validatedEmail = validateEmail(email);
  const user = await User.findOne({ email: validatedEmail });

  if (user && (await user.matchPassword(password))) {
    const token = generateToken(user._id, user.role);
    setAuthCookie(res, token);

    return sendSuccess(res, 200, MESSAGES.AUTH.LOGIN_SUCCESS, {
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    });
  }

  sendError(res, 401, MESSAGES.AUTH.INVALID_CREDENTIALS);
});

export const logoutUser = asyncHandler(async (req, res) => {
  res.clearCookie("token");
  sendSuccess(res, 200, MESSAGES.AUTH.LOGOUT_SUCCESS);
});

export const getProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");
  sendSuccess(res, 200, MESSAGES.AUTH.PROFILE_RETRIEVED, { user });
});

export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const validatedEmail = validateEmail(email);

  const user = await User.findOne({ email: validatedEmail });
  if (!user) {
    // Security: Don't reveal if email exists
    return sendSuccess(res, 200, MESSAGES.AUTH.PASSWORD_RESET_SENT);
  }

  const resetToken = user.getResetPasswordToken();
  await user.save({ validateBeforeSave: false });

  try {
    await emailService.sendPasswordResetEmail(user, resetToken);
    sendSuccess(res, 200, MESSAGES.AUTH.PASSWORD_RESET_SENT);
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });
    throw error;
  }
});

export const resetPassword = asyncHandler(async (req, res) => {
  const { password } = req.body;
  validatePassword(password);

  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.resetToken)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    return sendError(res, 400, "Invalid or expired reset token");
  }

  user.password = password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

  // Send confirmation email (don't throw error if it fails)
  emailService.sendPasswordChangeConfirmation(user);

  sendSuccess(res, 200, MESSAGES.AUTH.PASSWORD_RESET_SUCCESS);
});
