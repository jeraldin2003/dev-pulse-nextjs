/**
 * useQuiz.js
 * State machine for the trivia quiz game.
 * phase: 'setup' -> 'loading' -> 'playing' -> 'done'
 */

import { useState, useCallback, useEffect, useRef } from 'react';
import { useAuth } from '@/context/AuthContext.jsx';
import { saveQuizScore } from '../_api/quiz.js';
import { decodeHtmlEntities } from '@/utils/htmlSanitize.js';

const QUESTION_COUNT = 10;
const SECONDS_PER_Q = 30;
const FEEDBACK_MS = 700;
const TRIVIA_API = 'https://opentdb.com/api.php';

export function useQuiz() {
  const { user } = useAuth();

  const [phase, setPhase] = useState('setup');
  const [questions, setQuestions] = useState([]);
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(SECONDS_PER_Q);
  const [selected, setSelected] = useState(null);
  const [error, setError] = useState(null);

  const timerId = useRef(null);
  const feedbackId = useRef(null);

  const clearTimers = useCallback(() => {
    clearInterval(timerId.current);
    clearTimeout(feedbackId.current);
  }, []);

  useEffect(() => clearTimers, [clearTimers]);

  const startTimer = useCallback(() => {
    clearInterval(timerId.current);
    setTimeLeft(SECONDS_PER_Q);
    timerId.current = setInterval(() => {
      setTimeLeft((t) => (t <= 1 ? 0 : t - 1));
    }, 1000);
  }, []);

  // Move to the next question, or finish the quiz.
  const advance = useCallback(
    (finalScore) => {
      setSelected(null);
      setIndex((i) => {
        const nextIndex = i + 1;
        if (nextIndex >= QUESTION_COUNT) {
          clearInterval(timerId.current);
          setPhase('done');
          saveQuizScore(finalScore, user).catch(() => {});
        } else {
          startTimer();
        }
        return nextIndex;
      });
    },
    [startTimer, user]
  );

  // Time ran out on the current question — auto-advance, no points.
  useEffect(() => {
    if (phase !== 'playing' || timeLeft > 0 || selected) return;
    advance(score);
  }, [timeLeft, phase, selected, score, advance]);

  const startQuiz = useCallback(
    async (difficulty) => {
      clearTimers();
      setError(null);
      setPhase('loading');
      setScore(0);
      setIndex(0);
      setSelected(null);

      try {
        const url = new URL(TRIVIA_API);
        url.searchParams.set('amount', QUESTION_COUNT);
        url.searchParams.set('type', 'multiple');
        if (difficulty !== 'random') url.searchParams.set('difficulty', difficulty);

        const res = await fetch(url);
        if (!res.ok) throw new Error('Failed to fetch questions.');

        const { results } = await res.json();
        if (!results?.length) throw new Error('No questions returned. Please try again.');

        setQuestions(
          results.map((q) => ({
            question: decodeHtmlEntities(q.question),
            correct_answer: decodeHtmlEntities(q.correct_answer),
            category: q.category,
            difficulty: q.difficulty,
            options: [...q.incorrect_answers.map(decodeHtmlEntities), decodeHtmlEntities(q.correct_answer)].sort(
              () => Math.random() - 0.5
            ),
          }))
        );
        setPhase('playing');
        startTimer();
      } catch (err) {
        setError(err.message ?? 'Something went wrong. Please try again.');
        setPhase('setup');
      }
    },
    [clearTimers, startTimer]
  );

  const handleAnswer = useCallback(
    (option) => {
      if (selected) return;
      clearInterval(timerId.current);
      setSelected(option);

      const correct = option === questions[index]?.correct_answer;
      const finalScore = correct ? score + 1 : score;
      if (correct) setScore(finalScore);

      feedbackId.current = setTimeout(() => advance(finalScore), FEEDBACK_MS);
    },
    [selected, questions, index, score, advance]
  );

  const resetQuiz = useCallback(() => {
    clearTimers();
    setPhase('setup');
    setQuestions([]);
    setIndex(0);
    setScore(0);
    setTimeLeft(SECONDS_PER_Q);
    setSelected(null);
    setError(null);
  }, [clearTimers]);

  return {
    phase,
    questions,
    currentQuestion: questions[index] ?? null,
    index,
    score,
    timeLeft,
    selected,
    error,
    startQuiz,
    handleAnswer,
    resetQuiz,
  };
}
