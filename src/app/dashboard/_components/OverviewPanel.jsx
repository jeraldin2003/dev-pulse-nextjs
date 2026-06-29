/**
 * OverviewPanel.jsx
 * Dashboard overview — stat cards + quick facts.
 * Updated to use new colorKey prop on StatCard.
 */
"use client";
import { Users, FileText, CheckSquare, Brain, Globe } from 'lucide-react';
import { StatCard } from '@/components/ui';
import { SectionTitle } from '@/components/ui';
import { EmptyState } from '@/components/ui';

function getTopCompletion(stats = []) {
  return stats.reduce(
    (top, cur) => (cur.completionPercentage > (top?.completionPercentage ?? -1) ? cur : top),
    null
  );
}

function getHardestDifficulty(counts = []) {
  return counts.reduce((top, cur) => (cur.count > (top?.count ?? -1) ? cur : top), null);
}

export default function OverviewPanel({ data }) {
  if (!data || Object.keys(data).length === 0) {
    return (
      <EmptyState
        title="No data available"
        message="All external APIs failed to respond. Try refreshing."
      />
    );
  }

  const topPoster = data.posts?.top5UsersByPostCount?.[0];
  const topCompletion = getTopCompletion(data.productivity?.userCompletionStats);
  const hardestDifficulty = getHardestDifficulty(data.trivia?.difficultyCounts);
  const largestCountry = data.countries?.top10CountriesByPopulation?.[0];

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
    largestCountry && {
      label: 'Largest country',
      value: `${largestCountry.name} — ${largestCountry.population.toLocaleString()} people`,
    },
  ].filter(Boolean);

  return (
    <div className="dp-fade-in">
      <SectionTitle>Summary</SectionTitle>

      <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-4 mb-8">
        {data.users && (
          <StatCard
            icon={Users}
            label="Total Users"
            value={data.users.totalUsers}
            colorKey="blue"
          />
        )}
        {data.posts && (
          <StatCard
            icon={FileText}
            label="Total Posts"
            value={data.posts.totalPosts}
            colorKey="violet"
          />
        )}
        {data.productivity && (
          <StatCard
            icon={CheckSquare}
            label="Users Tracked"
            value={data.productivity.userCompletionStats.length}
            colorKey="green"
            sub="Productivity stats"
          />
        )}
        {data.trivia && (
          <StatCard
            icon={Brain}
            label="Trivia Questions"
            value={data.trivia.questions.length}
            colorKey="amber"
          />
        )}
        {data.countries && (
          <StatCard
            icon={Globe}
            label="Total Countries"
            value={data.countries.totalCountries}
            colorKey="cyan"
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
