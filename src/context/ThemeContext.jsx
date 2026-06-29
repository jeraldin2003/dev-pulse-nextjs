"use client";
// src/context/ThemeContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';

// 1a. Create the context (default value used only outside a Provider)
const ThemeContext = createContext(null);

// 1b. Provider — wraps the app, holds the state
export function ThemeProvider({ children }) {
    const [theme, setTheme] = useState(() => {
        // Load initial theme from localStorage or fallback to 'light'
        if (typeof window !== 'undefined') {
            return localStorage.getItem('theme') || 'light';
        }
        return 'light';
    });

    useEffect(() => {
        const root = window.document.documentElement;
        if (theme === 'dark') {
            root.classList.add('dark');
            root.setAttribute('data-theme', 'dark');
        } else {
            root.classList.remove('dark');
            root.setAttribute('data-theme', 'light');
        }
        localStorage.setItem('theme', theme);
    }, [theme]);

    const toggleTheme = () =>
        setTheme(prev => (prev === 'light' ? 'dark' : 'light'));

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

// 1c. Custom hook — encapsulates the useContext call
export function useTheme() {
    const ctx = useContext(ThemeContext);
    if (!ctx) throw new Error('useTheme must be used inside <ThemeProvider>');
    return ctx;
}