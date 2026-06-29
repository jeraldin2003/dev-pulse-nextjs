import { TimerBar } from './TimerBar.jsx';

const DIFFICULTY_COLORS = {
  easy: {
    badge: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-400',
    ring: 'ring-emerald-400 dark:ring-emerald-500/50',
  },
  medium: {
    badge: 'bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-400',
    ring: 'ring-amber-400 dark:ring-amber-500/50',
  },
  hard: {
    badge: 'bg-rose-100 text-rose-800 dark:bg-rose-950/40 dark:text-rose-400',
    ring: 'ring-rose-400 dark:ring-rose-500/50',
  },
};

export function PlayingScreen({
  currentQuestion,
  currentIndex,
  total,
  score,
  timeLeft,
  selectedAnswer,
  onAnswer,
}) {
  if (!currentQuestion) return null;

  const diff = DIFFICULTY_COLORS[currentQuestion.difficulty] ?? DIFFICULTY_COLORS.medium;

  return (
    <div className="flex flex-col max-w-2xl mx-auto dp-fade-in">
      {/* Progress row */}
      <div className="flex justify-between items-center mb-3 px-1">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
          Question {currentIndex + 1} / {total}
        </span>
        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            ⏱ {timeLeft}s
          </span>
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Score: <span className="text-blue-600 font-bold">{score}</span>
          </span>
        </div>
      </div>

      {/* Timer bar */}
      <TimerBar timeLeft={timeLeft} />

      {/* Question card */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm mb-5">
        <div className="flex justify-between items-start mb-4 gap-3">
          <span className="text-xs font-medium text-slate-400 truncate max-w-[60%]">
            {currentQuestion.category}
          </span>
          <span
            className={`shrink-0 px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize ${diff.badge}`}
          >
            {currentQuestion.difficulty}
          </span>
        </div>
        <h3 className="text-lg font-semibold text-slate-800 leading-snug">
          {currentQuestion.question}
        </h3>
      </div>

      {/* Answer options */}
      <div className="flex flex-col gap-3">
        {currentQuestion.options.map((option, i) => {
          const isSelected = selectedAnswer === option;
          const isAnswer = option === currentQuestion.correct_answer;
          let optionClass =
            'border-slate-200 dark:border-slate-700/60 text-slate-700 dark:text-slate-300 hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950/20 cursor-pointer';

          if (selectedAnswer !== null) {
            // Feedback phase
            if (isAnswer)
              optionClass =
                'border-emerald-400 dark:border-emerald-500/80 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-800 dark:text-emerald-300 cursor-default';
            else if (isSelected)
              optionClass =
                'border-rose-400 dark:border-rose-500/80 bg-rose-50 dark:bg-rose-950/20 text-rose-800 dark:text-rose-300 cursor-default';
            else
              optionClass =
                'border-slate-100 dark:border-slate-800/40 text-slate-400 dark:text-slate-500 cursor-default opacity-60';
          }

          return (
            <button
              key={i}
              type="button"
              onClick={() => onAnswer(option)}
              disabled={selectedAnswer !== null}
              className={`text-left w-full px-5 py-4 rounded-xl border-2 font-medium text-sm transition-all duration-150 ${optionClass}`}
            >
              <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-slate-100 text-slate-500 text-xs font-bold mr-3 shrink-0 align-middle">
                {String.fromCharCode(65 + i)}
              </span>
              {option}
            </button>
          );
        })}
      </div>
    </div>
  );
}
