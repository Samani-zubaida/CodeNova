import api from './api';

/**
 * AI Service
 * Communicates with backend AI assistance and tutoring endpoints.
 */

export const getAIHint = async ({ questionText, options }) => {
  const response = await api.post('/api/ai/hint', {
    questionText,
    options: options || [],
  });
  return response.data;
};

export default {
  getAIHint,
};
