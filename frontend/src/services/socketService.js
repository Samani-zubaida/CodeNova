import { io } from 'socket.io-client';
import { SOCKET_URL } from './api';
import { getAuthToken } from '../utils/tokenStorage';

/**
 * Duel Socket Service
 * Manages Socket.IO connection for real-time multiplayer duels.
 */

export const createDuelSocket = (options = {}) => {
  const token = getAuthToken();
  return io(SOCKET_URL, {
    auth: token ? { token } : {},
    transports: ['websocket', 'polling'],
    ...options,
  });
};

export { SOCKET_URL };

export default {
  createDuelSocket,
  SOCKET_URL,
};
