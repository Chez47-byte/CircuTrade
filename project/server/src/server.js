import "./config/env.js";

import express from "express";

import cors from "cors";
import connectDB from "./config/db.js";
import cloudinaryConfig from "./config/cloudinary.js";

import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import errorHandler from "./middleware/errorMiddleware.js";


const app = express();
const port = process.env.PORT || 5000;

const allowedOrigins = [
  "https://circu-trade.vercel.app",  // NO trailing slash
  "https://circutrade.onrender.com"
];

app.use(cors({
  origin: function (origin, callback) {
    // 1. Allow requests with no origin (like mobile apps)
    if (!origin) return callback(null, true);

    // 2. Define allowed domains
    const isVercel = origin.endsWith(".vercel.app");
    const isRender = origin.includes("onrender.com");
    const isLocal = origin.includes("localhost");

    if (isVercel || isRender || isLocal) {
      callback(null, true);
    } else {
      console.log("Blocked by CORS:", origin);
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
}));
app.use(express.json({ limit: "15mb" }));
app.use(express.urlencoded({ extended: true, limit: "15mb" }));

app.get("/", (req, res) => {
  res.send("API is running");
});

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/notifications", notificationRoutes);
app.use(errorHandler);

const startServer = async () => {
  try {
    await connectDB();
    app.listen(port, () => console.log(`Server running on port ${port}`));
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
