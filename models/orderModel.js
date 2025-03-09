import mongoose from "mongoose";
const { Schema } = mongoose;

const singleProduct = Schema({
  name: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  product: {
    type: mongoose.Schema.ObjectId,
    ref: "Product",
    required: true,
  },
});

const orderSchema = new Schema({
  total: {
    type: Number,
    required: [true, "Total harga harus diisi"],
  },
  status: {
    type: String,
    enum: ["pending", "success", "failed"],
    default: "pending",
  },

  itemDetail: [singleProduct],

  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },

  firstName: {
    type: String,
    required: [true, "Nama depan harus diisi"],
  },
  lastName: {
    type: String,
  },
  phone: {
    type: String,
    required: [true, "Nomor telepon harus diisi"],
  },
  email: {
    type: String,
    required: [true, "Email harus diisi"],
  },
});

const Order = mongoose.model("Order", orderSchema);

export default Order;
