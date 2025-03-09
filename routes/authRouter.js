import express from "express";
import {
  regiterUser,
  loginUser,
  getCurrentUser,
  logoutUser,
} from "../controllers/authController.js";
import { protectedMiddleware } from "../middlewares/authMiddleware.js";
const router = express.Router();

//Post /api/v1/auth/register
router.post("/register", regiterUser);

//Post /api/v1/auth/login
router.post("/login", loginUser);

//post /api/v1/auth/logout
router.get("/logout", protectedMiddleware, logoutUser);

//Post /api/v1/auth/getUser
router.get("/getUser", protectedMiddleware, getCurrentUser);

export default router;
