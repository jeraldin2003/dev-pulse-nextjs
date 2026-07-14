/**
 * chat.js
 * REST helpers for the chat feature (user directory, conversation list,
 * message history). Real-time delivery itself happens over Socket.IO —
 * see @/lib/socket.js — these are just for the initial page load / history.
 */

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? '';

function authHeaders() {
  const accessToken = localStorage.getItem('devpulse_access_token');
  return {
    'Content-Type': 'application/json',
    ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
  };
}

async function get(path) {
  try {
    const res = await fetch(`${API_BASE}${path}`, { headers: authHeaders() });
    const json = await res.json().catch(() => null);
    if (!res.ok) {
      return { success: false, error: json?.error ?? json?.message ?? `HTTP ${res.status}` };
    }
    return { success: true, data: json?.data ?? json };
  } catch (error) {
    return { success: false, error: error?.message ?? 'Network error.' };
  }
}

/** All other registered users — for starting a new chat. */
export async function fetchChatUsers() {
  return get('/chat/users');
}

/** Existing conversations, most recent first, with unread counts. */
export async function fetchConversations() {
  return get('/chat/conversations');
}

/** Full message history with a specific user (oldest first). */
export async function fetchMessageHistory(userId) {
  return get(`/chat/messages/${userId}`);
}
