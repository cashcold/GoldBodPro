import axios from 'axios';

const HEROKU_BACKEND_URL = 'https://goldbodpromain-30abe5f48993.herokuapp.com/api';

const getBaseURL = () => {
  const envUrl = import.meta.env.VITE_API_URL;
  if (envUrl && envUrl.trim() !== '') {
    return `${envUrl.trim().replace(/\/$/, '')}/api`;
  }
  
  // When running on Vercel, Netlify or external static hosts without local Express server
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    if (
      hostname.includes('vercel.app') ||
      hostname.includes('netlify.app') ||
      hostname.includes('github.io')
    ) {
      return HEROKU_BACKEND_URL;
    }
  }

  // Default to relative /api for local dev, AI Studio preview, and when served directly from Heroku
  return '/api';
};

const api = axios.create({
  baseURL: getBaseURL(),
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('goldbod_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor with automatic fallback
api.interceptors.response.use(
  (response) => {
    // If static hosting returned HTML index page instead of API JSON (e.g. 404 rewrite)
    if (
      typeof response.data === 'string' &&
      response.data.includes('<!doctype html>') &&
      response.config &&
      !response.config._retry
    ) {
      response.config._retry = true;
      response.config.baseURL = HEROKU_BACKEND_URL;
      return api(response.config);
    }
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    if (originalRequest && !originalRequest._retry) {
      originalRequest._retry = true;
      // If relative /api failed (e.g. static host without backend proxy), switch to Heroku URL
      if (!originalRequest.baseURL || originalRequest.baseURL === '/api') {
        originalRequest.baseURL = HEROKU_BACKEND_URL;
        return api(originalRequest);
      }
    }
    return Promise.reject(error);
  }
);

export default api;