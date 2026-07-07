// src/lib/auth.js

let refreshPromise = null; // dedupe concurrent refresh calls

export async function refreshAccessToken() {
    // If a refresh is already in-flight, reuse it instead of firing multiple requests
    if (refreshPromise) return refreshPromise;

    const refreshToken = localStorage.getItem('devpulse_refresh_token');
    if (!refreshToken) {
        throw new Error('No refresh token available');
    }

    refreshPromise = fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken }),
    })
        .then(async (res) => {
            if (!res.ok) {
                // Refresh token itself is invalid/expired -> caller should force logout
                throw new Error('Session expired, please log in again');
            }
            const data = await res.json();
            localStorage.setItem('devpulse_access_token', data?.data?.accessToken);
            if (data?.data?.refreshToken) {
                // In case the backend rotates refresh tokens on each use
                localStorage.setItem('devpulse_refresh_token', data?.data?.refreshToken);
            }
            return data?.data?.accessToken;
        })
        .finally(() => {
            refreshPromise = null; // clear so future calls can trigger a new refresh
        });

    return refreshPromise;
}