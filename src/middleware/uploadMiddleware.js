// src/middleware/uploadMiddleware.js
import multer from "multer";

const storage = multer.memoryStorage(); // use memory; we'll send buffer to Cloudinary
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) cb(null, true);
  else cb(new Error("Not an image!"), false);
};

export const uploadSingle = multer({ storage, fileFilter }).single("image");
export const uploadMultiple = multer({ storage, fileFilter }).array(
  "images",
  6
);
