import "dotenv/config";
import express from "express";
import mongoose from "mongoose";
import helmet from "helmet";
import ExpressMongoSanitize from "express-mongo-sanitize";
import { notFound, errorHandler } from "./middlewares/errorMiddleware.js";
import cookieParser from "cookie-parser";

const app = express();
const port = process.env.PORT || 3000;

//Middleware
app.use(express.json());
app.use(helmet());
app.use(ExpressMongoSanitize());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("./public"));

import authRouter from "./routes/authRouter.js";
import productRouter from "./routes/productRouter.js";
import orderRouter from "./routes/orderRouter.js";

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/product", productRouter);
app.use("/api/v1/order", orderRouter);

app.use(notFound);
app.use(errorHandler);

const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("❌ MONGO_URI tidak ditemukan di environment variables.");
    }

    await mongoose.connect(process.env.MONGO_URI); // Hapus opsi deprecated
    console.log("✅ Database connected");
  } catch (err) {
    console.error("❌ Error connecting to database:", err.message);
    process.exit(1);
  }
};

const startServer = () => {
  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`🚀 Aplikasi berjalan di port: ${port}`);
  });
};

connectDB().then(startServer);
