/**
 * TriviaPanel.jsx
 * Dashboard trivia tab — shows 10 random Q&A cards from the fetched trivia data.
 * Users can click "Shuffle Questions" to pick a new random set.
 */
"use client";
import { useState, useMemo, useCallback } from 'react';
import { Shuffle, Brain, ChevronDown, ChevronUp, BookOpen } from 'lucide-react';
import { SectionTitle, EmptyState, SkeletonCard } from '@/components/ui';
import { useTheme } from '@/context/ThemeContext.jsx';
import { useFetch } from '@/hooks/useFetch';
import { triviaScorer } from '@/app/dashboard/_utils/triviaScorer';

function pickRandom(arr, count) {
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, shuffled.length));
}

function DifficultyBadge({ difficulty }) {
  const { theme } = useTheme();

  const getStyles = (level, isLight) => {
    switch (level) {
      case 'easy':
        return isLight
          ? { badge: 'bg-emerald-50 text-emerald-700 border-emerald-200', dot: 'bg-emerald-500' }
          : {
              badge: 'bg-emerald-950/30 text-emerald-400 border-emerald-900/30',
              dot: 'bg-emerald-400',
            };
      case 'medium':
        return isLight
          ? { badge: 'bg-amber-50 text-amber-700 border-amber-200', dot: 'bg-amber-500' }
          : { badge: 'bg-amber-950/30 text-amber-400 border-amber-900/30', dot: 'bg-amber-400' };
      case 'hard':
        return isLight
          ? { badge: 'bg-rose-50 text-rose-700 border-rose-200', dot: 'bg-rose-500' }
          : { badge: 'bg-rose-950/30 text-rose-400 border-rose-900/30', dot: 'bg-rose-400' };
      default:
        return isLight
          ? { badge: 'bg-slate-50 text-slate-600 border-slate-200', dot: 'bg-slate-400' }
          : { badge: 'bg-slate-800/40 text-slate-300 border-slate-700/60', dot: 'bg-slate-400' };
    }
  };

  const styles = getStyles(difficulty, theme === 'light');

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full border ${styles.badge}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${styles.dot}`} />
      {difficulty}
    </span>
  );
}

function QuestionCard({ question, answer, category, difficulty, index }) {
  const [revealed, setRevealed] = useState(false);
  const { theme } = useTheme();
  return (
    <div className="bg-white border border-slate-100 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden">
      {/* Card header */}
      <div className="flex items-start justify-between gap-3 px-5 pt-4 pb-3">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <span className="flex-shrink-0 w-7 h-7 rounded-full bg-blue-50 text-blue-600 font-bold text-xs flex items-center justify-center mt-0.5">
            {index + 1}
          </span>
          <p className="text-sm font-medium text-slate-800 leading-relaxed">{question}</p>
        </div>
        <DifficultyBadge difficulty={difficulty} />
      </div>

      {/* Category tag */}
      <div className="px-5 pb-3">
        <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
          <BookOpen size={10} />
          {category}
        </span>
      </div>

      {/* Answer toggle */}
      <button
        type="button"
        onClick={() => setRevealed((r) => !r)}
        className={`w-full flex items-center justify-between gap-2 px-5 py-3 text-xs font-semibold tracking-wide transition-colors duration-150 border-t ${
          theme === 'light'
            ? revealed
              ? 'border-slate-100 bg-emerald-50 text-emerald-700 hover:bg-emerald-100/70'
              : 'border-slate-100 bg-slate-50 hover:bg-slate-100 text-slate-500 hover:text-slate-800'
            : revealed
              ? 'border-slate-200/40 bg-emerald-950/40 text-emerald-400 hover:bg-emerald-950/60'
              : 'border-slate-200/40 bg-slate-800/40 hover:bg-slate-800/70 text-slate-400 hover:text-slate-200'
        }`}
      >
        <span>{revealed ? 'Hide Answer' : 'Show Answer'}</span>
        {revealed ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
      </button>

      {/* Answer */}
      {revealed && (
        <div className="px-5 py-3 border-t border-emerald-100 dark:border-emerald-900/30 bg-emerald-50/60 dark:bg-emerald-950/20 dp-fade-in">
          <p className="text-sm font-semibold text-emerald-800 dark:text-emerald-300">{answer}</p>
        </div>
      )}
    </div>
  );
}

export default function TriviaPanel() {
  const { data: rawData, loading, error } = useFetch(`${process.env.NEXT_PUBLIC_API_URL}/dashboard/trivia`);
  const [seed, setSeed] = useState(0);
  const { theme } = useTheme();

  // triviaScorer expects the full { data: [...] } envelope from the API response
  const data = useMemo(() => {
    return rawData ? triviaScorer(rawData) : null;
  }, [rawData]);

  const allQuestions = data?.questions ?? [];

  // Re-shuffle when seed changes, maintaining stable order within a render
  const displayed = useMemo(
    () => pickRandom(allQuestions, 10),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [seed, allQuestions]
  );
  const shuffle = useCallback(() => setSeed((s) => s + 1), []);

  // Early returns AFTER all hooks — required by React rules of hooks
  if (loading) return <div className="dp-fade-in"><SkeletonCard rows={6} /></div>;
  if (error) throw new Error(error);

  if (!allQuestions.length) {
    return (
      <EmptyState
        title="No trivia data available"
        message="Questions could not be loaded. Try refreshing the dashboard."
      />
    );
  }

  const counts = data.difficultyCounts ?? [];


  return (
    <div className="dp-fade-in">
      {/* Header row */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <SectionTitle>Trivia Questions</SectionTitle>
          <p className="text-xs text-slate-400 mt-0.5">
            Showing 10 of {allQuestions.length} questions · click a card to reveal the answer
          </p>
        </div>
        <button
          type="button"
          onClick={shuffle}
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-sm font-semibold rounded-lg shadow-sm transition-all duration-150"
        >
          <Shuffle size={15} />
          Shuffle Questions
        </button>
      </div>

      {/* Difficulty summary chips */}
      {counts.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-6">
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500">
            <Brain size={13} className={theme === 'light' ? 'text-slate-500' : 'text-slate-400'} />
            Difficulty breakdown:
          </span>
          {counts.map(({ difficulty, count }) => (
            <span
              key={difficulty}
              className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full border ${
                theme === 'light'
                  ? difficulty === 'easy'
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    : difficulty === 'medium'
                      ? 'bg-amber-50 text-amber-700 border-amber-200'
                      : difficulty === 'hard'
                        ? 'bg-rose-50 text-rose-700 border-rose-200'
                        : 'bg-slate-50 text-slate-600 border-slate-200'
                  : difficulty === 'easy'
                    ? 'bg-emerald-950/30 text-emerald-400 border-emerald-900/30'
                    : difficulty === 'medium'
                      ? 'bg-amber-950/30 text-amber-400 border-amber-900/30'
                      : difficulty === 'hard'
                        ? 'bg-rose-950/30 text-rose-400 border-rose-900/30'
                        : 'bg-slate-800/40 text-slate-300 border-slate-700/60'
              }`}
            >
              {count} {difficulty}
            </span>
          ))}
        </div>
      )}

      {/* Question cards grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {displayed.map((q, i) => (
          <QuestionCard
            key={`${seed}-${i}`}
            index={i}
            question={q.question}
            answer={q.answer}
            category={q.category}
            difficulty={q.difficulty}
          />
        ))}
      </div>
    </div>
  );
}
