import axiosInstance from './api/axiosInstance.js';
import API from './api/apiEndpoints.js';

export async function getReportsSummary(params = {}) {
  const { data } = await axiosInstance.get(API.REPORTS_SUMMARY, { params });
  return data;
}
