import { useQuiz } from '../_hooks/useQuiz.js';
import { SelectionScreen } from './SelectionScreen.jsx';
import { PlayingScreen } from './PlayingScreen.jsx';
import { FinishedScreen } from './FinishedScreen.jsx';

function LoadingScreen() {
  return (
    <div className="flex flex-col items-center justify-center py-20 dp-fade-in">
      <div className="w-12 h-12 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin mb-4" />
      <p className="text-slate-500 text-sm">Fetching questions…</p>
    </div>
  );
}

export function QuizPanel() {
  const {
    quizState,
    currentQuestion,
    currentIndex,
    questions,
    score,
    timeLeft,
    selectedAnswer,
    error,
    startQuiz,
    handleAnswer,
    resetQuiz,
  } = useQuiz();

  if (quizState === 'selection') return <SelectionScreen onStart={startQuiz} error={error} />;
  if (quizState === 'loading') return <LoadingScreen />;
  if (quizState === 'finished')
    return <FinishedScreen score={score} total={questions.length} onReset={resetQuiz} />;

  return (
    <PlayingScreen
      currentQuestion={currentQuestion}
      currentIndex={currentIndex}
      total={questions.length}
      score={score}
      timeLeft={timeLeft}
      selectedAnswer={selectedAnswer}
      onAnswer={handleAnswer}
    />
  );
}
