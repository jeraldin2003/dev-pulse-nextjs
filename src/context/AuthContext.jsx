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
  apiRefreshToken,
  apiForgotPassword,
  apiResetPassword,
} from './auth.js';

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
  const [refreshToken, setRefreshToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Keep a ref to the latest refreshToken so callbacks don't stale-close over it.
  const refreshTokenRef = useRef(refreshToken);
  useEffect(() => {
    refreshTokenRef.current = refreshToken;
  }, [refreshToken]);

  // ─── Session helpers ─────────────────────────────────────────────────────

  const persistSession = useCallback((access, refresh, userData) => {
    localStorage.setItem(TOKEN_KEY, access);
    localStorage.setItem(REFRESH_KEY, refresh);
    localStorage.setItem(USER_KEY, JSON.stringify(userData));
    setAccessToken(access);
    setRefreshToken(refresh);
    setUser(userData);
  }, []);

  const clearSession = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_KEY);
    localStorage.removeItem(USER_KEY);
    setAccessToken(null);
    setRefreshToken(null);
    setUser(null);
  }, []);

  // ─── Token refresh ───────────────────────────────────────────────────────

  const refresh = useCallback(async () => {
    const currentRefresh = refreshTokenRef.current;
    if (!currentRefresh) return false;
    try {
      const result = await apiRefreshToken(currentRefresh);
      if (result.success) {
        localStorage.setItem(TOKEN_KEY, result.data.accessToken);
        localStorage.setItem(REFRESH_KEY, result.data.refreshToken);
        setAccessToken(result.data.accessToken);
        setRefreshToken(result.data.refreshToken);
        return true;
      }
      clearSession();
      return false;
    } catch {
      clearSession();
      return false;
    }
  }, [clearSession]);

  // ─── Restore session on mount ────────────────────────────────────────────

  useEffect(() => {
    async function restoreSession() {
      const storedAccess = localStorage.getItem(TOKEN_KEY);
      const storedRefresh = localStorage.getItem(REFRESH_KEY);
      const storedUser = localStorage.getItem(USER_KEY);

      if (!storedAccess || !storedRefresh || !storedUser) {
        setIsLoading(false);
        return;
      }

      let parsedUser;
      try {
        parsedUser = JSON.parse(storedUser);
      } catch {
        clearSession();
        setIsLoading(false);
        return;
      }

      // If the access token is still valid, restore immediately.
      if (!isJwtExpired(storedAccess)) {
        setAccessToken(storedAccess);
        setRefreshToken(storedRefresh);
        setUser(parsedUser);
        setIsLoading(false);
        return;
      }

      // Access token is expired — attempt a silent refresh before giving up.
      refreshTokenRef.current = storedRefresh;
      const result = await apiRefreshToken(storedRefresh);
      if (result.success) {
        localStorage.setItem(TOKEN_KEY, result.data.accessToken);
        localStorage.setItem(REFRESH_KEY, result.data.refreshToken);
        setAccessToken(result.data.accessToken);
        setRefreshToken(result.data.refreshToken);
        setUser(parsedUser);
      } else {
        clearSession();
      }

      setIsLoading(false);
    }

    restoreSession();
  }, [clearSession]);

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
    accessToken,
    refreshToken,
    isAuthenticated: !!accessToken && !!user,
    isLoading,
    login,
    loginByEmail,
    sendOtp,
    register,
    forgotPassword,
    resetPassword,
    logout,
    refresh,
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
