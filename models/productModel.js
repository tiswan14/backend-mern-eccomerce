import mongoose from "mongoose";
const { Schema } = mongoose;

const productSchema = new Schema({
  name: {
    type: String,
    required: [true, "Nama produk harus diisi"],
    unique: [true, "Nama produk sudah ada, silahkan gunakan yang lain"],
  },
  price: {
    type: String,
    required: [true, "Harga produk harus diisi"],
  },
  description: {
    type: String,
    required: [true, "Deskripsi produk harus diisi"],
  },
  image: {
    type: String,
    default: null,
  },
  category: {
    type: String,
    required: [true, "Kategori produk harus diisi"],
    enum: ["sepatu", "baju", "celana"],
  },
  stock: {
    type: Number,
    default: 0,
  },
});

const Product = mongoose.model("Product", productSchema);

export default Product;
