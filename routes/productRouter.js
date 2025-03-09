import express from "express";
import {
  protectedMiddleware,
  adminMiddleware,
} from "../middlewares/authMiddleware.js";
import {
  createProduct,
  getProducts,
  detailProduct,
  deleteProduct,
  updateProduct,
  fileUpload,
} from "../controllers/productController.js";
import { upload } from "../utils/uploadFileHandler.js";

const router = express.Router();

// CRUD Product
// Craete Data Product
// post /api/v1/product
//middleware admin
router.post("/", protectedMiddleware, adminMiddleware, createProduct);

//Get All Data Product
// get /api/v1/product
router.get("/", getProducts);

//Detail Data Product
// get /api/v1/product/:id
router.get("/:id", detailProduct);

// Update Data Product
// put /api/v1/product/:id
router.put("/:id", protectedMiddleware, adminMiddleware, updateProduct);

// Delete Data Product
// delete /api/v1/product/:id
router.delete("/:id", protectedMiddleware, adminMiddleware, deleteProduct);

//File Update Data Product
//post /api/v1/product/:id/file-upload
router.post(
  "/file-upload",
  protectedMiddleware,
  adminMiddleware,
  upload.single("image"),
  fileUpload
);

export default router;
