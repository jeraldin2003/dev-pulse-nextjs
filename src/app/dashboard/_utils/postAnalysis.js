const getTotalPosts = (posts) => posts.length;

const getPostCountPerUser = (posts) => {
  const userCounts = posts.reduce((acc, { userId }) => {
    acc[userId] = (acc[userId] || 0) + 1;
    return acc;
  }, {});

  return Object.entries(userCounts).map(([userId, postCount]) => ({
    userId: Number(userId),
    postCount,
  }));
};

const sortByPostCountDescending = (userCounts) =>
  [...userCounts].sort((a, b) => b.postCount - a.postCount);

const getTop5UsersByPostCount = (posts) =>
  sortByPostCountDescending(getPostCountPerUser(posts)).slice(0, 5);

export const postAnalysis = (posts) => {
  const totalPosts = getTotalPosts(posts);
  const top5UsersByPostCount = getTop5UsersByPostCount(posts);

  return {
    totalPosts,
    top5UsersByPostCount,
  };
};
