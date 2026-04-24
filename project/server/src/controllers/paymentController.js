import razorpay from "../services/paymentService.js";
import crypto from "crypto";
import Booking from "../models/Booking.js";
import AppError from "../utils/AppError.js";
import asyncHandler from "../middleware/asyncHandler.js";

export const createOrder = asyncHandler(async (req, res) => {
  const { bookingId } = req.body;

  const booking = await Booking.findById(bookingId);
  if (!booking) {
    throw new AppError("Booking not found", 404);
  }

  if (String(booking.user) !== String(req.user._id)) {
    throw new AppError("You can only create an order for your own booking", 403);
  }

  if (booking.status !== "approved") {
    throw new AppError("Only approved bookings can be paid", 400);
  }

  const options = {
    amount: booking.totalAmount * 100,
    currency: "INR",
    receipt: booking._id.toString(),
  };

  const order = await razorpay.orders.create(options);

  res.json(order);
});

export const verifyPayment = asyncHandler(async (req, res) => {
  const { bookingId, razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
  const razorpaySecret =
    process.env.RAZORPAY_KEY_SECRET || process.env.RAZORPAY_SECRET;

  if (!razorpaySecret) {
    throw new AppError("Razorpay secret is not configured", 500);
  }

  const body = razorpay_order_id + "|" + razorpay_payment_id;

  const expected = crypto
    .createHmac("sha256", razorpaySecret)
    .update(body)
    .digest("hex");

  if (expected === razorpay_signature) {
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      throw new AppError("Booking not found", 404);
    }

    if (String(booking.user) !== String(req.user._id)) {
      throw new AppError("You can only verify payment for your own booking", 403);
    }

    booking.status = "paid";
    await booking.save();

    return res.json({ msg: "Payment verified" });
  }

  throw new AppError("Payment verification failed", 400);
});
