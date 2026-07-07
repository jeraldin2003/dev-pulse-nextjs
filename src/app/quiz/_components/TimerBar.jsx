export function TimerBar({ timeLeft, total = 30 }) {
  const pct = (timeLeft / total) * 100;
  const color = pct > 60 ? 'bg-emerald-500' : pct > 30 ? 'bg-amber-500' : 'bg-rose-500';

  return (
    <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden mb-6">
      <div
        className={`h-full rounded-full ${color}`}
        style={{ width: `${pct}%` }}
        role="progressbar"
        aria-valuenow={timeLeft}
        aria-valuemin={0}
        aria-valuemax={total}
        aria-label={`${timeLeft} seconds remaining`}
      />
    </div>
  );
}
