import api from './api';

/**
 * User Service
 * Handles user profiles, gamification streaks, activity recording, and badges.
 */

export const recordActivity = async (username) => {
  const response = await api.post('/api/users/record-activity', {
    username,
  });
  return response.data;
};

export const getUserProfile = async (username) => {
  const response = await api.get(`/api/users/${encodeURIComponent(username)}`);
  return response.data;
};

export const awardBadge = async ({ badgeId, badgeName, username }) => {
  const response = await api.post('/api/users/award-badge', {
    badgeId,
    badgeName,
    username,
  });
  return response.data;
};

export const sendNotification = async ({ title, message, actionUrl, actionText, username }) => {
  const response = await api.post('/api/users/notify', {
    title,
    message,
    actionUrl,
    actionText,
    username,
  });
  return response.data;
};

export default {
  recordActivity,
  getUserProfile,
  awardBadge,
  sendNotification,
};
