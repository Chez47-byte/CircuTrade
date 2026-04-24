import Booking from "../models/Booking.js";
import Product from "../models/Product.js";
import AppError from "../utils/AppError.js";
import asyncHandler from "../middleware/asyncHandler.js";
import { PRODUCT_CATEGORIES } from "../constants/productCategories.js";

// GET ALL
export const getProducts = asyncHandler(async (req, res) => {
  const filters = {};

  if (req.query.type) {
    filters.type = req.query.type;
  }

  if (req.query.category && PRODUCT_CATEGORIES.includes(req.query.category)) {
    filters.category = req.query.category;
  }

  const products = await Product.find(filters).sort({ createdAt: -1 });
  res.json(products);
});

// GET SINGLE
export const getSingleProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    throw new AppError("Product not found", 404);
  }

  res.json(product);
});

// CREATE
export const createProduct = asyncHandler(async (req, res) => {
  const product = await Product.create({
    ...req.body,
    title: req.body.title.trim(),
    type: req.body.type.trim(),
    category: req.body.category.trim(),
    price: Number(req.body.price),
    rentPrice: req.body.rentPrice ? Number(req.body.rentPrice) : undefined,
    owner: req.user.id,
  });

  res.status(201).json(product);
});

// MY PRODUCTS
export const getMyProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({ owner: req.user.id }).sort({ createdAt: -1 });
  res.json(products);
});

export const deleteMyProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    throw new AppError("Product not found", 404);
  }

  if (String(product.owner) !== String(req.user.id)) {
    throw new AppError("You can only remove your own product", 403);
  }

  const activeBooking = await Booking.findOne({
    product: product._id,
    status: { $in: ["requested", "approved", "paid", "alternate_offered"] },
  });

  if (activeBooking) {
    throw new AppError(
      "You cannot remove this listing while it has active rental requests or orders",
      400
    );
  }

  await product.deleteOne();

  res.json({ msg: "Product removed successfully" });
});
