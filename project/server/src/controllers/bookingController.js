import Booking from "../models/Booking.js";
import Product from "../models/Product.js";
import User from "../models/User.js";
import { isAvailable } from "../utils/availabilityChecker.js";
import { createNotification } from "./notificationController.js";
import { sendEmail } from "../services/emailService.js";
import {
  buildBookingDecisionCustomerEmail,
  buildBookingRequestCustomerEmail,
  buildBookingRequestOwnerEmail,
} from "../templates/emailTemplates.js";
import AppError from "../utils/AppError.js";
import asyncHandler from "../middleware/asyncHandler.js";

const calculateDays = (startDate, endDate) =>
  (new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24);

const formatDate = (dateValue) =>
  new Date(dateValue).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

export const getMyBookings = asyncHandler(async (req, res) => {
  const bookings = await Booking.find({
    $or: [{ user: req.user.id }],
  })
    .populate("product")
    .sort({ createdAt: -1 });

  res.json(bookings);
});

export const getDashboardBookings = asyncHandler(async (req, res) => {
  const ownedProducts = await Product.find({ owner: req.user.id }).select("_id");
  const ownedProductIds = ownedProducts.map((product) => product._id);

  const [customerBookings, ownerBookings] = await Promise.all([
    Booking.find({ user: req.user.id })
      .populate("product")
      .sort({ createdAt: -1 }),
    Booking.find({ product: { $in: ownedProductIds } })
      .populate("product user")
      .sort({ createdAt: -1 }),
  ]);

  res.json({
    customerBookings,
    ownerBookings,
  });
});

export const createBooking = asyncHandler(async (req, res) => {
  const {
    productId,
    startDate,
    endDate,
    customerName,
    customerPhone,
    customerAddress,
  } = req.body;

  const product = await Product.findById(productId);
  if (!product) {
    throw new AppError("Product not found", 404);
  }

  if (product.type !== "rent") {
    throw new AppError("Only rental products can be booked", 400);
  }

  if (!product.rentPrice) {
    throw new AppError("This rental product has no rent price set", 400);
  }

  const available = await isAvailable(productId, startDate, endDate);
  if (!available) {
    throw new AppError("This product is not available for the selected dates", 409);
  }

  const owner = await User.findById(product.owner);
  if (!owner) {
    throw new AppError("Product owner not found", 400);
  }

  const totalDays = calculateDays(startDate, endDate);
  const totalAmount = product.rentPrice * totalDays;

  const booking = await Booking.create({
    user: req.user.id,
    product: productId,
    startDate,
    endDate,
    customerName: customerName.trim(),
    customerPhone: customerPhone.trim(),
    customerAddress: customerAddress.trim(),
    perDayPrice: product.rentPrice,
    totalDays,
    totalAmount,
    status: "requested",
  });

  await createNotification({
    userId: owner._id,
    type: "booking_request",
    title: `New booking request for ${product.title}`,
    message: `${customerName} requested ${formatDate(startDate)} to ${formatDate(endDate)}.`,
    metadata: {
      bookingId: booking._id,
      productId: product._id,
      productTitle: product.title,
      startDate,
      endDate,
      customerName,
      customerPhone,
      customerAddress,
      totalDays,
      perDayPrice: product.rentPrice,
      totalAmount,
      actionRequired: true,
    },
  });

  await createNotification({
    userId: req.user.id,
    type: "booking_request",
    title: `Booking request sent for ${product.title}`,
    message: `Your request for ${formatDate(startDate)} to ${formatDate(endDate)} was sent to the owner.`,
    metadata: {
      bookingId: booking._id,
      productId: product._id,
      productTitle: product.title,
      startDate,
      endDate,
      totalDays,
      perDayPrice: product.rentPrice,
      totalAmount,
    },
  });

  try {
    await sendEmail({
      to: owner.email,
      ...buildBookingRequestOwnerEmail({
        ownerName: owner.name,
        customerName,
        productTitle: product.title,
        startDate: formatDate(startDate),
        endDate: formatDate(endDate),
        customerPhone,
        customerAddress,
      }),
    });

    await sendEmail({
      to: req.user.email,
      ...buildBookingRequestCustomerEmail({
        customerName,
        productTitle: product.title,
        startDate: formatDate(startDate),
        endDate: formatDate(endDate),
      }),
    });
  } catch (mailError) {
    console.error("booking email error:", mailError);
  }

  res.status(201).json(booking);
});

export const respondToBooking = asyncHandler(async (req, res) => {
  const { action, ownerMessage, alternateStartDate, alternateEndDate } = req.body;

  const booking = await Booking.findById(req.params.id).populate("product user");
  if (!booking) {
    throw new AppError("Booking not found", 404);
  }

  if (String(booking.product.owner) !== String(req.user._id)) {
    throw new AppError("You can only respond to your own rental requests", 403);
  }

  let notificationType = "booking_declined";
  let notificationTitle = `Booking update for ${booking.product.title}`;
  let notificationMessage = `Your request for ${booking.product.title} was updated.`;

  booking.ownerMessage = ownerMessage?.trim() || "";

  if (action === "approve") {
    booking.status = "approved";
    notificationType = "booking_approved";
    notificationTitle = `Booking approved for ${booking.product.title}`;
    notificationMessage = `Your request for ${formatDate(booking.startDate)} to ${formatDate(booking.endDate)} was approved.`;
  }

  if (action === "decline") {
    booking.status = "declined";
    notificationMessage = `The owner could not approve your requested dates for ${booking.product.title}.`;
  }

  if (action === "alternate") {
    booking.status = "alternate_offered";
    booking.alternateStartDate = alternateStartDate;
    booking.alternateEndDate = alternateEndDate;
    notificationType = "booking_alternate_dates";
    notificationTitle = `Alternate dates offered for ${booking.product.title}`;
    notificationMessage = `The owner offered ${formatDate(alternateStartDate)} to ${formatDate(alternateEndDate)} instead.`;
  }

  await booking.save();

  await createNotification({
    userId: booking.user._id,
    type: notificationType,
    title: notificationTitle,
    message: notificationMessage,
    metadata: {
      bookingId: booking._id,
      productId: booking.product._id,
      productTitle: booking.product.title,
      startDate: booking.startDate,
      endDate: booking.endDate,
      alternateStartDate: booking.alternateStartDate,
      alternateEndDate: booking.alternateEndDate,
      totalDays: booking.totalDays,
      perDayPrice: booking.perDayPrice,
      totalAmount: booking.totalAmount,
      ownerMessage: booking.ownerMessage,
      status: booking.status,
      upiId: booking.product.upiId || "",
      upiQrImage: booking.product.upiQrImage || "",
    },
  });

  try {
    await sendEmail({
      to: booking.user.email,
      ...buildBookingDecisionCustomerEmail({
        customerName: booking.customerName || booking.user.name,
        productTitle: booking.product.title,
        approved: action === "approve",
        startDate: formatDate(booking.startDate),
        endDate: formatDate(booking.endDate),
        alternateStartDate: booking.alternateStartDate
          ? formatDate(booking.alternateStartDate)
          : "",
        alternateEndDate: booking.alternateEndDate
          ? formatDate(booking.alternateEndDate)
          : "",
        ownerMessage: booking.ownerMessage,
      }),
    });
  } catch (mailError) {
    console.error("booking response email error:", mailError);
  }

  res.json(booking);
});
