import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import asyncHandler from "./asyncHandler.js";

export const protectedMiddleware = asyncHandler(async (req, res, next) => {
  let token = req.cookies?.jwt || req.headers.authorization?.split(" ")[1];

  if (!token) {
    res.status(401);
    throw new Error("Akses ditolak! Token tidak ditemukan.");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-password");

    return next();
  } catch (error) {
    res.status(401);
    throw new Error("Akses ditolak! Token tidak valid atau kedaluwarsa.");
  }
});

export const adminMiddleware = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(401);
    throw new Error("Akses ditolak! Anda bukan admin.");
  }
};
