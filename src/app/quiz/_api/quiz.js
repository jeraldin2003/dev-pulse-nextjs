/**
 * quiz.js
 * API functions for the quiz/game feature.
 * Uses plain fetch with the access token read from localStorage.
 */

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? '';

function authHeaders() {
  const accessToken = localStorage.getItem('devpulse_access_token');
  return {
    'Content-Type': 'application/json',
    ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
  };
}

/**
 * Save a completed quiz score to the backend.
 * @param {number} score
 * @param {object} user - Current user object from AuthContext.
 * @returns {Promise<{ success: boolean, data?: any, error?: string }>}
 */
export async function saveQuizScore(score, user) {
  try {
    const res = await fetch(`${API_BASE}/games`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify({ score, user }),
    });

    const json = await res.json().catch(() => null);

    if (!res.ok) {
      const message = json?.error ?? json?.message ?? `HTTP ${res.status}`;
      return { success: false, error: message };
    }

    return { success: true, data: json };
  } catch (error) {
    return { success: false, error: error?.message ?? 'Failed to save score.' };
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
    const url = new URL(`${API_BASE}/games/leaderboard`, window.location.origin);
    url.searchParams.set('username', username);

    const res = await fetch(url, {
      method: 'GET',
      headers: authHeaders(),
    });

    const json = await res.json().catch(() => null);

    if (!res.ok) {
      const message = json?.error ?? json?.message ?? `HTTP ${res.status}`;
      return { success: false, error: message };
    }

    return { success: true, data: json?.data ?? json };
  } catch (error) {
    return { success: false, error: error?.message ?? 'Failed to fetch leaderboard.' };
  }
}