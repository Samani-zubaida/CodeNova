/**
 * Legacy API facade re-exporting from centralized services.
 * Maintained for backward compatibility.
 */

export { API_URL, SOCKET_URL, getAuthHeaders } from '../services/api';
export { getAuthToken } from '../utils/tokenStorage';
export { updateGameScore, unlockTown } from '../services/progressService';

import { API_URL, SOCKET_URL, getAuthHeaders } from '../services/api';
import { getAuthToken } from '../utils/tokenStorage';
import { updateGameScore, unlockTown } from '../services/progressService';

export default {
  API_URL,
  SOCKET_URL,
  getAuthToken,
  getAuthHeaders,
  updateGameScore,
  unlockTown,
};
