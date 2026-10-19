import api from './api';

/**
 * Authentication Service
 * Handles user registration, login, logout, session restoration,
 * and email verification with the backend API.
 */

export const login = async ({ email, password }) => {
  const response = await api.post('/api/auth/login', {
    email: email.trim(),
    password,
  });
  return response.data;
};

export const register = async ({ username, email, password }) => {
  const response = await api.post('/api/auth/register', {
    username: username.trim(),
    email: email.trim(),
    password,
  });
  return response.data;
};

export const logout = async () => {
  try {
    const response = await api.post('/api/auth/logout');
    return response.data;
  } catch (error) {
    // If logout endpoint fails (e.g. token expired), treat as success locally
    return { success: true, message: 'Logged out locally' };
  }
};

export const getCurrentUser = async () => {
  const response = await api.get('/api/auth/me');
  return response.data;
};

export const verifyEmail = async (token) => {
  const response = await api.get(`/api/auth/verify-email?token=${encodeURIComponent(token)}`);
  return response.data;
};

export const resendVerification = async (email) => {
  const response = await api.post('/api/auth/resend-verification', {
    email: email.trim(),
  });
  return response.data;
};

export default {
  login,
  register,
  logout,
  getCurrentUser,
  verifyEmail,
  resendVerification,
};
