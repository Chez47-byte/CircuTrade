import express from "express";
import { createOrder, verifyPayment } from "../controllers/paymentController.js";
import protect from "../middleware/authMiddleware.js";
import {
  validateCreateOrder,
  validateVerifyPayment,
} from "../middleware/validateRequest.js";

const router = express.Router();

router.post("/order", protect, validateCreateOrder, createOrder);
router.post("/create-order", protect, validateCreateOrder, createOrder);
router.post("/verify", protect, validateVerifyPayment, verifyPayment);

export default router;
