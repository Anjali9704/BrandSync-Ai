import axios from 'axios';

function sanitizeBaseUrl(raw) {
  if (!raw || typeof raw !== 'string') {
    return '/api/v1';
  }

  let url = raw.trim();

  // If user only provided /api/v1 or a relative path
  if (url.startsWith('/')) {
    return url.replace(/\/+$/, '');
  }

  // If domain was entered without https:// (e.g. "brand-sync-ai-1jj5.vercel.app")
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    url = `https://${url}`;
  }

  // Remove trailing slashes
  url = url.replace(/\/+$/, '');

  // Ensure /api/v1 is present
  if (!url.endsWith('/api/v1') && !url.includes('/api/')) {
    url = `${url}/api/v1`;
  }

  return url;
}

const apiBaseUrl = sanitizeBaseUrl(import.meta.env.VITE_API_BASE_URL);

const axiosInstance = axios.create({
  baseURL: apiBaseUrl,
  timeout: 20000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Request interceptor — attach Bearer token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('brandsync_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor — handle 401 and extract meaningful error details
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('brandsync_token');
      localStorage.removeItem('brandsync_user');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    const message =
      error.response?.data?.message ||
      error.response?.data?.detail ||
      error.message ||
      'An unexpected communication error occurred';
    return Promise.reject(new Error(message));
  }
);

export default axiosInstance;
