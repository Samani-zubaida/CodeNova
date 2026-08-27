import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      Authorization: \Bearer \\
    }
  };
};

export const updateGameScore = async (score) => {
  try {
    const response = await axios.post(\\/progress/update\, { score }, getAuthHeaders());
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
    const response = await axios.post(\\/progress/update\, payload, getAuthHeaders());
    return response.data;
  } catch (error) {
    console.error('Failed to unlock town', error);
    throw error;
  }
};
