import Review from "../models/Review.js";
import Product from "../models/Product.js";
import AppError from "../utils/AppError.js";
import asyncHandler from "../middleware/asyncHandler.js";

export const addReview = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.body.product);
  if (!product) {
    throw new AppError("Product not found", 404);
  }

  const review = await Review.create({
    ...req.body,
    comment: req.body.comment.trim(),
    user: req.user._id,
  });

  res.json(review);
});
