import express from "express";
import protect from "../middleware/authMiddleware.js";
import {
  getMyNotifications,
  markNotificationRead,
} from "../controllers/notificationController.js";
import { validateObjectIdParam } from "../middleware/validateRequest.js";

const router = express.Router();

router.get("/", protect, getMyNotifications);
router.patch("/:id/read", protect, validateObjectIdParam(), markNotificationRead);

export default router;
