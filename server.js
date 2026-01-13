// src/server.js
import dotenv from "dotenv";
dotenv.config();
import colors from "colors"; // optional, install if used
import connectDB from "./src/config/db.js";
import app from "./app.js";

const PORT = process.env.PORT || 5000;

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(
        `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.cyan ||
          `Server running on port ${PORT}`
      );
    });
  })
  .catch((err) => {
    console.error("Failed to connect DB:", err);
    process.exit(1);
  });
