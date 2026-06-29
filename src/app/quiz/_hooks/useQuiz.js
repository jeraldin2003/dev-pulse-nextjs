/**
 * useQuiz.js
 * State machine for the trivia quiz game.
 * States: 'selection' → 'loading' → 'playing' → 'finished'
 *
 * Responsible for:
 * - Fetching questions from Open Trivia DB
 * - Tracking the current question index, score, and timer
 * - Persisting the final score to the backend via saveQuizScore
 */

import { useState, useCallback, useEffect, useRef } from 'react';
import { useAuth } from '@/context/AuthContext.jsx';
import { saveQuizScore } from '../_api/quiz.js';
import { decodeHtmlEntities } from '@/utils/htmlSanitize.js';

const QUESTION_COUNT = 10;
const SECONDS_PER_Q = 30;
const TRIVIA_API_BASE = 'https://opentdb.com/api.php';

/**
 * @returns {{
 *   quizState:            'selection' | 'loading' | 'playing' | 'finished',
 *   difficulty:           string,
 *   questions:            Array,
 *   currentQuestion:      object | null,
 *   currentIndex:         number,
 *   score:                number,
 *   timeLeft:             number,
 *   selectedAnswer:       string | null,
 *   isCorrect:            boolean | null,
 *   error:                string | null,
 *   startQuiz:            (difficulty: string) => void,
 *   handleAnswer:         (option: string) => void,
 *   resetQuiz:            () => void,
 * }}
 */
export function useQuiz() {
  const { user } = useAuth();

  const [quizState, setQuizState] = useState('selection');
  const [difficulty, setDifficulty] = useState('');
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(SECONDS_PER_Q);
  const [selectedAnswer, setSelectedAnswer] = useState(null); // the option the user clicked
  const [isCorrect, setIsCorrect] = useState(null); // feedback phase
  const [error, setError] = useState(null);

  const timerRef = useRef(null);
  const scoreFinalRef = useRef(0); // stable ref so the finished-state save gets the right value

  // ─── Timer ──────────────────────────────────────────────────────────────────

  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const startTimer = useCallback(() => {
    stopTimer();
    setTimeLeft(SECONDS_PER_Q);
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          // Time's up — auto-advance without scoring
          clearInterval(timerRef.current);
          timerRef.current = null;
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, [stopTimer]);

  // Auto-advance when timer hits 0 during the playing state
  useEffect(() => {
    if (quizState !== 'playing' || timeLeft !== 0 || selectedAnswer !== null) return;
    advanceQuestion(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft, quizState, selectedAnswer]);

  // Cleanup on unmount
  useEffect(() => () => stopTimer(), [stopTimer]);

  // ─── Helpers ─────────────────────────────────────────────────────────────────

  function advanceQuestion(withFeedbackDelay) {
    const advance = () => {
      setSelectedAnswer(null);
      setIsCorrect(null);

      setCurrentIndex((prevIdx) => {
        const nextIdx = prevIdx + 1;
        if (nextIdx >= QUESTION_COUNT) {
          setQuizState('finished');
          stopTimer();
          // Persist score — best-effort, never block UI
          saveQuizScore(scoreFinalRef.current, user).catch(() => {});
        } else {
          startTimer();
        }
        return nextIdx;
      });
    };

    if (withFeedbackDelay) {
      // Show correct/wrong feedback for 800 ms before advancing
      setTimeout(advance, 800);
    } else {
      advance();
    }
  }

  // ─── Public API ──────────────────────────────────────────────────────────────

  const startQuiz = useCallback(
    async (selectedDifficulty) => {
      setDifficulty(selectedDifficulty);
      setError(null);
      setScore(0);
      scoreFinalRef.current = 0;
      setCurrentIndex(0);
      setSelectedAnswer(null);
      setIsCorrect(null);
      setQuizState('loading');
      stopTimer();

      try {
        let url = `${TRIVIA_API_BASE}?amount=${QUESTION_COUNT}&type=multiple`;
        if (selectedDifficulty !== 'random') url += `&difficulty=${selectedDifficulty}`;

        const res = await fetch(url);
        if (!res.ok) throw new Error('Failed to fetch questions from Open Trivia DB.');

        const json = await res.json();

        if (!json.results?.length) throw new Error('No questions returned. Please try again.');

        const formatted = json.results.map((q) => {
          // Decode HTML entities in question text and all answer options
          const options = [
            ...q.incorrect_answers.map(decodeHtmlEntities),
            decodeHtmlEntities(q.correct_answer),
          ].sort(() => Math.random() - 0.5);

          return {
            question: decodeHtmlEntities(q.question),
            correct_answer: decodeHtmlEntities(q.correct_answer),
            category: q.category,
            difficulty: q.difficulty,
            options,
          };
        });

        setQuestions(formatted);
        setQuizState('playing');
        startTimer();
      } catch (err) {
        setError(err.message ?? 'Something went wrong. Please try again.');
        setQuizState('selection');
      }
    },
    [stopTimer, startTimer]
  );

  const handleAnswer = useCallback(
    (option) => {
      if (selectedAnswer !== null) return; // ignore double-clicks

      stopTimer();
      setSelectedAnswer(option);

      const correct = option === questions[currentIndex]?.correct_answer;
      setIsCorrect(correct);

      if (correct) {
        setScore((prev) => {
          const next = prev + 1;
          scoreFinalRef.current = next;
          return next;
        });
      }

      advanceQuestion(true);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [selectedAnswer, questions, currentIndex, stopTimer]
  );

  const resetQuiz = useCallback(() => {
    stopTimer();
    setQuizState('selection');
    setDifficulty('');
    setQuestions([]);
    setCurrentIndex(0);
    setScore(0);
    scoreFinalRef.current = 0;
    setTimeLeft(SECONDS_PER_Q);
    setSelectedAnswer(null);
    setIsCorrect(null);
    setError(null);
  }, [stopTimer]);

  const currentQuestion = questions[currentIndex] ?? null;

  return {
    quizState,
    difficulty,
    questions,
    currentQuestion,
    currentIndex,
    score,
    timeLeft,
    selectedAnswer,
    isCorrect,
    error,
    startQuiz,
    handleAnswer,
    resetQuiz,
  };
}
