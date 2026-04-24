import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },

  startDate: Date,
  endDate: Date,
  alternateStartDate: Date,
  alternateEndDate: Date,
  customerName: String,
  customerPhone: String,
  customerAddress: String,
  ownerMessage: String,
  perDayPrice: Number,
  totalDays: Number,

  status: {
    type: String,
    enum: ["requested", "approved", "declined", "alternate_offered", "paid"],
    default: "requested"
  },

  totalAmount: Number,

}, { timestamps: true });

export default mongoose.model("Booking", bookingSchema);
