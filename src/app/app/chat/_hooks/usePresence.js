// src/app/app/chat/_hooks/usePresence.js
"use client";
/**
 * usePresence
 * Tracks the set of currently-online user ids, seeded from `presence:list`
 * on connect and kept live via `presence:update`.
 */
import { useState, useEffect } from 'react';
import { getSocket } from '@/lib/socket.js';
import { SOCKET_EVENTS } from '@/lib/socketEvents.js';

export function usePresence() {
  const [onlineUserIds, setOnlineUserIds] = useState(() => new Set());

  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    const handleList = (ids) => setOnlineUserIds(new Set(ids));

    const handleUpdate = ({ userId, online }) => {
      setOnlineUserIds((prev) => {
        const next = new Set(prev);
        if (online) next.add(userId);
        else next.delete(userId);
        return next;
      });
    };

    socket.on(SOCKET_EVENTS.PRESENCE_LIST, handleList);
    socket.on(SOCKET_EVENTS.PRESENCE_UPDATE, handleUpdate);

    return () => {
      socket.off(SOCKET_EVENTS.PRESENCE_LIST, handleList);
      socket.off(SOCKET_EVENTS.PRESENCE_UPDATE, handleUpdate);
    };
  }, []);

  return onlineUserIds;
}
