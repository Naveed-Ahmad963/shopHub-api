// src/models/productModel.js
import mongoose from "mongoose";

const variantSchema = new mongoose.Schema({
  name: String, // e.g., "Red / M"
  price: Number,
  stock: { type: Number, default: 0 },
  sku: String,
});

const imageSchema = new mongoose.Schema({
  url: String,
  public_id: String,
});

const productSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, index: true },
    description: String,
    price: { type: Number, required: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
    brand: String,
    images: [imageSchema],
    variants: [variantSchema],
    stock: { type: Number, default: 0 },
    sold: { type: Number, default: 0 },
    ratings: { type: Number, default: 0 },
    numReviews: { type: Number, default: 0 },
    attributes: mongoose.Schema.Types.Mixed,
  },
  { timestamps: true }
);

export default mongoose.model("Product", productSchema);
