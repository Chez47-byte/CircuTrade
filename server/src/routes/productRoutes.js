import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  getProducts,
  getSingleProduct,
  createProduct,
  getMyProducts,
  deleteMyProduct,
} from "../controllers/productController.js";
import {
  validateCreateProduct,
  validateObjectIdParam,
} from "../middleware/validateRequest.js";


const router = express.Router();

router.get("/", getProducts);
router.get("/my", protect, getMyProducts);
router.get("/:id", validateObjectIdParam(), getSingleProduct);
router.post("/", protect, validateCreateProduct, createProduct);
router.delete("/:id", protect, validateObjectIdParam(), deleteMyProduct);

export default router;
