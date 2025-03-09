import express from "express";
import {
  protectedMiddleware,
  adminMiddleware,
} from "../middlewares/authMiddleware.js";
import {
  CreateOrder,
  DetailOrder,
  CurrentUserOrder,
  AllOrder,
} from "../controllers/orderController.js";

const router = express.Router();

// [POST] /api/v1/order
router.post("/", protectedMiddleware, CreateOrder);

// [GET] /api/v1/order
router.get("/", protectedMiddleware, adminMiddleware, AllOrder);

// [GET] /api/v1/order/:id
router.get("/:id", protectedMiddleware, adminMiddleware, DetailOrder);

// [GET] /api/v1/order/current/user
router.get("/current/user", protectedMiddleware, CurrentUserOrder);

export default router;
