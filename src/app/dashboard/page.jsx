/**
 * DashboardPage.jsx
 * Refactored to use useDashboardTab hook — pure rendering component.
 * Includes Countries tab (was missing), error banner, and skeleton loading.
 */
"use client";
import { useState } from 'react';
import { RefreshCw } from 'lucide-react';
import { TabBar, SkeletonCard } from '@/components/ui';
import { SkeletonStatGrid } from '@/components/ui/SkeletonCard';
import { useAuth } from '@/context/AuthContext'
import { redirect } from 'next/navigation';
import { ErrorBoundary } from '@/components/layout';
// SkeletonStatGrid does not exist in ui barrel
import {
    OverviewPanel,
    UsersPanel,
    PostsPanel,
    ProductivityPanel,
    TriviaPanel,
  } from '@/app/dashboard/_components';
const TABS = [
  { id: 'overview', label: 'Overview' },
  { id: 'users', label: 'Users' },
  { id: 'posts', label: 'Posts' },
  { id: 'productivity', label: 'Productivity' },
  { id: 'trivia', label: 'Trivia' },
];

function DashboardSkeleton() {
  return (
    <div className="flex flex-col gap-6 dp-fade-in">
      <SkeletonStatGrid count={4} />
      <SkeletonCard rows={5} />
    </div>
  );
}

function ActivePanel({ tabId }) {
  switch (tabId) {
    case 'overview':
      return (
        <ErrorBoundary>
          <OverviewPanel />
        </ErrorBoundary>
      );
    case 'users':
      return (
        <ErrorBoundary>
          <UsersPanel />
        </ErrorBoundary>
      );
    case 'posts':
      return (
        <ErrorBoundary>
          <PostsPanel />
        </ErrorBoundary>
      );
    case 'productivity':
      return (
        <ErrorBoundary>
          <ProductivityPanel />
        </ErrorBoundary>
      );
    case 'trivia':
      return (
        <ErrorBoundary>
          <TriviaPanel />
        </ErrorBoundary>
      );
    default:
      return null;
  }
}

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [refreshKey, setRefreshKey] = useState(0);
  const {isAuthenticated} = useAuth();  
  if(!isAuthenticated){
    redirect("/login")
  }

  const refresh = () => setRefreshKey(prev => prev + 1);

  return (
    <div className="flex flex-col min-h-screen pb-12">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Dashboard</h1>
        <button
          type="button"
          onClick={refresh}
          aria-label="Refresh current tab"
          className="inline-flex items-center gap-1.5 px-4 py-1.5 border border-slate-200 rounded-lg bg-white hover:bg-slate-50 text-slate-600 font-medium text-sm transition-colors duration-150 cursor-pointer"
        >
          <RefreshCw size={15} aria-hidden="true" />
          Refresh
        </button>
      </div>

      {/* Tab bar */}
      <TabBar tabs={TABS} activeTab={activeTab} onChange={setActiveTab} />

      {/* Panel */}
      <main
        id={`tabpanel-${activeTab}`}
        role="tabpanel"
        aria-labelledby={`tab-${activeTab}`}
        className="flex-1 mt-6 dp-fade-in"
      >
        <ActivePanel key={`${activeTab}-${refreshKey}`} tabId={activeTab} />
      </main>

      {/* Footer */}
      <footer className="flex items-center justify-center pt-6 mt-8 border-t border-slate-200 text-slate-400 text-xs">
        Ready
      </footer>
    </div>
  );
}
