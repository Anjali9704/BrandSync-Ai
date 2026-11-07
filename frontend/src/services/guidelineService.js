import axiosInstance from './api/axiosInstance.js';
import API from './api/apiEndpoints.js';

export async function getGuidelines(params = {}) {
  const { data } = await axiosInstance.get(API.GUIDELINES, { params });
  return data;
}

export async function createGuideline(payload) {
  const { data } = await axiosInstance.post(API.GUIDELINES, payload);
  return data;
}

export async function updateGuideline(id, payload) {
  const { data } = await axiosInstance.put(API.GUIDELINE(id), payload);
  return data;
}

export async function deleteGuideline(id) {
  const { data } = await axiosInstance.delete(API.GUIDELINE(id));
  return data;
}

export async function getAssets() {
  const { data } = await axiosInstance.get(API.GUIDELINE_ASSETS);
  return data;
}

export async function uploadAsset(formData) {
  const { data } = await axiosInstance.post(API.GUIDELINE_ASSETS, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
}

export async function deleteAsset(id) {
  const { data } = await axiosInstance.delete(API.GUIDELINE_ASSET(id));
  return data;
}
