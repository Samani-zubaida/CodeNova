/**
 * Pure utility functions for accessing and manipulating authentication tokens
 * and cached user identities in localStorage.
 */

const TOKEN_KEY = 'nova_token';
const LEGACY_TOKEN_KEY = 'token';
const USER_KEY = 'nova_user';

export const getAuthToken = () => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(TOKEN_KEY) || localStorage.getItem(LEGACY_TOKEN_KEY) || null;
};

export const setAuthToken = (token) => {
  if (typeof window === 'undefined') return;
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(LEGACY_TOKEN_KEY, token); // backward compatibility
  } else {
    removeAuthToken();
  }
};

export const removeAuthToken = () => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(LEGACY_TOKEN_KEY);
};

export const getStoredUser = () => {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const setStoredUser = (user) => {
  if (typeof window === 'undefined') return;
  if (user) {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  } else {
    removeStoredUser();
  }
};

export const removeStoredUser = () => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(USER_KEY);
};

export const clearAuthStorage = () => {
  removeAuthToken();
  removeStoredUser();
};
