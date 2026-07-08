/**
 * useLeaderboard.js
 * Fetches and caches the quiz leaderboard with a 60-second TTL.
 */

import { useState, useCallback, useRef } from 'react';
import { useAuth } from '@/context/AuthContext.jsx';
import { fetchLeaderboard } from '../_api/quiz.js';

const CACHE_TTL_MS = 60_000;

export function useLeaderboard() {
  const { user } = useAuth();

  const [top10, setTop10] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const cacheRef = useRef(null); // { data: { top10, currentUser }, cachedAt }

  const fetchData = useCallback(
    async (forceRefresh) => {
      const cache = cacheRef.current;
      if (!forceRefresh && cache && Date.now() - cache.cachedAt < CACHE_TTL_MS) {
        setTop10(cache.data.top10);
        setCurrentUser(cache.data.currentUser);
        return;
      }

      setLoading(true);
      setError(null);

      const result = await fetchLeaderboard(user);

      if (result.success) {
        const data = { top10: result.data?.top10 ?? [], currentUser: result.data?.currentUser ?? null };
        cacheRef.current = { data, cachedAt: Date.now() };
        setTop10(data.top10);
        setCurrentUser(data.currentUser);
      } else {
        setError(result.error ?? 'Failed to load leaderboard.');
      }

      setLoading(false);
    },
    [user]
  );

  return {
    top10,
    currentUser,
    loading,
    error,
    load: useCallback(() => fetchData(false), [fetchData]),
    refresh: useCallback(() => fetchData(true), [fetchData]),
  };
}
