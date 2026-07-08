/**
 * auth.js
 * Hardened API wrappers for /api/auth/* endpoints.
 * All functions return a consistent shape: { success: boolean, data?, error? }
 * Network errors, non-JSON responses, and non-ok statuses are all handled.
 */

const apiUrl = process.env.NEXT_PUBLIC_API_URL;
const API_BASE = apiUrl || '/api';

/**
 * Generic POST helper — centralises fetch + error handling for auth routes.
 * @param {string} path - Relative path (e.g. '/auth/login')
 * @param {object} body - JSON body to send.
 * @param {object} [extraHeaders] - Additional headers.
 * @returns {Promise<{ success: boolean, data?: any, error?: string }>}
 */
async function authPost(path, body, extraHeaders = {}) {
  try {
    const res = await fetch(`${API_BASE}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...extraHeaders },
      body: JSON.stringify(body),
    });

    let json;
    try {
      json = await res.json();
    } catch {
      return { success: false, error: `Server returned non-JSON response (${res.status})` };
    }

    if (!res.ok) {
      // Backend may send { error } or { message }
      return {
        success: false,
        error: json?.error ?? json?.message ?? `Request failed with status ${res.status}`,
      };
    }

    return json;
  } catch (err) {
    // Network-level error (offline, CORS, DNS)
    return { success: false, error: err?.message ?? 'Network error. Please try again.' };
  }
}

/** Sign in with username + password */
export async function apiLogin(username, password) {
  return authPost('/auth/login', { username, password });
}

/** Sign in with email + password */
export async function apiLoginByEmail(email, password) {
  return authPost('/auth/login', { email, password });
}

/** Send OTP to the given email (registration flow) */
export async function apiSendOtp(email) {
  return authPost('/auth/send-otp', { email });
}

/** Register a new user (requires OTP verification) */
export async function apiRegister(username, password, email, otp) {
  return authPost('/auth/register', { username, password, email, otp });
}

/** Initiate forgot-password flow — sends reset code to email */
export async function apiForgotPassword(email) {
  return authPost('/auth/forgot-password', { email });
}

/** Complete password reset with OTP + new password */
export async function apiResetPassword(email, otp, newPassword) {
  return authPost('/auth/reset-password', { email, otp, newPassword });
}

/** Invalidate a refresh token (server-side logout) */
export async function apiLogout(refreshToken) {
  return authPost('/auth/logout', { refreshToken });
}
