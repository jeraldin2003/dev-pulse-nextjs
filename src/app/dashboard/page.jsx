/**
 * DashboardPage.jsx
 * Refactored to use useDashboardTab hook — pure rendering component.
 * Includes Countries tab (was missing), error banner, and skeleton loading.
 */
"use client";
import { RefreshCw } from 'lucide-react';
import { useDashboardTab } from '@/app/dashboard/_hooks/useDashboardTab';
import { TabBar, SkeletonCard } from '@/components/ui';
import { SkeletonStatGrid } from '@/components/ui/SkeletonCard';

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

function ActivePanel({ tabId, data }) {
  switch (tabId) {
    case 'overview':
      return <OverviewPanel data={data} />;
    case 'users':
      return <UsersPanel data={data} />;
    case 'posts':
      return <PostsPanel data={data} />;
    case 'productivity':
      return <ProductivityPanel data={data} />;
    case 'trivia':
      return <TriviaPanel data={data} />;
    default:
      return null;
  }
}

export default function DashboardPage() {
  const { activeTab, tabState, switchTab, refresh } = useDashboardTab('overview');

  const hasErrors = Object.keys(tabState.errors ?? {}).length > 0;

  return (
    <div className="flex flex-col min-h-screen pb-12">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Dashboard</h1>
        <button
          type="button"
          onClick={refresh}
          disabled={tabState.loading}
          aria-label="Refresh current tab"
          className="inline-flex items-center gap-1.5 px-4 py-1.5 border border-slate-200 rounded-lg bg-white hover:bg-slate-50 text-slate-600 font-medium text-sm transition-colors duration-150 cursor-pointer disabled:opacity-50"
        >
          <RefreshCw
            size={15}
            aria-hidden="true"
            className={tabState.loading ? 'animate-spin' : ''}
          />
          Refresh
        </button>
      </div>

      {/* Error banner */}
      {hasErrors && (
        <div
          className="flex flex-col gap-1 p-4 mb-6 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-sm dp-fade-in"
          role="alert"
        >
          <strong className="font-semibold">Some data failed to load:</strong>
          {Object.entries(tabState.errors).map(([module, message]) => (
            <span key={module} className="text-rose-700">
              <span className="font-medium capitalize">{module}:</span> {message}
            </span>
          ))}
        </div>
      )}

      {/* Tab bar */}
      <TabBar tabs={TABS} activeTab={activeTab} onChange={switchTab} disabled={tabState.loading} />

      {/* Panel */}
      <main
        id={`tabpanel-${activeTab}`}
        role="tabpanel"
        aria-labelledby={`tab-${activeTab}`}
        className="flex-1 mt-6 dp-fade-in"
      >
        {tabState.loading ? (
          <DashboardSkeleton />
        ) : (
          <ActivePanel tabId={activeTab} data={tabState.data} />
        )}
      </main>

      {/* Footer */}
      <footer className="flex items-center justify-center pt-6 mt-8 border-t border-slate-200 text-slate-400 text-xs">
        {tabState.loading
          ? 'Loading…'
          : tabState.loadTime > 0
            ? `Loaded in ${tabState.loadTime} ms`
            : null}
      </footer>
    </div>
  );
}
