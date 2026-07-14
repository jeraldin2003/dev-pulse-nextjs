// src/lib/socketEvents.js
/**
 * Canonical Socket.IO event names for the chat feature.
 * Mirrored on the backend at src/socket/events.js — keep both in sync.
 */
export const SOCKET_EVENTS = {
  // Presence
  PRESENCE_LIST: 'presence:list',
  PRESENCE_UPDATE: 'presence:update',

  // Messaging
  MESSAGE_SEND: 'message:send',
  MESSAGE_NEW: 'message:new',
  MESSAGE_READ: 'message:read',

  // Typing indicator
  TYPING_START: 'typing:start',
  TYPING_STOP: 'typing:stop',
  TYPING_UPDATE: 'typing:update',
};
