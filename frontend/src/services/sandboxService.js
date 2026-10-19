import api from './api';

/**
 * Sandbox Service
 * Handles code execution via JDoodle and AI-driven code visualization/analysis.
 */

export const executeCode = async ({ language, code }) => {
  const response = await api.post('/api/sandbox/execute', {
    language,
    code,
  });
  return response.data;
};

export const visualizeCode = async ({ language, code }) => {
  const response = await api.post('/api/sandbox/visualize', {
    language,
    code,
  });
  return response.data;
};

export default {
  executeCode,
  visualizeCode,
};
