/**
 * QuizPage.jsx
 * Manages Quiz / Leaderboard tabs.
 * Uses useLeaderboard hook — no local fetching logic.
 */
"use client";
import { useEffect } from 'react';
import { RefreshCw } from 'lucide-react';
import { useState } from 'react';
import { TabBar } from '@/components/ui';
import { QuizPanel } from './_components';
import { LeaderboardPanel } from './_components';
import { SkeletonCard } from '@/components/ui';
import { useLeaderboard } from './_hooks/useLeaderboard.js';

const TABS = [
  { id: 'quiz', label: 'Play Quiz' },
  { id: 'leaderboard', label: 'Leaderboard' },
];

export default function QuizPage() {
  const [activeTab, setActiveTab] = useState('quiz');
  const { top10, currentUser, loading, error, load, refresh } = useLeaderboard();

  // Load leaderboard when switching to that tab
  useEffect(() => {
    if (activeTab === 'leaderboard') load();
  }, [activeTab, load]);

  const handleTabChange = (tabId) => setActiveTab(tabId);

  function renderContent() {
    if (activeTab === 'quiz') return <QuizPanel />;

    if (loading) return <SkeletonCard rows={6} />;

    if (error) {
      return (
        <div
          className="p-4 bg-rose-50 border border-rose-200 dark:bg-rose-950/20 dark:border-rose-900/30 dark:text-rose-450 rounded-xl text-rose-800 text-sm dp-fade-in"
          role="alert"
        >
          <strong className="font-semibold block mb-1">Failed to load leaderboard</strong>
          {error}
        </div>
      );
    }

    return <LeaderboardPanel top10={top10} currentUser={currentUser} />;
  }

  return (
    <div className="flex flex-col min-h-screen pb-12">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
          {activeTab === 'quiz' ? 'Trivia Quiz' : 'Leaderboard'}
        </h1>
        {activeTab === 'leaderboard' && (
          <button
            type="button"
            onClick={refresh}
            disabled={loading}
            aria-label="Refresh leaderboard"
            className="inline-flex items-center gap-1.5 px-4 py-1.5 border border-slate-200 rounded-lg bg-white hover:bg-slate-50 text-slate-600 font-medium text-sm transition-colors duration-150 cursor-pointer disabled:opacity-50"
          >
            <RefreshCw size={15} aria-hidden="true" className={loading ? 'animate-spin' : ''} />
            Refresh
          </button>
        )}
      </div>

      {/* Tabs */}
      <TabBar tabs={TABS} activeTab={activeTab} onChange={handleTabChange} />

      {/* Panel */}
      <main
        id={`tabpanel-${activeTab}`}
        role="tabpanel"
        aria-labelledby={`tab-${activeTab}`}
        className="flex-1 mt-6 dp-fade-in"
      >
        {renderContent()}
      </main>

      <footer className="flex items-center justify-center pt-6 mt-8 border-t border-slate-200 text-slate-400 text-xs">
        DevPulse Trivia
      </footer>
    </div>
  );
}
