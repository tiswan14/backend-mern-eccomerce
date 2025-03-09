import asyncHandler from "../middlewares/asyncHandler.js";
import Product from "../models/productModel.js";
import Order from "../models/orderModel.js";

export const CreateOrder = asyncHandler(async (req, res) => {
  const { email, firstName, lastName, phone, cartItem } = req.body;

  if (!cartItem || cartItem.length < 1) {
    res.status(400);
    throw new Error("Keranjang masih kosong!");
  }

  let orderItem = [];
  let total = 0;

  for (const cart of cartItem) {
    const productData = await Product.findOne({ _id: cart.product });

    if (!productData) {
      res.status(404);
      throw new Error("Id produk tidak ditemukan!");
    }

    const { name, price, _id } = productData;
    const singleProduct = {
      quantity: cart.quantity,
      name,
      price,
      product: _id,
    };
    orderItem = [...orderItem, singleProduct];

    total += cart.quantity * price;
  }

  const order = await Order.create({
    itemDetail: orderItem,
    total,
    firstName,
    lastName,
    email,
    phone,
    user: req.user._id,
  });

  return res.status(201).json({
    total,
    order,
    message: "Order berhasil ditambahkan!",
  });
});

export const AllOrder = asyncHandler(async (req, res) => {
  const orders = await Order.find();

  return res.status(200).json({
    data: orders,
    message: "Semua order berhasil ditampilkan!",
  });
});

export const DetailOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  return res.status(200).json({
    data: order,
    message: "Detail order berhasil ditampilkan!",
  });
});

export const CurrentUserOrder = asyncHandler(async (req, res) => {
  const order = await Order.find({ user: req.user._id });

  return res.status(200).json({
    data: order,
    message: "Order current user berhasil ditampilkan!",
  });
});
