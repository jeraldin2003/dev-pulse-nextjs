import { Users, FileText, CheckSquare, Brain } from 'lucide-react';
import { StatCard, SectionTitle, SkeletonCard } from '@/components/ui';
import { SkeletonStatGrid } from '@/components/ui/SkeletonCard';
import { useFetch } from '@/hooks/useFetch';

export default function OverviewPanel() {
  const overviewFetch = useFetch(`${process.env.NEXT_PUBLIC_API_URL}/dashboard/overview`);
  const {mostPostsUser, mostProductiveUser, mostRepeatedDifficulty, postsCount, usersCount, todosCount, triviaCount} = overviewFetch.data?.data || {};

  const isLoading = overviewFetch.loading;

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6 dp-fade-in">
        <SkeletonStatGrid count={4} />
        <SkeletonCard rows={5} />
      </div>
    );  
  }

  // If all failed, show error
  // if (overviewFetch.error) {
  //   throw new Error("All backend API requests failed. Please check network connection.");
  // }

  const quickFacts = [
    mostPostsUser && {
      label: 'Top poster',
      value: `User ${mostPostsUser.userId} — ${mostPostsUser.posts} posts`,
    },
    mostProductiveUser && {
      label: 'Highest completion',
      value: `${mostProductiveUser.user} (${mostProductiveUser.completionRate}%)`,
    },
    mostRepeatedDifficulty && {
      label: 'Most common difficulty',
      value: `${mostRepeatedDifficulty.difficulty} (${mostRepeatedDifficulty.count} questions)`,
    },
  ].filter(Boolean);

  return (
    <div className="dp-fade-in">
      <SectionTitle>Summary</SectionTitle>

      <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-4 mb-8">
        {usersCount && (
          <StatCard
            icon={Users}
            label="Total Users"
            value={usersCount}
            colorKey="blue"
          />
        )}
        {postsCount && (
          <StatCard
            icon={FileText}
            label="Total Posts"
            value={postsCount}
            colorKey="violet"
          />
        )}
        {todosCount && (
          <StatCard
            icon={CheckSquare}
            label="Users Tracked"
            value={todosCount}
            colorKey="green"
            sub="Productivity stats"
          />
        )}
        {triviaCount && (
          <StatCard
            icon={Brain}
            label="Trivia Questions"
            value={triviaCount}
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
