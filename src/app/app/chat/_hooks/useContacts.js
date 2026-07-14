// src/app/app/chat/_hooks/useContacts.js
"use client";
/**
 * useContacts
 * Combines "everyone you could message" (fetchChatUsers) with "conversations
 * you already have" (fetchConversations) into one list, and keeps it live:
 * an incoming/outgoing message reorders the conversation to the top and
 * bumps its unread count in real time, without a manual refetch.
 */
import { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '@/context/AuthContext.jsx';
import { getSocket } from '@/lib/socket.js';
import { SOCKET_EVENTS } from '@/lib/socketEvents.js';
import { fetchChatUsers, fetchConversations } from '../_api/chat.js';

export function useContacts() {
  const { user } = useAuth();
  const [allUsers, setAllUsers] = useState([]);
  const [conversations, setConversations] = useState([]); // keyed list, most-recent first
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Mirrors `conversations` state in a ref so the socket listener (registered
  // once) always reads the latest value instead of a stale closure.
  const conversationsRef = useRef(conversations);
  conversationsRef.current = conversations;

  const activePartnerRef = useRef(null);
  const setActivePartnerId = useCallback((id) => {
    activePartnerRef.current = id ?? null;
  }, []);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);

    const [usersResult, conversationsResult] = await Promise.all([
      fetchChatUsers(),
      fetchConversations(),
    ]);

    if (!usersResult.success) {
      setError(usersResult.error);
      setLoading(false);
      return;
    }

    setAllUsers(usersResult.data);
    setConversations(conversationsResult.success ? conversationsResult.data : []);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  // ─── Keep the conversation list live ────────────────────────────────────
  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    const handleNewMessage = (message) => {
      const partnerId = message.senderId === user?.id ? message.recipientId : message.senderId;
      const isActiveThread = partnerId === activePartnerRef.current;
      const isIncoming = message.recipientId === user?.id;

      setConversations((prev) => {
        const existing = prev.find((c) => c.partner_id === partnerId);
        const partnerUsername =
          existing?.partner_username ??
          (message.senderId === user?.id ? existing?.partner_username : message.senderUsername);

        const updated = {
          partner_id: partnerId,
          partner_username: partnerUsername ?? existing?.partner_username,
          last_message: message.body,
          last_message_sender_id: message.senderId,
          last_message_at: message.createdAt,
          unread_count: isIncoming && !isActiveThread ? (Number(existing?.unread_count) || 0) + 1 : 0,
        };

        const withoutPartner = prev.filter((c) => c.partner_id !== partnerId);
        return [updated, ...withoutPartner];
      });
    };

    socket.on(SOCKET_EVENTS.MESSAGE_NEW, handleNewMessage);
    return () => socket.off(SOCKET_EVENTS.MESSAGE_NEW, handleNewMessage);
  }, [user?.id]);

  /** Users who don't yet have a conversation thread — for "start a new chat". */
  const conversationPartnerIds = new Set(conversations.map((c) => c.partner_id));
  const usersWithoutConversation = allUsers.filter((u) => !conversationPartnerIds.has(u.id));

  const clearUnread = useCallback((partnerId) => {
    setConversations((prev) =>
      prev.map((c) => (c.partner_id === partnerId ? { ...c, unread_count: 0 } : c))
    );
  }, []);

  return {
    conversations,
    usersWithoutConversation,
    loading,
    error,
    reload: load,
    setActivePartnerId,
    clearUnread,
  };
}
