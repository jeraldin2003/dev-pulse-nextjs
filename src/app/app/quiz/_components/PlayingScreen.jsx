import { TimerBar } from './TimerBar.jsx';

const DIFFICULTY_BADGE = {
  easy: 'bg-emerald-100 text-emerald-700',
  medium: 'bg-amber-100 text-amber-700',
  hard: 'bg-rose-100 text-rose-700',
};

function optionStyle(option, question, selected) {
  if (!selected) return 'border-slate-200 text-slate-700 hover:border-blue-400';
  if (option === question.correct_answer) return 'border-emerald-400 bg-emerald-50 text-emerald-800';
  if (option === selected) return 'border-rose-400 bg-rose-50 text-rose-800';
  return 'border-slate-100 text-slate-400 opacity-60';
}

export function PlayingScreen({ quiz }) {
  const { currentQuestion: q, index, questions, score, timeLeft, selected, handleAnswer } = quiz;
  if (!q) return null;

  return (
    <div className="flex flex-col max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">
        <span>
          Question {index + 1} / {questions.length}
        </span>
        <div className="flex gap-3">
          <span>⏱ {timeLeft}s</span>
          <span>
            Score: <span className="text-blue-600 font-bold">{score}</span>
          </span>
        </div>
      </div>

      <TimerBar timeLeft={timeLeft} />

      <div className="bg-white border border-slate-200 rounded-2xl p-6 mb-5">
        <div className="flex justify-between items-start mb-4 gap-3">
          <span className="text-xs text-slate-400 truncate max-w-[60%]">{q.category}</span>
          <span
            className={`px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize ${DIFFICULTY_BADGE[q.difficulty] ?? DIFFICULTY_BADGE.medium}`}
          >
            {q.difficulty}
          </span>
        </div>
        <h3 className="text-lg font-semibold text-slate-800">{q.question}</h3>
      </div>

      <div className="flex flex-col gap-3">
        {q.options.map((option, i) => (
          <button
            key={option}
            type="button"
            onClick={() => handleAnswer(option)}
            disabled={!!selected}
            className={`text-left px-5 py-4 rounded-xl border-2 font-medium text-sm ${optionStyle(option, q, selected)}`}
          >
            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-slate-100 text-slate-500 text-xs font-bold mr-3">
              {String.fromCharCode(65 + i)}
            </span>
            {option}
          </button>
        ))}
      </div>
    </div>
  );
}
