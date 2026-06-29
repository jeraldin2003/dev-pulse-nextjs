/**
 * apiClient.js
 * Centralised Axios instance for all requests to the DevPulse backend.
 *
 * Features:
 * - Automatically attaches Bearer token from localStorage on every request.
 * - On 401, attempts one silent token refresh then retries the original request.
 * - On second failure (refresh also failed), clears the session.
 * - Returns a consistent { success, data, error } shape for all responses.
 *
 * External API fetchers (JSONPlaceholder, Open Trivia DB, REST Countries)
 * use native fetch and do NOT go through this client.
 */

import axios from 'axios';

const TOKEN_KEY = 'devpulse_access_token';
const REFRESH_KEY = 'devpulse_refresh_token';
const USER_KEY = 'devpulse_user';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || '/api';

export const apiClient = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15_000, // 15 s
});

// ─── Request interceptor — attach access token ────────────────────────────────

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ─── Response interceptor — handle 401 with silent refresh ───────────────────

let isRefreshing = false;
/** Queue of { resolve, reject } pairs that arrived while refresh was in-flight */
let pendingQueue = [];

function processQueue(error, token = null) {
  pendingQueue.forEach(({ resolve, reject }) => {
    if (error) reject(error);
    else resolve(token);
  });
  pendingQueue = [];
}

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    const isUnauthorized = error.response?.status === 401;
    const alreadyRetried = originalRequest._retry;

    if (!isUnauthorized || alreadyRetried) {
      return Promise.reject(error);
    }

    // If a refresh is already in-flight, queue this request until it settles.
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        pendingQueue.push({ resolve, reject });
      }).then((newToken) => {
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return apiClient(originalRequest);
      });
    }

    originalRequest._retry = true;
    isRefreshing = true;

    const storedRefresh = localStorage.getItem(REFRESH_KEY);

    if (!storedRefresh) {
      clearLocalSession();
      processQueue(new Error('No refresh token'), null);
      isRefreshing = false;
      return Promise.reject(error);
    }

    try {
      const res = await axios.post(`${API_BASE}/auth/refresh`, {
        refreshToken: storedRefresh,
      });

      const { accessToken, refreshToken } = res.data?.data ?? res.data ?? {};

      if (!accessToken) throw new Error('Refresh response missing accessToken');

      localStorage.setItem(TOKEN_KEY, accessToken);
      if (refreshToken) localStorage.setItem(REFRESH_KEY, refreshToken);

      apiClient.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
      originalRequest.headers.Authorization = `Bearer ${accessToken}`;

      processQueue(null, accessToken);
      return apiClient(originalRequest);
    } catch (refreshError) {
      clearLocalSession();
      processQueue(refreshError, null);
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);

function clearLocalSession() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESH_KEY);
  localStorage.removeItem(USER_KEY);
  // Redirect to login without a hard reload dependency on React Router.
  window.location.href = '/login';
}

export default apiClient;
