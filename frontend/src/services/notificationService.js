import axiosInstance from './api/axiosInstance.js';
import API from './api/apiEndpoints.js';

export async function getNotifications() {
  const { data } = await axiosInstance.get(API.NOTIFICATIONS);
  return data;
}

export async function markAsRead(id) {
  const { data } = await axiosInstance.patch(API.MARK_NOTIFICATION_READ(id));
  return data;
}

export async function markAllAsRead() {
  const { data } = await axiosInstance.patch(API.MARK_ALL_NOTIFICATIONS_READ);
  return data;
}

export async function deleteNotification(id) {
  const { data } = await axiosInstance.delete(API.DELETE_NOTIFICATION(id));
  return data;
}

