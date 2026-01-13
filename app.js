// src/app.js (REFACTORED)
// ============================================
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import routes from "./src/routes/index.js";
import { notFound, errorHandler } from "./src/middleware/errorMiddleware.js";

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.CLIENT_URL || "https://shophub4.netlify.app",
    credentials: true,
  })
);

// Routes
app.use("/api",routes);

// Error Handling
app.use(notFound);
app.use(errorHandler);

export default app;
