import axiosInstance from './api/axiosInstance.js';
import API from './api/apiEndpoints.js';

export async function getReviewQueue(params = {}) {
  const { data } = await axiosInstance.get(API.REVIEW, { params });
  return data;
}

export async function submitReview(contentId, payload) {
  const { data } = await axiosInstance.post(API.SUBMIT_REVIEW(contentId), payload);
  return data;
}

export async function getReviewHistory(contentId) {
  const { data } = await axiosInstance.get(API.REVIEW_HISTORY(contentId));
  return data;
}
