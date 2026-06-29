/**
 * useDashboardTab.js
 * Manages dashboard tab state including per-tab data caching.
 *
 * Cache TTL: 5 minutes — switching back to a recently loaded tab is instant.
 * Explicit Refresh button bypasses the cache and force-fetches fresh data.
 */
"use client";
import { useState, useCallback, useRef, useEffect } from 'react';
import {
  fetchOverviewData,
  fetchUsersData,
  fetchPostsData,
  fetchProductivityData,
  fetchTriviaData,
} from '@/app/dashboard/_api/DashboardData.js';

const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

const TAB_FETCHERS = {
  overview: fetchOverviewData,
  users: fetchUsersData,
  posts: fetchPostsData,
  productivity: fetchProductivityData,
  trivia: fetchTriviaData,
};

const DEFAULT_TAB_STATE = { loading: false, data: null, errors: {}, loadTime: 0 };

/**
 * @returns {{
 *   activeTab: string,
 *   tabState: { loading: boolean, data: any, errors: object, loadTime: number },
 *   switchTab: (tabId: string) => void,
 *   refresh: () => void,
 * }}
 */
export function useDashboardTab(initialTab = 'overview') {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [tabState, setTabState] = useState({ ...DEFAULT_TAB_STATE, loading: true });

  // Cache: { [tabId]: { data, errors, loadTime, cachedAt } }
  const cache = useRef({});

  const loadTab = useCallback(async (tabId, forceRefresh = false) => {
    const fetcher = TAB_FETCHERS[tabId];
    if (!fetcher) return;

    // Serve from cache if valid and not a forced refresh.
    const cached = cache.current[tabId];
    if (!forceRefresh && cached && Date.now() - cached.cachedAt < CACHE_TTL_MS) {
      setTabState({
        loading: false,
        data: cached.data,
        errors: cached.errors,
        loadTime: cached.loadTime,
      });
      return;
    }

    setTabState({ loading: true, data: null, errors: {}, loadTime: 0 });

    const result = await fetcher();

    const entry = {
      data: result.data,
      errors: result.errors,
      loadTime: result.loadTime,
      cachedAt: Date.now(),
    };

    cache.current[tabId] = entry;

    setTabState({
      loading: false,
      data: entry.data,
      errors: entry.errors,
      loadTime: entry.loadTime,
    });
  }, []);

  // Load the initial tab on mount.
  useEffect(() => {
    loadTab(initialTab);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const switchTab = useCallback(
    (tabId) => {
      setActiveTab(tabId);
      loadTab(tabId);
    },
    [loadTab]
  );

  const refresh = useCallback(() => {
    loadTab(activeTab, true); // bypass cache
  }, [activeTab, loadTab]);

  return { activeTab, tabState, switchTab, refresh };
}
