/**
 * Centralized API & WebSocket Configuration
 * Code Nova Platform
 *
 * Re-exports API_URL and SOCKET_URL from centralized services/api.js
 * for backwards compatibility.
 */

export { API_URL, SOCKET_URL } from '../services/api';
import { API_URL, SOCKET_URL } from '../services/api';

export default {
  API_URL,
  SOCKET_URL,
};
