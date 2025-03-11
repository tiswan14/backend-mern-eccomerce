import "dotenv/config";
import express from "express";
import mongoose from "mongoose";
import helmet from "helmet";
import ExpressMongoSanitize from "express-mongo-sanitize";
import cookieParser from "cookie-parser";

import { notFound, errorHandler } from "./middlewares/errorMiddleware.js";
import authRouter from "./routes/authRouter.js";
import productRouter from "./routes/productRouter.js";
import orderRouter from "./routes/orderRouter.js";

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("./public"));
app.use(helmet());
app.use(ExpressMongoSanitize());
app.use(cookieParser());

// Routes
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/product", productRouter);
app.use("/api/v1/order", orderRouter);

// Error Handling Middleware
app.use(notFound);
app.use(errorHandler);

// Koneksi ke Database
const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("❌ MONGO_URI tidak ditemukan di environment variables.");
    }

    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000, // Tunggu max 5 detik sebelum error
      socketTimeoutMS: 45000, // Koneksi timeout setelah 45 detik
    });

    console.log("✅ Database connected");
  } catch (err) {
    console.error("❌ Error connecting to database:", err.message);
    process.exit(1);
  }
};

// Mulai Server
const startServer = async () => {
  await connectDB();

  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`🚀 Aplikasi berjalan di port: ${port}`);
  });
};

startServer();

export default app;
