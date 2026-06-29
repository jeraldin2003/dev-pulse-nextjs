/**
 * TabBar.jsx
 * Reusable tab navigation bar used by DashboardPage and QuizPage.
 *
 * Props:
 *   tabs      - Array<{ id: string, label: string, icon?: LucideIcon }>
 *   activeTab - Currently active tab id
 *   onChange  - (tabId: string) => void
 *   disabled  - Optional: disable all tabs (e.g. while loading)
 */

import { useTheme } from '@/context/ThemeContext.jsx';

export default function TabBar({ tabs, activeTab, onChange, disabled = false }) {
  const { theme } = useTheme();
  return (
    <nav
      className="flex flex-wrap gap-1.5 p-1 bg-slate-100 rounded-xl border border-slate-200/60"
      aria-label="Tab navigation"
      role="tablist"
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        const Icon = tab.icon ?? null;
        return (
          <button
            key={tab.id}
            id={`tab-${tab.id}`}
            type="button"
            role="tab"
            aria-selected={isActive}
            aria-controls={`tabpanel-${tab.id}`}
            disabled={disabled}
            onClick={() => onChange(tab.id)}
            className={[
              'flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-150 cursor-pointer select-none',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              isActive
                ? theme === 'light'
                  ? 'bg-blue-100 text-blue-800 shadow-sm ring-1 ring-blue-200/60'
                  : 'bg-slate-800 text-blue-400 shadow-sm ring-1 ring-slate-700/60'
                : theme === 'light'
                  ? 'text-slate-500 hover:text-slate-800 hover:bg-slate-200/60'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60',
            ].join(' ')}
          >
            {Icon && <Icon size={15} aria-hidden="true" />}
            {tab.label}
          </button>
        );
      })}
    </nav>
  );
}
