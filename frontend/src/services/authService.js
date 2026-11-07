import axiosInstance from './api/axiosInstance.js';
import API from './api/apiEndpoints.js';

export async function login(email, password) {
  const { data } = await axiosInstance.post(API.LOGIN, { email, password });
  return data;
}

export async function forgotPassword(email) {
  const { data } = await axiosInstance.post(API.FORGOT_PASSWORD, { email });
  return data;
}

export async function getMe() {
  const { data } = await axiosInstance.get(API.ME);
  return data;
}

export async function updateProfile(payload) {
  const { data } = await axiosInstance.put(API.UPDATE_PROFILE, payload);
  return data;
}

export async function changePassword(payload) {
  const { data } = await axiosInstance.put(API.CHANGE_PASSWORD, payload);
  return data;
}

export async function updatePreferences(payload) {
  const { data } = await axiosInstance.put(API.UPDATE_PREFERENCES, payload);
  return data;
}
