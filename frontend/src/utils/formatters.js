/**
 * Pure formatting and transformation utilities for Code Nova.
 */

/**
 * Format duration in milliseconds to human-readable string (e.g. "2m 14s", "45s")
 */
export const formatDurationMs = (ms) => {
  if (!ms || ms <= 0) return '-';
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  if (minutes === 0) return `${seconds}s`;
  return `${minutes}m ${seconds}s`;
};

/**
 * Format an ISO date string to a localized short date (e.g. "May 15, 2024")
 */
export const formatDate = (dateString, options = { month: 'short', day: 'numeric', year: 'numeric' }) => {
  if (!dateString) return '';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return date.toLocaleDateString(undefined, options);
  } catch {
    return dateString;
  }
};

/**
 * Calculate countdown string between current time and target ISO timestamp
 */
export const calculateTimeLeft = (targetDate) => {
  if (!targetDate) return '';
  const diff = new Date(targetDate) - new Date();
  if (diff <= 0) return 'Starting now!';
  const m = Math.floor(diff / 60000);
  const s = Math.floor((diff % 60000) / 1000);
  return `${m}m ${s}s`;
};

/**
 * Normalize and extract readable error messages from Axios / Fetch errors
 */
export const extractErrorMessage = (error, fallbackMessage = 'An unexpected error occurred.') => {
  if (!error) return fallbackMessage;
  if (typeof error === 'string') return error;
  if (error.response?.data?.message) return error.response.data.message;
  if (error.response?.data?.error) return error.response.data.error;
  if (error.message) return error.message;
  return fallbackMessage;
};
