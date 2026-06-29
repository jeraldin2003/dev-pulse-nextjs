import { useTheme } from '@/context/ThemeContext.jsx';

const DIFFICULTY_LABELS = ['easy', 'medium', 'hard', 'random'];

export function SelectionScreen({ onStart, error }) {
  const { theme } = useTheme();
  return (
    <div className="flex flex-col items-center justify-center p-10 bg-white border border-slate-200 rounded-2xl shadow-sm dp-fade-in max-w-md mx-auto">
      <div
        className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 ${theme === 'light' ? 'bg-blue-50' : 'bg-blue-950/40'}`}
      >
        <span className="text-3xl" role="img" aria-label="brain">
          🧠
        </span>
      </div>
      <h2 className="text-2xl font-bold text-slate-800 mb-2">Trivia Quiz</h2>
      <p className="text-slate-500 text-sm mb-8 text-center">
        10 questions. Choose your difficulty and put your knowledge to the test.
      </p>
      <div className="grid grid-cols-2 gap-3 w-full">
        {DIFFICULTY_LABELS.map((level) => (
          <button
            key={level}
            type="button"
            onClick={() => onStart(level)}
            className={[
              'px-5 py-3 rounded-xl font-semibold text-sm capitalize cursor-pointer',
              'transition-all duration-150 border',
              level === 'easy'
                ? theme === 'light'
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100'
                  : 'bg-emerald-950/30 border-emerald-900/30 text-emerald-400 hover:bg-emerald-950/60'
                : level === 'medium'
                  ? theme === 'light'
                    ? 'bg-amber-50 border-amber-200 text-amber-700 hover:bg-amber-100'
                    : 'bg-amber-950/30 border-amber-900/30 text-amber-400 hover:bg-amber-950/60'
                  : level === 'hard'
                    ? theme === 'light'
                      ? 'bg-rose-50 border-rose-200 text-rose-700 hover:bg-rose-100'
                      : 'bg-rose-950/30 border-rose-900/30 text-rose-400 hover:bg-rose-950/60'
                    : theme === 'light'
                      ? 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                      : 'bg-slate-800/40 border-slate-700/60 text-slate-300 hover:bg-slate-800/80',
            ].join(' ')}
          >
            {level === 'random' ? '🎲 Random' : level}
          </button>
        ))}
      </div>
      {error && (
        <p className="mt-5 text-sm text-rose-650 bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/30 rounded-lg px-4 py-2 w-full text-center">
          {error}
        </p>
      )}
    </div>
  );
}
