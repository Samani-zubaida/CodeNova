import api from './api';

/**
 * Progress Service
 * Handles user game progression, scores, and town unlock statuses.
 */

export const getProgress = async () => {
  const response = await api.get('/api/progress');
  return response.data;
};

export const updateProgress = async (payload) => {
  const response = await api.post('/api/progress/update', payload);
  return response.data;
};

export const updateGameScore = async (score) => {
  return updateProgress({ score });
};

export const unlockTown = async (townNumber) => {
  const payload = {};
  if (townNumber === 2) payload.town2Unlocked = true;
  if (townNumber === 3) payload.town3Unlocked = true;
  return updateProgress(payload);
};

export default {
  getProgress,
  updateProgress,
  updateGameScore,
  unlockTown,
};
