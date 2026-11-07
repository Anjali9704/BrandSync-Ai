import axiosInstance from './api/axiosInstance.js';
import API from './api/apiEndpoints.js';

export async function getDashboardStats() {
  const { data } = await axiosInstance.get(API.DASHBOARD_STATS);
  return data;
}
