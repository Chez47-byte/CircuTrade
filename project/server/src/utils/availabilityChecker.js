import Booking from "../models/Booking.js";

export const isAvailable = async (productId, start, end) => {
  const clash = await Booking.findOne({
    product: productId,
    $or: [
      { startDate: { $lte: end }, endDate: { $gte: start } }
    ],
    status: { $in: ["approved", "paid"] }
  });

  return !clash;
};
