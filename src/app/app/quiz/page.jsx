/**
 * QuizPage.jsx
 * Manages Quiz / Leaderboard tabs.
 */
'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { RefreshCw } from 'lucide-react';
import { TabBar, SkeletonCard } from '@/components/ui';
import { useAuth } from '@/context/AuthContext';
import { useLeaderboard } from './_hooks/useLeaderboard.js';
import { QuizPanel, LeaderboardPanel } from './_components/index.js';

const TABS = [
  { id: 'quiz', label: 'Play Quiz' },
  { id: 'leaderboard', label: 'Leaderboard' },
];

export default function QuizPage() {
  const [tab, setTab] = useState('quiz');
  const { top10, currentUser, loading, error, load, refresh } = useLeaderboard();
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) router.push('/login');
  }, [isAuthenticated, router]);

  useEffect(() => {
    if (tab === 'leaderboard') load();
  }, [tab, load]);

  return (
    <div className="flex flex-col min-h-screen pb-12">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-slate-800">{tab === 'quiz' ? 'Trivia Quiz' : 'Leaderboard'}</h1>
        {tab === 'leaderboard' && (
          <button
            type="button"
            onClick={refresh}
            disabled={loading}
            className="flex items-center gap-1.5 px-4 py-1.5 border border-slate-200 rounded-lg text-slate-600 text-sm disabled:opacity-50"
          >
            <RefreshCw size={15} />
            {loading ? 'Refreshing…' : 'Refresh'}
          </button>
        )}
      </div>

      <TabBar tabs={TABS} activeTab={tab} onChange={setTab} />

      <main role="tabpanel" className="flex-1 mt-6">
        {tab === 'quiz' ? (
          <QuizPanel />
        ) : loading ? (
          <SkeletonCard rows={6} />
        ) : error ? (
          <p className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-sm">
            Failed to load leaderboard: {error}
          </p>
        ) : (
          <LeaderboardPanel top10={top10} currentUser={currentUser} />
        )}
      </main>

      <footer className="flex items-center justify-center pt-6 mt-8 border-t border-slate-200 text-slate-400 text-xs">
        DevPulse Trivia
      </footer>
    </div>
  );
}
