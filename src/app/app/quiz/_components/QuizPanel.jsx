import { useQuiz } from '../_hooks/useQuiz.js';
import { SelectionScreen } from './SelectionScreen.jsx';
import { PlayingScreen } from './PlayingScreen.jsx';
import { FinishedScreen } from './FinishedScreen.jsx';

export function QuizPanel() {
  const quiz = useQuiz();

  switch (quiz.phase) {
    case 'setup':
      return <SelectionScreen onStart={quiz.startQuiz} error={quiz.error} />;
    case 'loading':
      return <p className="text-center text-sm text-slate-500 py-20">Loading questions…</p>;
    case 'done':
      return <FinishedScreen score={quiz.score} total={quiz.questions.length} onReset={quiz.resetQuiz} />;
    default:
      return <PlayingScreen quiz={quiz} />;
  }
}
