export function FinishedScreen({ score, total, onReset }) {
  const percentage = Math.round((score / total) * 100);
  const grade =
    percentage >= 80
      ? { emoji: '🏆', label: 'Excellent!', color: 'text-amber-500' }
      : percentage >= 60
        ? { emoji: '🎯', label: 'Good job!', color: 'text-blue-500' }
        : percentage >= 40
          ? { emoji: '📚', label: 'Keep learning!', color: 'text-violet-500' }
          : { emoji: '💪', label: 'Try again!', color: 'text-slate-500' };

  return (
    <div className="flex flex-col items-center justify-center p-12 bg-white border border-slate-200 rounded-2xl shadow-sm max-w-md mx-auto dp-fade-in">
      <div className="text-5xl mb-4">{grade.emoji}</div>
      <h2 className={`text-2xl font-bold mb-1 ${grade.color}`}>{grade.label}</h2>
      <p className="text-slate-500 text-sm mb-6">Quiz completed</p>
      <div className="flex gap-6 mb-8">
        <div className="text-center">
          <p className="text-4xl font-black text-slate-800 dp-count-up">{score}</p>
          <p className="text-xs text-slate-400 mt-1 uppercase tracking-wide font-semibold">
            Correct
          </p>
        </div>
        <div className="w-px bg-slate-200" />
        <div className="text-center">
          <p className="text-4xl font-black text-slate-800">{total}</p>
          <p className="text-xs text-slate-400 mt-1 uppercase tracking-wide font-semibold">Total</p>
        </div>
        <div className="w-px bg-slate-200" />
        <div className="text-center">
          <p className="text-4xl font-black text-blue-600">{percentage}%</p>
          <p className="text-xs text-slate-400 mt-1 uppercase tracking-wide font-semibold">Score</p>
        </div>
      </div>
      <button
        type="button"
        onClick={onReset}
        className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors duration-150 shadow-sm cursor-pointer"
      >
        Play Again
      </button>
    </div>
  );
}
