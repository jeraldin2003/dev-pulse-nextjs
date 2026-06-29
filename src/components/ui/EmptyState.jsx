/**
 * EmptyState.jsx
 * Consistent empty-state card with icon, message, and optional action button.
 *
 * Props:
 *   icon    - LucideIcon component
 *   title   - Heading text
 *   message - Supporting description
 *   action  - Optional { label: string, onClick: () => void }
 */

export default function EmptyState({ icon: Icon, title, message, action }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 px-6 bg-white border border-slate-100 rounded-xl shadow-sm text-center dp-fade-in">
      {Icon && (
        <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-slate-50 text-slate-400 mb-1">
          <Icon size={28} strokeWidth={1.5} aria-hidden="true" />
        </div>
      )}
      <h3 className="text-base font-semibold text-slate-700 m-0">{title}</h3>
      {message && <p className="text-sm text-slate-400 max-w-xs m-0">{message}</p>}
      {action && (
        <button
          type="button"
          onClick={action.onClick}
          className="mt-2 px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition-colors duration-150 cursor-pointer shadow-sm"
        >
          {action.label}
        </button>
      )}
    </div>
  );
}
