// src/lib/socket.js
/**
 * Singleton Socket.IO client for DevPulse live chat.
 * - One connection is shared across the whole app (chat page, unread badges, etc.).
 * - Connects with the current JWT access token; call `disconnectSocket()` on logout.
 * - The server URL is derived from NEXT_PUBLIC_API_URL by stripping a trailing
 *   `/api`, since Socket.IO attaches to the server root, not the REST prefix.
 */
import { io } from 'socket.io-client';

let socket = null;

function getSocketUrl() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? '';
  return apiUrl.replace(/\/api\/?$/, '');
}

/**
 * Returns the shared socket instance, creating (and connecting) it if needed.
 * Safe to call multiple times — reuses the existing connection.
 */
export function getSocket() {
  if (typeof window === 'undefined') return null;

  const accessToken = localStorage.getItem('devpulse_access_token');
  if (!accessToken) return null;

  if (socket && socket.connected) return socket;

  if (!socket) {
    socket = io(getSocketUrl(), {
      auth: { token: accessToken },
      autoConnect: true,
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 10,
      transports: ['websocket', 'polling'],
    });
  } else {
    // Existing socket, but disconnected (e.g. token rotated) — refresh auth and reconnect
    socket.auth = { token: accessToken };
    socket.connect();
  }

  return socket;
}

/** Disconnects and tears down the shared socket (call this on logout). */
export function disconnectSocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}
