import Notification from "../models/Notification.js";
import AppError from "../utils/AppError.js";
import asyncHandler from "../middleware/asyncHandler.js";

export const getMyNotifications = asyncHandler(async (req, res) => {
  const notifications = await Notification.find({ user: req.user.id }).sort({
    createdAt: -1,
  });

  res.json(notifications);
});

export const markNotificationRead = asyncHandler(async (req, res) => {
  const notification = await Notification.findOne({
    _id: req.params.id,
    user: req.user.id,
  });

  if (!notification) {
    throw new AppError("Notification not found", 404);
  }

  notification.read = true;
  await notification.save();

  res.json(notification);
});

export const createNotification = async ({
  userId,
  type = "system",
  title,
  message,
  metadata = {},
}) => {
  return Notification.create({
    user: userId,
    type,
    title,
    message,
    metadata,
  });
};
