const getTodosForUser = (userId, todos) =>
  todos.filter(({ userId: todoUserId }) => todoUserId === userId);

const getCompletedCount = (todos) =>
  todos.reduce((count, { completed }) => count + (completed ? 1 : 0), 0);

const getCompletionPercentage = (total, completed) =>
  total === 0 ? 0 : Math.round((completed / total) * 100);

const getCompletionForAllUsers = (users, todos) =>
  users.map(({ id, name }) => {
    const userTodos = getTodosForUser(id, todos);
    const totalTodos = userTodos.length;
    const completedTodos = getCompletedCount(userTodos);

    return {
      userId: id,
      userName: name,
      totalTodos,
      completedTodos,
      completionPercentage: getCompletionPercentage(totalTodos, completedTodos),
    };
  });

export const productivityTracker = (users, todos) => ({
  userCompletionStats: getCompletionForAllUsers(users, todos),
});
