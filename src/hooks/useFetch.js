// src/hooks/useFetch.js
import { useState, useEffect, useRef } from 'react';
import { refreshAccessToken } from '../lib/auth';

export function useFetch(url) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const abortRef = useRef(null); // for cleanup

    useEffect(() => {
        if (!url) return;
        const controller = new AbortController();
        abortRef.current = controller;
        setLoading(true);
        setError(null);

        const doFetch = async (retried = false) => {
            const accessToken = localStorage.getItem('devpulse_access_token');

            try {
                const res = await fetch(url, {
                    signal: controller.signal,
                    headers: {
                        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
                    },
                });

                if (res.status === 403 && !retried) {
                    try {
                        await refreshAccessToken(); // stores new access token in localStorage
                        return doFetch(true); // retry once with the new token
                    } catch {
                        localStorage.removeItem('devpulse_access_token');
                        localStorage.removeItem('devpulse_refresh_token');
                        window.location.href = '/login';
                        return;
                    }
                }

                if (!res.ok) throw new Error(`HTTP ${res.status}`);

                const json = await res.json();
                setData(json);
                setLoading(false);
            } catch (err) {
                if (err.name === 'AbortError') return; // cleanup, not an error
                setError(err.message);
                setLoading(false);
            }
        };

        doFetch();

        return () => controller.abort();
    }, [url]);

    return { data, loading, error };
}