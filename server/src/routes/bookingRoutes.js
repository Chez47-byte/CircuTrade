
import express from "express";
import protect from "../middleware/authMiddleware.js";
import {
  createBooking,
  respondToBooking,
  getMyBookings,
  getDashboardBookings,
} from "../controllers/bookingController.js";
import {
  validateCreateBooking,
  validateObjectIdParam,
  validateRespondBooking,
} from "../middleware/validateRequest.js";

const router = express.Router();

router.get("/dashboard", protect, getDashboardBookings);
router.get("/my", protect, getMyBookings);
router.post("/", protect, validateCreateBooking, createBooking);
router.patch("/:id/respond", protect, validateObjectIdParam(), validateRespondBooking, respondToBooking);

export default router;
