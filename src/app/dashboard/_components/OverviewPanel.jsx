"use client";
import { Users, FileText, CheckSquare, Brain } from 'lucide-react';
import { StatCard, SectionTitle, SkeletonCard } from '@/components/ui';
import { SkeletonStatGrid } from '@/components/ui/SkeletonCard';
import { useFetch } from '@/hooks/useFetch';
import { userStats } from '@/app/dashboard/_utils/userStats.js';
import { postAnalysis } from '@/app/dashboard/_utils/postAnalysis.js';
import { productivityTracker } from '@/app/dashboard/_utils/productivityTracker.js';
import { triviaScorer } from '@/app/dashboard/_utils/triviaScorer.js';

function getTopCompletion(stats = []) {
  return stats.reduce(
    (top, cur) => (cur.completionPercentage > (top?.completionPercentage ?? -1) ? cur : top),
    null
  );
}

function getHardestDifficulty(counts = []) {
  return counts.reduce((top, cur) => (cur.count > (top?.count ?? -1) ? cur : top), null);
}

export default function OverviewPanel() {
  const usersFetch = useFetch(`${process.env.NEXT_PUBLIC_API_URL}/dashboard/users`);
  const postsFetch = useFetch(`${process.env.NEXT_PUBLIC_API_URL}/dashboard/posts`);
  const todosFetch = useFetch(`${process.env.NEXT_PUBLIC_API_URL}/dashboard/todos`);
  const triviaFetch = useFetch(`${process.env.NEXT_PUBLIC_API_URL}/dashboard/trivia`);

  const isLoading = usersFetch.loading || postsFetch.loading || todosFetch.loading || triviaFetch.loading;

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6 dp-fade-in">
        <SkeletonStatGrid count={4} />
        <SkeletonCard rows={5} />
      </div>
    );
  }

  // If all failed, show error
  if (usersFetch.error && postsFetch.error && todosFetch.error && triviaFetch.error) {
    throw new Error("All backend API requests failed. Please check network connection.");
  }

  // API returns { data: [...] } envelope; unwrap for utils that expect raw arrays
  const users = usersFetch.data?.data ? userStats(usersFetch.data.data) : null;
  const posts = postsFetch.data?.data ? postAnalysis(postsFetch.data.data) : null;
  const productivity = (usersFetch.data?.data && todosFetch.data?.data)
    ? productivityTracker(usersFetch.data.data, todosFetch.data.data)
    : null;
  // triviaScorer expects the full { data: [...] } envelope already
  const trivia = triviaFetch.data ? triviaScorer(triviaFetch.data) : null;

  const topPoster = posts?.top5UsersByPostCount?.[0];
  const topCompletion = getTopCompletion(productivity?.userCompletionStats);
  const hardestDifficulty = getHardestDifficulty(trivia?.difficultyCounts);

  const quickFacts = [
    topPoster && {
      label: 'Top poster',
      value: `User ${topPoster.userId} — ${topPoster.postCount} posts`,
    },
    topCompletion && {
      label: 'Highest completion',
      value: `${topCompletion.userName} (${topCompletion.completionPercentage}%)`,
    },
    hardestDifficulty && {
      label: 'Most common difficulty',
      value: `${hardestDifficulty.difficulty} (${hardestDifficulty.count} questions)`,
    },
  ].filter(Boolean);

  return (
    <div className="dp-fade-in">
      <SectionTitle>Summary</SectionTitle>

      <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-4 mb-8">
        {users && (
          <StatCard
            icon={Users}
            label="Total Users"
            value={users.totalUsers}
            colorKey="blue"
          />
        )}
        {posts && (
          <StatCard
            icon={FileText}
            label="Total Posts"
            value={posts.totalPosts}
            colorKey="violet"
          />
        )}
        {productivity && (
          <StatCard
            icon={CheckSquare}
            label="Users Tracked"
            value={productivity.userCompletionStats.length}
            colorKey="green"
            sub="Productivity stats"
          />
        )}
        {trivia && (
          <StatCard
            icon={Brain}
            label="Trivia Questions"
            value={trivia.questions.length}
            colorKey="amber"
          />
        )}
      </div>

      {quickFacts.length > 0 && (
        <>
          <SectionTitle>Quick Facts</SectionTitle>
          <div className="grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-4">
            {quickFacts.map((fact) => (
              <div
                key={fact.label}
                className="p-4 bg-white rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow duration-200"
              >
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                  {fact.label}
                </p>
                <p className="text-[15px] font-semibold text-slate-800">{fact.value}</p>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
