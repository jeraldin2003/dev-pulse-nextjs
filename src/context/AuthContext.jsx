/* eslint-disable react-refresh/only-export-components */

/**
 * AuthContext.jsx
 * Provides authentication state and operations to the entire app.
 *
 * Key behaviours:
 * - Session is persisted to localStorage (access token, refresh token, user).
 * - On mount, the stored JWT expiry (`exp` claim) is checked. If expired, a
 *   silent token refresh is attempted before falling back to logout.
 * - All auth operations return { success, data?, error? } — never throw.
 */
"use client";
import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import {
  apiLogin,
  apiLoginByEmail,
  apiRegister,
  apiSendOtp,
  apiLogout,
  apiForgotPassword,
  apiResetPassword,
} from './auth.js';

import {refreshAccessToken} from '@/lib/auth.js';
const AuthContext = createContext(null);

const TOKEN_KEY = 'devpulse_access_token';
const REFRESH_KEY = 'devpulse_refresh_token';
const USER_KEY = 'devpulse_user';

// ─── JWT helpers ─────────────────────────────────────────────────────────────

/**
 * Decode a JWT payload without verifying the signature.
 * @param {string} token
 * @returns {object|null}
 */
function decodeJwtPayload(token) {
  try {
    const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    const json = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + c.charCodeAt(0).toString(16).padStart(2, '0'))
        .join('')
    );
    return JSON.parse(json);
  } catch {
    return null;
  }
}

/**
 * Returns true if the JWT is expired (or invalid / missing).
 * Gives a 30-second buffer to account for clock skew.
 */
function isJwtExpired(token) {
  if (!token) return true;
  const payload = decodeJwtPayload(token);
  if (!payload?.exp) return true;
  return payload.exp * 1000 < Date.now() + 30_000;
}

// ─── Provider ─────────────────────────────────────────────────────────────────
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);

  // Refresh token is only ever needed inside callbacks (restore/logout), never
  // rendered — a ref avoids an extra state slot and its sync effect.
  const refreshTokenRef = useRef(null);

  // ─── Session helpers ─────────────────────────────────────────────────────

  const persistSession = useCallback((access, refresh, userData) => {
    localStorage.setItem(TOKEN_KEY, access);
    localStorage.setItem(REFRESH_KEY, refresh);
    localStorage.setItem(USER_KEY, JSON.stringify(userData));
    refreshTokenRef.current = refresh;
    setAccessToken(access);
    setUser(userData);
  }, []);

  const clearSession = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_KEY);
    localStorage.removeItem(USER_KEY);
    refreshTokenRef.current = null;
    setAccessToken(null);
    setUser(null);
  }, []);

  // ─── Restore session on mount ────────────────────────────────────────────

  useEffect(() => {
    async function restoreSession() {
      const storedAccess = localStorage.getItem(TOKEN_KEY);
      const storedRefresh = localStorage.getItem(REFRESH_KEY);
      const storedUser = localStorage.getItem(USER_KEY);

      if (!storedAccess || !storedRefresh || !storedUser) return;

      let parsedUser;
      try {
        parsedUser = JSON.parse(storedUser);
      } catch {
        clearSession();
        return;
      }

      // If the access token is still valid, restore immediately.
      if (!isJwtExpired(storedAccess)) {
        refreshTokenRef.current = storedRefresh;
        setAccessToken(storedAccess);
        setUser(parsedUser);
        return;
      }

      // Access token is expired — attempt a silent refresh before giving up.
      const result = await refreshAccessToken();
      if (result.success) {
        persistSession(result.data.accessToken, result.data.refreshToken, parsedUser);
      } else {
        clearSession();
      }
    }

    restoreSession();
  }, [clearSession, persistSession]);

  // ─── Auth operations ─────────────────────────────────────────────────────

  const login = useCallback(
    async (username, password) => {
      const result = await apiLogin(username, password);
      if (result.success) {
        persistSession(result.data.accessToken, result.data.refreshToken, result.data.user);
      }
      return result;
    },
    [persistSession]
  );

  const loginByEmail = useCallback(
    async (email, password) => {
      const result = await apiLoginByEmail(email, password);
      if (result.success) {
        persistSession(result.data.accessToken, result.data.refreshToken, result.data.user);
      }
      return result;
    },
    [persistSession]
  );

  const sendOtp = useCallback(async (email) => {
    return apiSendOtp(email);
  }, []);

  const register = useCallback(async (username, password, email, otp) => {
    return apiRegister(username, password, email, otp);
  }, []);

  const forgotPassword = useCallback(async (email) => {
    return apiForgotPassword(email);
  }, []);

  const resetPassword = useCallback(async (email, otp, newPassword) => {
    return apiResetPassword(email, otp, newPassword);
  }, []);

  const logout = useCallback(async () => {
    const currentRefresh = refreshTokenRef.current;
    if (currentRefresh) {
      // Best-effort server-side invalidation — don't block local logout on failure.
      apiLogout(currentRefresh).catch(() => {});
    }
    clearSession();
  }, [clearSession]);

  // ─── Context value ───────────────────────────────────────────────────────

  const value = {
    user,
    isAuthenticated: !!accessToken && !!user,
    login,
    loginByEmail,
    sendOtp,
    register,
    forgotPassword,
    resetPassword,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
