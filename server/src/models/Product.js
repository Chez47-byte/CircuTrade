import mongoose from "mongoose";
import { PRODUCT_CATEGORIES } from "../constants/productCategories.js";

const productSchema = new mongoose.Schema({
  title: { type: String, required: true },
  price: { type: Number, required: true },

  type: {
    type: String,
    enum: ["buy", "sell", "rent"],
    default: "sell",
  },

  category: {
    type: String,
    enum: PRODUCT_CATEGORIES,
    required: true,
  },

  rentPrice: Number,
  upiId: String,
  upiQrImage: String,

  description: String,
  image: String,
  images: [String],

  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },

}, { timestamps: true });

export default mongoose.model("Product", productSchema);
