/**
 * useApiCall.js
 * Generic hook for data fetching with consistent loading/error/data state.
 *
 * Usage:
 *   const { data, loading, error, refetch } = useApiCall(fetchSomething, [dep]);
 *
 * @param {Function} fetcher  - Async function that returns the data.
 * @param {Array}    [deps=[]] - Dependency array (re-fetches when deps change).
 * @param {object}  [options]
 * @param {boolean} [options.immediate=true] - Fetch on mount.
 */

import { useState, useEffect, useRef } from 'react';

export function useApiCall(fetcher, deps = [], { immediate = true } = {}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(immediate);
  const [error, setError] = useState(null);

  // Keep latest fetcher without causing re-renders
  const fetcherRef = useRef(fetcher);

  useEffect(() => {
    fetcherRef.current = fetcher;
  }, [fetcher]);

  // Track mount state to avoid updates after unmount
  const mountedRef = useRef(true);

  useEffect(() => {
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const execute = async () => {
    if (mountedRef.current) {
      setLoading(true);
      setError(null);
    }

    try {
      const result = await fetcherRef.current();

      if (mountedRef.current) {
        setData(result);
      }
    } catch (err) {
      if (mountedRef.current) {
        setError(err?.message ?? 'An unexpected error occurred.');
      }
    } finally {
      if (mountedRef.current) {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    if (!immediate) return;

    void execute();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return {
    data,
    loading,
    error,
    refetch: execute,
  };
}
