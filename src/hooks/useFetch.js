// src/hooks/useFetch.js
import { useState, useEffect, useRef } from 'react';

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
        
        fetch(url, { signal: controller.signal })
            .then(res => {
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                return res.json();
            })
            .then(json => {
                setData(json);
                setLoading(false);
            })
            .catch(err => {
                if (err.name === 'AbortError') return; // cleanup, not an error
                setError(err.message);
                setLoading(false);
            });
            
        // Cleanup: cancel in-flight request on unmount or url change
        return () => controller.abort();
    }, [url]);

    return { data, loading, error };
}