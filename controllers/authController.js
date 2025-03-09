import User from "../models/userModel.js";
import jwt from "jsonwebtoken";
import asyncHandler from "../middlewares/asyncHandler.js";

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "6d",
  });
};
const createSendResToken = (user, statusCode, res) => {
  const token = signToken(user._id);

  const isDev = process.env.NODE_ENV === "development" ? false : true;

  const cookieOption = {
    expire: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000),
    httpOnly: true,
    security: isDev,
  };

  res.cookie("jwt", token, cookieOption);

  user.password = undefined;

  res.status(statusCode).json({
    data: user,
  });
};

export const regiterUser = asyncHandler(async (req, res, next) => {
  const isAdmin = (await User.countDocuments()) === 0;

  const role = isAdmin ? "admin" : "user";

  const createUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    role,
  });
  createSendResToken(createUser, 201, res);
});

export const loginUser = asyncHandler(async (req, res) => {
  //create validation
  if (!req.body.email || !req.body.password) {
    res.status(400);
    throw new Error("Email atau password tidak boleh kosong!");
  }

  // cek apakah email ada di db atau tidak
  const userData = await User.findOne({
    email: req.body.email,
  });

  // cek password
  if (userData && (await userData.comparePassword(req.body.password))) {
    createSendResToken(userData, 200, res);
  } else {
    res.status(400);
    throw new Error("Invalid User");
  }
});

export const getCurrentUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id).select("-password");

  if (user) {
    return res.status(200).json({
      user,
    });
  } else {
    return res.staus(404);
    throw new Error("User tidak ditemukan");
  }
});

export const logoutUser = async (req, res) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(Date.now()),
  });

  res.status(200).json({
    message: "Logout berhasil!",
  });
};
