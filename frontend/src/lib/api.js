import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export const getAuthToken = () => {
  return localStorage.getItem('nova_token') || localStorage.getItem('token') || null;
};

export const getAuthHeaders = () => {
  const token = getAuthToken();
  return {
    headers: token ? { Authorization: `Bearer ${token}` } : {}
  };
};

// Global Axios Request Interceptor for automatic Bearer token injection
axios.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token && (!config.headers || !config.headers.Authorization)) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export const updateGameScore = async (score) => {
  try {
    const response = await axios.post(`${API_URL}/progress/update`, { score }, getAuthHeaders());
    return response.data;
  } catch (error) {
    console.error('Failed to update game score', error);
    throw error;
  }
};

export const unlockTown = async (townNumber) => {
  try {
    const payload = {};
    if (townNumber === 2) payload.town2Unlocked = true;
    if (townNumber === 3) payload.town3Unlocked = true;
    const response = await axios.post(`${API_URL}/progress/update`, payload, getAuthHeaders());
    return response.data;
  } catch (error) {
    console.error('Failed to unlock town', error);
    throw error;
  }
};

export default {
  getAuthToken,
  getAuthHeaders,
  updateGameScore,
  unlockTown
};
