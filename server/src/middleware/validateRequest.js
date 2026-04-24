import mongoose from "mongoose";
import AppError from "../utils/AppError.js";
import { PRODUCT_CATEGORIES } from "../constants/productCategories.js";

const EMAIL_PATTERN = /^\S+@\S+\.\S+$/;
const PRODUCT_TYPES = ["buy", "sell", "rent"];
const BOOKING_ACTIONS = ["approve", "decline", "alternate"];

const isNonEmptyString = (value, minLength = 1) =>
  typeof value === "string" && value.trim().length >= minLength;

const isPositiveNumber = (value) =>
  typeof value === "number" && Number.isFinite(value) && value > 0;

const isValidDateValue = (value) => !Number.isNaN(new Date(value).getTime());

const isValidObjectId = (value) => mongoose.Types.ObjectId.isValid(value);

const pushIf = (errors, condition, message) => {
  if (condition) {
    errors.push(message);
  }
};

export const validate = (validator) => (req, res, next) => {
  const errors = validator(req);

  if (errors.length > 0) {
    return next(new AppError("Validation failed", 400, errors));
  }

  next();
};

export const validateSignup = validate((req) => {
  const { name, email, password } = req.body;
  const errors = [];

  pushIf(errors, !isNonEmptyString(name, 2), "Name must be at least 2 characters long");
  pushIf(
    errors,
    !isNonEmptyString(email) || !EMAIL_PATTERN.test(email.trim()),
    "A valid email is required"
  );
  pushIf(errors, !isNonEmptyString(password, 6), "Password must be at least 6 characters long");

  return errors;
});

export const validateLogin = validate((req) => {
  const { email, password } = req.body;
  const errors = [];

  pushIf(
    errors,
    !isNonEmptyString(email) || !EMAIL_PATTERN.test(email.trim()),
    "A valid email is required"
  );
  pushIf(errors, !isNonEmptyString(password, 6), "Password must be at least 6 characters long");

  return errors;
});

export const validateCreateProduct = validate((req) => {
  const {
    title,
    price,
    type,
    category,
    rentPrice,
    description,
    image,
    images,
    upiId,
    upiQrImage,
  } = req.body;
  const errors = [];
  const normalizedType = typeof type === "string" ? type.trim() : "";
  const normalizedCategory = typeof category === "string" ? category.trim() : "";

  pushIf(errors, !isNonEmptyString(title, 3), "Title must be at least 3 characters long");
  pushIf(errors, !isPositiveNumber(Number(price)), "Price must be a positive number");
  pushIf(errors, !PRODUCT_TYPES.includes(normalizedType), "Type must be buy, sell, or rent");
  pushIf(
    errors,
    !PRODUCT_CATEGORIES.includes(normalizedCategory),
    "Category must be trendy, vintage, premium, party, or wedding"
  );
  pushIf(
    errors,
    description !== undefined && description !== null && typeof description !== "string",
    "Description must be a string"
  );
  pushIf(errors, image !== undefined && image !== null && typeof image !== "string", "Image must be a string");
  pushIf(
    errors,
    images !== undefined &&
      (!Array.isArray(images) || images.some((item) => typeof item !== "string")),
    "Images must be an array of strings"
  );
  pushIf(errors, upiId !== undefined && upiId !== null && typeof upiId !== "string", "UPI ID must be a string");
  pushIf(
    errors,
    upiQrImage !== undefined && upiQrImage !== null && typeof upiQrImage !== "string",
    "UPI QR image must be a string"
  );

  if (normalizedType === "rent") {
    pushIf(errors, !isPositiveNumber(Number(rentPrice)), "Rent price must be a positive number for rental products");
  }

  return errors;
});

export const validateObjectIdParam = (paramName = "id") =>
  validate((req) => {
    const errors = [];
    pushIf(errors, !isValidObjectId(req.params[paramName]), `Invalid ${paramName}`);
    return errors;
  });

export const validateCreateBooking = validate((req) => {
  const {
    productId,
    startDate,
    endDate,
    customerName,
    customerPhone,
    customerAddress,
  } = req.body;
  const errors = [];

  pushIf(errors, !isValidObjectId(productId), "A valid productId is required");
  pushIf(errors, !isValidDateValue(startDate), "A valid startDate is required");
  pushIf(errors, !isValidDateValue(endDate), "A valid endDate is required");
  pushIf(errors, !isNonEmptyString(customerName, 2), "Customer name must be at least 2 characters long");
  pushIf(errors, !isNonEmptyString(customerPhone, 8), "Customer phone must be at least 8 characters long");
  pushIf(errors, !isNonEmptyString(customerAddress, 10), "Customer address must be at least 10 characters long");

  if (isValidDateValue(startDate) && isValidDateValue(endDate)) {
    pushIf(errors, new Date(endDate) <= new Date(startDate), "End date must be after start date");
  }

  return errors;
});

export const validateRespondBooking = validate((req) => {
  const { action, ownerMessage, alternateStartDate, alternateEndDate } = req.body;
  const errors = [];

  pushIf(errors, !BOOKING_ACTIONS.includes(action), "Action must be approve, decline, or alternate");
  pushIf(
    errors,
    ownerMessage !== undefined && ownerMessage !== null && typeof ownerMessage !== "string",
    "Owner message must be a string"
  );

  if (action === "alternate") {
    pushIf(errors, !isValidDateValue(alternateStartDate), "A valid alternateStartDate is required");
    pushIf(errors, !isValidDateValue(alternateEndDate), "A valid alternateEndDate is required");

    if (isValidDateValue(alternateStartDate) && isValidDateValue(alternateEndDate)) {
      pushIf(
        errors,
        new Date(alternateEndDate) <= new Date(alternateStartDate),
        "Alternate end date must be after alternate start date"
      );
    }
  }

  return errors;
});

export const validateCreateOrder = validate((req) => {
  const errors = [];
  pushIf(errors, !isValidObjectId(req.body.bookingId), "A valid bookingId is required");
  return errors;
});

export const validateVerifyPayment = validate((req) => {
  const { bookingId, razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
  const errors = [];

  pushIf(errors, !isValidObjectId(bookingId), "A valid bookingId is required");
  pushIf(errors, !isNonEmptyString(razorpay_order_id), "razorpay_order_id is required");
  pushIf(errors, !isNonEmptyString(razorpay_payment_id), "razorpay_payment_id is required");
  pushIf(errors, !isNonEmptyString(razorpay_signature), "razorpay_signature is required");

  return errors;
});

export const validateAddReview = validate((req) => {
  const { product, rating, comment } = req.body;
  const errors = [];

  pushIf(errors, !isValidObjectId(product), "A valid product id is required");
  pushIf(errors, !Number.isInteger(rating) || rating < 1 || rating > 5, "Rating must be an integer between 1 and 5");
  pushIf(errors, !isNonEmptyString(comment, 3), "Comment must be at least 3 characters long");

  return errors;
});
