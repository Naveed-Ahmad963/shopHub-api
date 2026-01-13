// src/controllers/userController.js (REFACTORED)
// ============================================
import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";
import {
  validateEmail,
  validatePassword,
  validateRequiredFields,
} from "../utils/validators.js";
import { sendSuccess, sendError } from "../utils/responses.js";
import { MESSAGES } from "../constants/messages.js";

export const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select("-password");
  sendSuccess(res, 200, "Users retrieved", { users });
});

export const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select("-password");

  if (!user) {
    return sendError(res, 404, MESSAGES.USER.NOT_FOUND);
  }

  sendSuccess(res, 200, "User retrieved", { user });
});

export const createUser = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;

  validateRequiredFields({ name, email, password }, [
    "name",
    "email",
    "password",
  ]);
  const validatedEmail = validateEmail(email);
  validatePassword(password);

  const userExists = await User.findOne({ email: validatedEmail });
  if (userExists) {
    return sendError(res, 400, MESSAGES.AUTH.USER_EXISTS);
  }

  const user = await User.create({
    name: name.trim(),
    email: validatedEmail,
    password,
    role: role || "user",
    emailVerified: true,
  });

  sendSuccess(res, 201, MESSAGES.USER.CREATED, {
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      emailVerified: user.emailVerified,
    },
  });
});

export const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return sendError(res, 404, MESSAGES.USER.NOT_FOUND);
  }

  user.name = req.body.name?.trim() ?? user.name;
  user.email = req.body.email ? validateEmail(req.body.email) : user.email;
  user.role = req.body.role ?? user.role;

  const updated = await user.save();

  sendSuccess(res, 200, MESSAGES.USER.UPDATED, {
    user: {
      _id: updated._id,
      name: updated.name,
      email: updated.email,
      role: updated.role,
    },
  });
});

export const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findByIdAndDelete(req.params.id);

  if (!user) {
    return sendError(res, 404, MESSAGES.USER.NOT_FOUND);
  }

  sendSuccess(res, 200, MESSAGES.USER.DELETED);
});
