import api from './api';

/**
 * Competition Service
 * Handles hosted competitions, leaderboard rankings, test generation,
 * score submissions, and enrollment.
 */

export const getCompetitions = async () => {
  const response = await api.get('/api/dashboard/competitions');
  return response.data;
};

export const getGlobalLeaderboard = async () => {
  const response = await api.get('/api/dashboard/leaderboard');
  return response.data;
};

export const createCompetition = async ({ title, hostOrg, startTime, endTime, questions }) => {
  const response = await api.post('/api/competitions/create', {
    title,
    hostOrg,
    startTime,
    endTime,
    questions,
  });
  return response.data;
};

export const generateTests = async ({ description, solution }) => {
  const response = await api.post('/api/competitions/generate-tests', {
    description,
    solution,
  });
  return response.data;
};

export const getCompetitionLeaderboard = async (competitionId) => {
  const response = await api.get(`/api/competitions/${competitionId}/leaderboard`);
  return response.data;
};

export const enrollInCompetition = async (competitionId) => {
  const response = await api.post(`/api/competitions/${competitionId}/enroll`);
  return response.data;
};

export const submitCompetitionScore = async (competitionId, { score, timeTakenMs, username }) => {
  const response = await api.post(`/api/competitions/${competitionId}/submit-score`, {
    score,
    timeTakenMs,
    username,
  });
  return response.data;
};

export default {
  getCompetitions,
  getGlobalLeaderboard,
  createCompetition,
  generateTests,
  getCompetitionLeaderboard,
  enrollInCompetition,
  submitCompetitionScore,
};
