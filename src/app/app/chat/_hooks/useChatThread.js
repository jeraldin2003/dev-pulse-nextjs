// src/app/app/chat/_hooks/useChatThread.js
"use client";
/**
 * useChatThread
 * Owns everything about ONE open conversation: loading history over REST,
 * receiving/sending messages over the socket, typing indicator state, and
 * read receipts. Deliberately separate from useContacts (the sidebar list)
 * so each hook has a single, clear responsibility.
 */
import { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '@/context/AuthContext.jsx';
import { getSocket } from '@/lib/socket.js';
import { SOCKET_EVENTS } from '@/lib/socketEvents.js';
import { fetchMessageHistory } from '../_api/chat.js';

const TYPING_STOP_DELAY_MS = 2000;

/** Inserts/updates a message by id and keeps the list sorted by id (= chronological). */
function upsertMessage(messages, incoming) {
  const withoutDuplicate = messages.filter((m) => m.id !== incoming.id);
  return [...withoutDuplicate, incoming].sort((a, b) => a.id - b.id);
}

export function useChatThread(partnerId) {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sending, setSending] = useState(false);
  const [partnerIsTyping, setPartnerIsTyping] = useState(false);
  const [partnerLastReadAt, setPartnerLastReadAt] = useState(null);

  const typingStopTimeoutRef = useRef(null);
  const isTypingSentRef = useRef(false);

  // ─── Load history whenever the open conversation changes ────────────────
  useEffect(() => {
    if (!partnerId) {
      setMessages([]);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);

    (async () => {
      const result = await fetchMessageHistory(partnerId);
      if (cancelled) return;

      if (!result.success) {
        setError(result.error);
      } else {
        setMessages(
          result.data.map((m) => ({
            id: m.id,
            senderId: m.sender_id,
            recipientId: m.recipient_id,
            body: m.body,
            createdAt: m.created_at,
            readAt: m.read_at,
          }))
        );
      }
      setLoading(false);
    })();

    return () => {
      cancelled = true;
    };
  }, [partnerId]);

  // ─── Live updates: new messages, typing, read receipts ──────────────────
  useEffect(() => {
    if (!partnerId) return;
    const socket = getSocket();
    if (!socket) return;

    const belongsToThisThread = (message) =>
      message.senderId === partnerId || message.recipientId === partnerId;

    const handleNewMessage = (message) => {
      if (!belongsToThisThread(message)) return;
      setMessages((prev) => upsertMessage(prev, message));
    };

    const handleTyping = ({ userId, isTyping }) => {
      if (userId !== partnerId) return;
      setPartnerIsTyping(isTyping);
    };

    const handleRead = ({ readerId }) => {
      if (readerId !== partnerId) return;
      setPartnerLastReadAt(new Date().toISOString());
    };

    socket.on(SOCKET_EVENTS.MESSAGE_NEW, handleNewMessage);
    socket.on(SOCKET_EVENTS.TYPING_UPDATE, handleTyping);
    socket.on(SOCKET_EVENTS.MESSAGE_READ, handleRead);

    // Let the partner know we've now seen their messages
    socket.emit(SOCKET_EVENTS.MESSAGE_READ, { partnerId });

    return () => {
      socket.off(SOCKET_EVENTS.MESSAGE_NEW, handleNewMessage);
      socket.off(SOCKET_EVENTS.TYPING_UPDATE, handleTyping);
      socket.off(SOCKET_EVENTS.MESSAGE_READ, handleRead);
    };
  }, [partnerId]);

  // ─── Sending ──────────────────────────────────────────────────────────
  const sendMessage = useCallback(
    (body) => {
      const trimmed = body.trim();
      if (!trimmed || !partnerId) return Promise.resolve({ success: false, error: 'Nothing to send' });

      const socket = getSocket();
      if (!socket) return Promise.resolve({ success: false, error: 'Not connected' });

      setSending(true);
      return new Promise((resolve) => {
        socket.emit(
          SOCKET_EVENTS.MESSAGE_SEND,
          { recipientId: partnerId, body: trimmed },
          (response) => {
            setSending(false);
            if (response?.success) {
              setMessages((prev) => upsertMessage(prev, response.data));
            }
            resolve(response);
          }
        );
      });
    },
    [partnerId]
  );

  // ─── Typing indicator (debounced stop) ──────────────────────────────────
  const notifyTyping = useCallback(() => {
    if (!partnerId) return;
    const socket = getSocket();
    if (!socket) return;

    if (!isTypingSentRef.current) {
      isTypingSentRef.current = true;
      socket.emit(SOCKET_EVENTS.TYPING_START, { recipientId: partnerId });
    }

    clearTimeout(typingStopTimeoutRef.current);
    typingStopTimeoutRef.current = setTimeout(() => {
      isTypingSentRef.current = false;
      socket.emit(SOCKET_EVENTS.TYPING_STOP, { recipientId: partnerId });
    }, TYPING_STOP_DELAY_MS);
  }, [partnerId]);

  // Clean up the typing timer + tell the partner we stopped, on unmount/thread switch
  useEffect(() => {
    return () => {
      clearTimeout(typingStopTimeoutRef.current);
      if (isTypingSentRef.current && partnerId) {
        getSocket()?.emit(SOCKET_EVENTS.TYPING_STOP, { recipientId: partnerId });
        isTypingSentRef.current = false;
      }
    };
  }, [partnerId]);

  return {
    messages,
    loading,
    error,
    sending,
    sendMessage,
    notifyTyping,
    partnerIsTyping,
    partnerLastReadAt,
    currentUserId: user?.id,
  };
}
