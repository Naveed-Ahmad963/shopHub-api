// src/services/cloudinaryService.js (NEW)
// ============================================
import cloudinary from "../config/cloudinary.js";
import { logger } from "../utils/logger.js";

export const cloudinaryService = {
  async uploadImage(file, folder = "ecommerce_products") {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder,
          transformation: [
            { width: 800, height: 800, crop: "limit" },
            { quality: "auto" },
          ],
        },
        (error, result) => {
          if (error) reject(error);
          else
            resolve({
              url: result.secure_url,
              public_id: result.public_id,
            });
        }
      );
      uploadStream.end(file.buffer);
    });
  },

  async uploadMultipleImages(files, folder = "ecommerce_products") {
    try {
      const uploadPromises = files.map((file) =>
        this.uploadImage(file, folder)
      );
      const results = await Promise.all(uploadPromises);
      logger.success(`Uploaded ${results.length} images`);
      return results;
    } catch (error) {
      logger.error(`Failed to upload images: ${error.message}`);
      throw new Error(`Failed to upload images: ${error.message}`);
    }
  },

  async deleteImage(publicId) {
    try {
      await cloudinary.uploader.destroy(publicId);
      logger.success(`Deleted image: ${publicId}`);
      return true;
    } catch (error) {
      logger.error(`Failed to delete image ${publicId}: ${error.message}`);
      return false;
    }
  },

  async deleteMultipleImages(publicIds) {
    const results = await Promise.all(
      publicIds.map((id) => this.deleteImage(id))
    );
    return results.filter(Boolean).length;
  },
};
