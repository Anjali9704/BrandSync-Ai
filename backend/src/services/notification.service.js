const Notification = require('../models/notification.model');
const ApiError = require('../utils/ApiError');

class NotificationService {
  async getNotifications(userId) {
    const notifications = await Notification.find({ user: userId })
      .sort({ createdAt: -1 })
      .limit(30)
      .lean();

    const unreadCount = await Notification.countDocuments({ user: userId, read: false });

    return {
      notifications: notifications.map((n) => ({
        id: n._id,
        _id: n._id,
        title: n.title,
        message: n.message,
        text: n.message,
        type: n.type,
        read: n.read,
        unread: !n.read,
        content_id: n.content_id,
        createdAt: n.createdAt,
        created_at: n.createdAt,
      })),
      unreadCount,
      unread_count: unreadCount,
    };
  }

  async markAsRead(notificationId, userId) {
    const notification = await Notification.findOneAndUpdate(
      { _id: notificationId, user: userId },
      { read: true },
      { new: true }
    );

    if (!notification) {
      throw new ApiError(404, 'Notification not found.');
    }

    return {
      id: notification._id,
      read: true,
      unread: false,
    };
  }

  async markAllAsRead(userId) {
    await Notification.updateMany({ user: userId, read: false }, { read: true });
    return { success: true };
  }

  async deleteNotification(notificationId, userId) {
    const deleted = await Notification.findOneAndDelete({ _id: notificationId, user: userId });
    if (!deleted) {
      throw new ApiError(404, 'Notification not found.');
    }
    return { success: true };
  }
}

module.exports = new NotificationService();
