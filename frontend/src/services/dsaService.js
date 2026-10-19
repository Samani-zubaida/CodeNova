import api from './api';

/**
 * DSA & Levels Service
 * Handles data structures & algorithms subjects metadata and interactive level questions.
 */

export const getSubjectsMeta = async () => {
  const response = await api.get('/api/levels/meta/subjects');
  return response.data;
};

export const getLevelQuestions = async (subject, levelId) => {
  const response = await api.get(`/api/levels/${subject}/${levelId}`);
  return response.data;
};

export default {
  getSubjectsMeta,
  getLevelQuestions,
};
