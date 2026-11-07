const notificationService = require('../services/notification.service');
const asyncHandler = require('../utils/asyncHandler');

const getNotifications = asyncHandler(async (req, res) => {
  const result = await notificationService.getNotifications(req.user._id);
  return res.status(200).json(result);
});

const markAsRead = asyncHandler(async (req, res) => {
  const result = await notificationService.markAsRead(req.params.id, req.user._id);
  return res.status(200).json(result);
});

const markAllAsRead = asyncHandler(async (req, res) => {
  const result = await notificationService.markAllAsRead(req.user._id);
  return res.status(200).json(result);
});

const deleteNotification = asyncHandler(async (req, res) => {
  const result = await notificationService.deleteNotification(req.params.id, req.user._id);
  return res.status(200).json(result);
});

module.exports = {
  getNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
};

