const getQuestionsList = ({ data }) =>
  data.map(({ question, correct_answer: answer, difficulty, category }) => ({
    question,
    answer,
    difficulty,
    category,
  }));

const getDifficultyCounts = (questions) => {
  const counts = questions.reduce(
    (acc, { difficulty }) => {
      acc[difficulty] += 1;
      return acc;
    },
    { easy: 0, medium: 0, hard: 0 }
  );

  return [
    { difficulty: 'easy', count: counts.easy },
    { difficulty: 'medium', count: counts.medium },
    { difficulty: 'hard', count: counts.hard },
  ];
};

export const triviaScorer = (triviaData) => {
  const questions = getQuestionsList(triviaData);
  const difficultyCounts = getDifficultyCounts(questions);

  return {
    questions,
    difficultyCounts,
  };
};
