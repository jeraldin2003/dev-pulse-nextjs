/**
 * SkeletonCard.jsx
 * Shimmer skeleton placeholder for loading states.
 * Replaces generic spinner inside panel bodies.
 *
 * Props:
 *   rows    - Number of skeleton rows to render (default 4)
 *   compact - If true, renders smaller row heights
 */

export function SkeletonRow({ height = 'h-4', width = 'w-full' }) {
  return <div className={`dp-skeleton ${height} ${width} rounded-md`} aria-hidden="true" />;
}

export function SkeletonCard({ rows = 4, compact = false }) {
  return (
    <div
      className="bg-white border border-slate-100 rounded-xl p-5 shadow-sm flex flex-col gap-3"
      aria-busy="true"
      aria-label="Loading…"
    >
      {/* Header skeleton */}
      <SkeletonRow height={compact ? 'h-3' : 'h-4'} width="w-1/3" />
      {/* Body rows */}
      {Array.from({ length: rows }).map((_, i) => (
        <SkeletonRow
          key={i}
          height={compact ? 'h-3' : 'h-4'}
          width={i % 3 === 2 ? 'w-3/4' : 'w-full'}
        />
      ))}
    </div>
  );
}

/** Grid of skeleton stat-cards, matching the layout of real StatCards */
export function SkeletonStatGrid({ count = 4 }) {
  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-4 mb-6">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="flex items-start gap-3.5 p-4 bg-white rounded-lg shadow-sm border border-slate-100"
          aria-hidden="true"
        >
          <div className="dp-skeleton w-10 h-10 rounded-full shrink-0" />
          <div className="flex flex-col gap-2 flex-1">
            <div className="dp-skeleton h-3 w-1/2 rounded-md" />
            <div className="dp-skeleton h-6 w-3/4 rounded-md" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default SkeletonCard;
