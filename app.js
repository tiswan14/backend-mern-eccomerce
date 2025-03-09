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

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("✅ Database connected");
    app.listen(port, () => {
      console.log(`🚀 Aplikasi berjalan di port: ${port}`);
    });
  })
  .catch((err) => {
    console.error("❌ Error connecting to database:", err.message);
    process.exit(1);
  });
