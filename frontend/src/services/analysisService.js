import axiosInstance from './api/axiosInstance.js';
import API from './api/apiEndpoints.js';

export async function submitContent(payload) {
  const { data } = await axiosInstance.post(API.CONTENT, payload);
  return data;
}

export async function listContent(params = {}) {
  const { data } = await axiosInstance.get(API.CONTENT, { params });
  return data;
}

export async function getContentById(id) {
  const { data } = await axiosInstance.get(API.CONTENT_ITEM(id));
  return data;
}

export async function analyzeContent(id) {
  const { data } = await axiosInstance.post(API.ANALYZE(id));
  return data;
}

export async function updateIssueStatus(contentId, issueId, status) {
  const { data } = await axiosInstance.patch(API.UPDATE_ISSUE(contentId, issueId), { status });
  return data;
}
