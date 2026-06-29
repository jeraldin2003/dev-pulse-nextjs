/**
 * useLeaderboard.js
 * Fetches and caches the quiz leaderboard with a 60-second TTL.
 */

import { useState, useCallback, useRef } from 'react';
import { useAuth } from '@/context/AuthContext.jsx';
import { fetchLeaderboard } from '../_api/quiz.js';

const CACHE_TTL_MS = 60_000; // 1 minute

/**
 * @returns {{
 *   top10:       Array,
 *   currentUser: object | null,
 *   loading:     boolean,
 *   error:       string | null,
 *   load:        () => Promise<void>,
 *   refresh:     () => Promise<void>,
 * }}
 */
export function useLeaderboard() {
  const { user } = useAuth();

  const [top10, setTop10] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const cacheRef = useRef(null); // { data: { top10, currentUser }, cachedAt }

  const fetchData = useCallback(
    async (forceRefresh = false) => {
      // Return cached data if still fresh
      if (
        !forceRefresh &&
        cacheRef.current &&
        Date.now() - cacheRef.current.cachedAt < CACHE_TTL_MS
      ) {
        const { top10: t, currentUser: cu } = cacheRef.current.data;
        setTop10(t);
        setCurrentUser(cu);
        return;
      }

      setLoading(true);
      setError(null);

      const result = await fetchLeaderboard(user);

      if (result.success) {
        const t = result.data?.top10 ?? [];
        const cu = result.data?.currentUser ?? null;

        cacheRef.current = { data: { top10: t, currentUser: cu }, cachedAt: Date.now() };
        setTop10(t);
        setCurrentUser(cu);
      } else {
        setError(result.error ?? 'Failed to load leaderboard.');
      }

      setLoading(false);
    },
    [user]
  );

  const load = useCallback(() => fetchData(false), [fetchData]);
  const refresh = useCallback(() => fetchData(true), [fetchData]);

  return { top10, currentUser, loading, error, load, refresh };
}
