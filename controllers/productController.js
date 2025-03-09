import asyncHandler from "../middlewares/asyncHandler.js";
import Product from "../models/productModel.js";
import mongoose from "mongoose";

export const createProduct = asyncHandler(async (req, res, next) => {
  const newProduct = await Product.create(req.body);

  return res.status(201).json({
    message: "Produk berhasil di tambahkan!",
    data: newProduct,
  });
});

export const getProducts = asyncHandler(async (req, res) => {
  const queryObj = { ...req.query };
  const excludeFields = ["page", "limit", "name"];
  excludeFields.forEach((field) => delete queryObj[field]);

  let filter = queryObj;

  if (req.query.name) {
    filter = {
      name: { $regex: req.query.name, $options: "i" },
    };
  }

  let query = Product.find(filter);

  const totalProducts = await Product.countDocuments(filter);

  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 30;
  const skip = (page - 1) * limit;

  query = query.skip(skip).limit(limit);

  if (req.query.page && skip >= totalProducts) {
    return res.status(404).json({ message: "Halaman ini tidak ada!" });
  }

  const data = await query;

  res.status(200).json({
    message: "Menampilkan produk",
    total: totalProducts,
    data,
  });
});

export const detailProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "ID produk tidak valid!" });
  }

  const product = await Product.findById(id);

  if (!product) {
    return res.status(404).json({ message: "Produk tidak ditemukan!" });
  }

  res
    .status(200)
    .json({ message: "Detail produk berhasil ditampilkan", data: product });
});

export const updateProduct = asyncHandler(async (req, res) => {
  const paramId = req.params.id;
  const updateProduct = await Product.findByIdAndUpdate(paramId, req.body, {
    runValidators: false,
    new: true,
  });

  return res.status(201).json({
    message: "Produk berhasil di update!",
    data: updateProduct,
  });
});

export const deleteProduct = asyncHandler(async (req, res, next) => {
  const paramId = req.params.id;

  const deleteProduct = await Product.findByIdAndDelete(paramId);

  return res.status(200).json({
    message: "Produk berhasil di hapus!",
    data: deleteProduct,
  });
});

export const fileUpload = asyncHandler(async (req, res) => {
  const file = req.file;
  if (!file) {
    res.status(400);
    throw new Error("Tidak ada file yang diupload");
  }

  const imageFileName = file.filename;
  const pathImageFile = `uploads/${imageFileName}`;

  res.status(200).json({
    message: "Image berhasil diupload",
    image: pathImageFile,
  });
});
