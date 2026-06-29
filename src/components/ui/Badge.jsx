export default function Badge({ children, color }) {
  let colorClasses = 'bg-slate-100 text-slate-700';

  const c = color?.toLowerCase();
  if (c === '#3b82f6' || c === '#3b6cf4' || c === 'blue') {
    colorClasses =
      'bg-blue-50 text-blue-700 border border-blue-200/50 dark:bg-blue-950/40 dark:text-blue-400 dark:border-blue-900/30';
  } else if (c === '#8b5cf6' || c === 'violet') {
    colorClasses =
      'bg-violet-50 text-violet-700 border border-violet-200/50 dark:bg-violet-950/40 dark:text-violet-400 dark:border-violet-900/30';
  } else if (c === '#6366f1' || c === 'indigo') {
    colorClasses =
      'bg-indigo-50 text-indigo-700 border border-indigo-200/50 dark:bg-indigo-950/40 dark:text-indigo-400 dark:border-indigo-900/30';
  } else if (c === '#70ad47' || c === 'green' || c === '#22c55e') {
    colorClasses =
      'bg-emerald-50 text-emerald-700 border border-emerald-200/50 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-900/30';
  } else if (c === '#ffc000' || c === 'amber' || c === 'yellow') {
    colorClasses =
      'bg-amber-50 text-amber-700 border border-amber-200/50 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-900/30';
  } else if (c === '#ff6b6b' || c === 'red' || c === '#ef4444') {
    colorClasses =
      'bg-rose-50 text-rose-700 border border-rose-200/50 dark:bg-rose-950/40 dark:text-rose-400 dark:border-rose-900/30';
  }

  return (
    <span
      className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium leading-relaxed ${colorClasses}`}
    >
      {children}
    </span>
  );
}
