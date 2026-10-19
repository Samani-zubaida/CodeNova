import axios from 'axios';
import { getAuthToken } from '../utils/tokenStorage';

const rawApiUrl = import.meta.env.VITE_API_URL;

if (!rawApiUrl && import.meta.env.PROD) {
  console.error(
    '[Code Nova] Warning: VITE_API_URL environment variable is missing in production. ' +
    'Please configure VITE_API_URL in your Vercel deployment settings.'
  );
}

// Development fallback to http://localhost:5000; in production use rawApiUrl or empty string
const resolvedUrl = rawApiUrl || (import.meta.env.DEV ? 'http://localhost:5000' : '');

// Strip trailing slashes and any trailing '/api' so paths never duplicate '/api'
export const API_URL = resolvedUrl.replace(/\/+$/, '').replace(/\/api$/, '');

// Socket.IO server origin
export const SOCKET_URL = API_URL;

/**
 * Common Authorization headers helper
 */
export const getAuthHeaders = () => {
  const token = getAuthToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

/**
 * Centralized Axios HTTP Client
 */
export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

// Automatic Bearer Token Request Interceptor
api.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) {
      config.headers = config.headers || {};
      if (!config.headers.Authorization) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Unified Error Response Interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Standardize error message extraction for consumers
    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      'Request failed';
    
    // Attach cleaned up message property
    if (error.response?.data && typeof error.response.data === 'object') {
      error.friendlyMessage = message;
    } else {
      error.friendlyMessage = message;
    }

    return Promise.reject(error);
  }
);

export default api;
