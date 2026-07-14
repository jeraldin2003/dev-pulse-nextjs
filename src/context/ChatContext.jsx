"use client";
// src/context/ChatContext.jsx
/**
 * ChatContext.jsx
 * Cross-cutting chat state that needs to exist outside the chat page itself:
 *  - Connects/disconnects the shared Socket.IO connection in step with
 *    auth state (so we never hold a live socket for a logged-out user).
 *  - Tracks a running "unread messages" count for the sidebar badge, updated
 *    in real time as `message:new` events arrive for conversations the user
 *    isn't currently viewing.
 *
 * The chat page itself (and its hooks) pulls the socket via getSocket() and
 * manages the active conversation's messages/typing state independently —
 * this context only owns what's genuinely global.
 */
import { createContext, useContext, useEffect, useRef, useState, useCallback } from 'react';
import { useAuth } from './AuthContext.jsx';
import { getSocket, disconnectSocket } from '@/lib/socket.js';
import { SOCKET_EVENTS } from '@/lib/socketEvents.js';
import { fetchConversations } from '@/app/app/chat/_api/chat.js';

const ChatContext = createContext(null);

export function ChatProvider({ children }) {
  const { isAuthenticated, user } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);

  // Tracks which conversation (partner user id) is currently open on-screen,
  // so we don't count messages from that person as "unread".
  const activeConversationRef = useRef(null);

  const setActiveConversation = useCallback((partnerId) => {
    activeConversationRef.current = partnerId ?? null;
  }, []);

  // ─── Connect/disconnect the shared socket alongside auth state ──────────
  useEffect(() => {
    if (!isAuthenticated) {
      disconnectSocket();
      setUnreadCount(0);
      return;
    }

    const socket = getSocket();
    if (!socket) return;

    const handleNewMessage = (message) => {
      const isIncoming = message.recipientId === user?.id;
      const isFromOpenConversation = message.senderId === activeConversationRef.current;
      if (isIncoming && !isFromOpenConversation) {
        setUnreadCount((prev) => prev + 1);
      }
    };

    socket.on(SOCKET_EVENTS.MESSAGE_NEW, handleNewMessage);
    return () => socket.off(SOCKET_EVENTS.MESSAGE_NEW, handleNewMessage);
  }, [isAuthenticated, user?.id]);

  // ─── Seed the badge with unread counts already sitting in the DB ────────
  useEffect(() => {
    if (!isAuthenticated) return;

    let cancelled = false;
    (async () => {
      const result = await fetchConversations();
      if (!cancelled && result.success) {
        const total = result.data.reduce((sum, c) => sum + Number(c.unread_count || 0), 0);
        setUnreadCount(total);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [isAuthenticated]);

  /** Call when the user opens/reads a conversation, to zero out its share of the badge. */
  const clearUnreadFor = useCallback((partnerId, count) => {
    setUnreadCount((prev) => Math.max(0, prev - (count || 0)));
    if (partnerId !== undefined) setActiveConversation(partnerId);
  }, [setActiveConversation]);

  const value = {
    unreadCount,
    setActiveConversation,
    clearUnreadFor,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
}

export function useChat() {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error('useChat must be used inside <ChatProvider>');
  return ctx;
}
