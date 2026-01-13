// src/controllers/categoryController.js (REFACTORED)
// ============================================
import asyncHandler from "express-async-handler";
import Category from "../models/categoryModel.js";
import { validateRequiredFields } from "../utils/validators.js";
import { sendSuccess, sendError } from "../utils/responses.js";
import { MESSAGES } from "../constants/messages.js";

export const getCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find();
  sendSuccess(res, 200, "Categories retrieved", { categories });
});

export const getCategoryById = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);

  if (!category) {
    return sendError(res, 404, MESSAGES.CATEGORY.NOT_FOUND);
  }

  sendSuccess(res, 200, "Category retrieved", { category });
});

export const createCategory = asyncHandler(async (req, res) => {
  const { name, slug, description } = req.body;
  validateRequiredFields({ name, slug }, ["name", "slug"]);

  const exists = await Category.findOne({ name });
  if (exists) {
    return sendError(res, 400, MESSAGES.CATEGORY.EXISTS);
  }

  const category = await Category.create({
    name: name.trim(),
    slug: slug.toLowerCase().trim(),
    description: description?.trim() || "",
  });

  sendSuccess(res, 201, MESSAGES.CATEGORY.CREATED, { category });
});

export const updateCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);

  if (!category) {
    return sendError(res, 404, MESSAGES.CATEGORY.NOT_FOUND);
  }

  category.name = req.body.name?.trim() ?? category.name;
  category.slug = req.body.slug?.toLowerCase().trim() ?? category.slug;
  category.description = req.body.description?.trim() ?? category.description;

  const updated = await category.save();
  sendSuccess(res, 200, MESSAGES.CATEGORY.UPDATED, { category: updated });
});

export const deleteCategory = asyncHandler(async (req, res) => {
  const category = await Category.findByIdAndDelete(req.params.id);

  if (!category) {
    return sendError(res, 404, MESSAGES.CATEGORY.NOT_FOUND);
  }

  sendSuccess(res, 200, MESSAGES.CATEGORY.DELETED);
});
