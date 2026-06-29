/**
 * quiz.js
 * API functions for the quiz/game feature.
 * Uses the centralised apiClient so tokens and retries are handled automatically.
 */

import apiClient from '@/lib/apiClient.js';

/**
 * Save a completed quiz score to the backend.
 * @param {number} score
 * @param {object} user - Current user object from AuthContext.
 * @returns {Promise<{ success: boolean, data?: any, error?: string }>}
 */
export async function saveQuizScore(score, user) {
  try {
    const res = await apiClient.post('/games', { score, user });
    return { success: true, data: res.data };
  } catch (error) {
    const message =
      error?.response?.data?.error ??
      error?.response?.data?.message ??
      error?.message ??
      'Failed to save score.';
    return { success: false, error: message };
  }
}

/**
 * Fetch the global leaderboard and the current user's standing.
 * @param {object} user - Current user object from AuthContext.
 * @returns {Promise<{ success: boolean, data?: { top10: Array, currentUser: object|null }, error?: string }>}
 */
export async function fetchLeaderboard(user) {
  try {
    const username = user?.username ?? '';
    const res = await apiClient.get('/games/leaderboard', {
      params: { username },
    });
    return { success: true, data: res.data?.data ?? res.data };
  } catch (error) {
    const message =
      error?.response?.data?.error ??
      error?.response?.data?.message ??
      error?.message ??
      'Failed to fetch leaderboard.';
    return { success: false, error: message };
  }
}
