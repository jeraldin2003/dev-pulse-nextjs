const DIFFICULTIES = [
  { id: 'easy', label: 'Easy', className: 'bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100' },
  { id: 'medium', label: 'Medium', className: 'bg-amber-50 border-amber-200 text-amber-700 hover:bg-amber-100' },
  { id: 'hard', label: 'Hard', className: 'bg-rose-50 border-rose-200 text-rose-700 hover:bg-rose-100' },
  { id: 'random', label: '🎲 Random', className: 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100' },
];

export function SelectionScreen({ onStart, error }) {
  return (
    <div className="flex flex-col items-center p-10 bg-white border border-slate-200 rounded-2xl max-w-md mx-auto">
      <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6 bg-blue-50 text-3xl">🧠</div>
      <h2 className="text-2xl font-bold text-slate-800 mb-2">Trivia Quiz</h2>
      <p className="text-slate-500 text-sm mb-8 text-center">
        10 questions. Choose your difficulty and put your knowledge to the test.
      </p>

      <div className="grid grid-cols-2 gap-3 w-full">
        {DIFFICULTIES.map(({ id, label, className }) => (
          <button
            key={id}
            type="button"
            onClick={() => onStart(id)}
            className={`px-5 py-3 rounded-xl border font-semibold text-sm capitalize ${className}`}
          >
            {label}
          </button>
        ))}
      </div>

      {error && (
        <p className="mt-5 text-sm text-rose-700 bg-rose-50 border border-rose-200 rounded-lg px-4 py-2 w-full text-center">
          {error}
        </p>
      )}
    </div>
  );
}
