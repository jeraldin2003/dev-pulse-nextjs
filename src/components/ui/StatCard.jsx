/**
 * StatCard.jsx
 * Metric card with icon, label, value, optional sub-text, and optional trend badge.
 *
 * Props:
 *   icon      - LucideIcon component
 *   label     - Short descriptor (e.g. "Total Users")
 *   value     - Numeric or string value to display
 *   sub       - Optional supporting text below the value
 *   colorKey  - One of: 'blue' | 'violet' | 'green' | 'amber' | 'cyan' | 'rose'
 *   trend     - Optional { value: number, direction: 'up' | 'down' | 'neutral' }
 */

import { useTheme } from '@/context/ThemeContext.jsx';

const COLOR_MAP = {
  blue: {
    border: 'border-l-blue-500',
    lightBg: 'bg-blue-50',
    darkBg: 'bg-blue-950/40',
    lightText: 'text-blue-600',
    darkText: 'text-blue-400',
  },
  violet: {
    border: 'border-l-violet-500',
    lightBg: 'bg-violet-50',
    darkBg: 'bg-violet-950/40',
    lightText: 'text-violet-600',
    darkText: 'text-violet-400',
  },
  green: {
    border: 'border-l-emerald-500',
    lightBg: 'bg-emerald-50',
    darkBg: 'bg-emerald-950/40',
    lightText: 'text-emerald-600',
    darkText: 'text-emerald-400',
  },
  amber: {
    border: 'border-l-amber-500',
    lightBg: 'bg-amber-50',
    darkBg: 'bg-amber-950/40',
    lightText: 'text-amber-600',
    darkText: 'text-amber-400',
  },
  cyan: {
    border: 'border-l-cyan-500',
    lightBg: 'bg-cyan-50',
    darkBg: 'bg-cyan-950/40',
    lightText: 'text-cyan-600',
    darkText: 'text-cyan-400',
  },
  rose: {
    border: 'border-l-rose-500',
    lightBg: 'bg-rose-50',
    darkBg: 'bg-rose-950/40',
    lightText: 'text-rose-600',
    darkText: 'text-rose-400',
  },
};

const FALLBACK_COLOR = {
  border: 'border-l-slate-300 dark:border-l-slate-600',
  lightBg: 'bg-slate-50',
  darkBg: 'bg-slate-800/40',
  lightText: 'text-slate-500',
  darkText: 'text-slate-400',
};

const TREND_STYLES = {
  light: {
    up: 'bg-emerald-50 text-emerald-700',
    down: 'bg-rose-50 text-rose-700',
    neutral: 'bg-slate-100 text-slate-500',
  },
  dark: {
    up: 'bg-emerald-950/30 text-emerald-400',
    down: 'bg-rose-950/30 text-rose-400',
    neutral: 'bg-slate-850 text-slate-400',
  },
};

const TREND_ARROWS = { up: '↑', down: '↓', neutral: '→' };

export default function StatCard({ icon: Icon, label, value, sub, colorKey, trend }) {
  const { theme } = useTheme();
  const colors = COLOR_MAP[colorKey] ?? FALLBACK_COLOR;

  const bgClass = theme === 'light' ? colors.lightBg : colors.darkBg;
  const textClass = theme === 'light' ? colors.lightText : colors.darkText;

  return (
    <div
      className={`flex items-start gap-3.5 p-4 bg-white rounded-lg shadow-sm border border-slate-100 border-l-4 ${colors.border} dp-fade-in`}
    >
      {/* Icon circle */}
      <div
        className={`stat-card-icon-bg flex items-center justify-center w-10 h-10 rounded-full shrink-0 ${bgClass} ${textClass}`}
        aria-hidden="true"
      >
        <Icon size={21} />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium text-slate-500 mb-1 truncate">{label}</p>
        <p className="text-2xl font-bold text-slate-800 leading-tight dp-count-up">{value}</p>
        {sub && <p className="text-[11px] text-slate-400 mt-0.5">{sub}</p>}
      </div>

      {/* Trend badge */}
      {trend && (
        <span
          className={`shrink-0 inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[11px] font-semibold ${theme === 'light' ? (TREND_STYLES.light[trend.direction] ?? TREND_STYLES.light.neutral) : (TREND_STYLES.dark[trend.direction] ?? TREND_STYLES.dark.neutral)}`}
          aria-label={`Trend: ${trend.direction} ${trend.value}%`}
        >
          {TREND_ARROWS[trend.direction] ?? '→'} {trend.value}%
        </span>
      )}
    </div>
  );
}
