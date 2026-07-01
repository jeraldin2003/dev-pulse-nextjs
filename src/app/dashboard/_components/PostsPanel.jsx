"use client";
import { FileText } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

import { StatCard } from '@/components/ui';
import { SectionTitle, SkeletonCard } from '@/components/ui';
import { ErrorCard } from '@/components/ui';
import { useFetch } from '@/hooks/useFetch';
import { postAnalysis } from '@/app/dashboard/_utils/postAnalysis';

function PostsTooltip({ active, payload }) {
  if (!active || !payload || payload.length === 0) {
    return null;
  }

  const entry = payload[0].payload;

  return (
    <div className="p-2 bg-white border border-slate-200 rounded-md text-xs shadow-sm">
      <p className="font-semibold text-slate-800 mb-0.5">User {entry.userId}</p>
      <p className="text-slate-600">{entry.postCount} posts</p>
    </div>
  );
}

export default function PostsPanel() {
  const { data: rawData, loading, error } = useFetch(`${process.env.NEXT_PUBLIC_API_URL}/dashboard/posts`);

  if (loading) return <div className="dp-fade-in"><SkeletonCard rows={6} /></div>;
  if (error) throw new Error(error);

  // API returns { data: [...] } envelope; unwrap the raw array for postAnalysis
  const data = rawData?.data ? postAnalysis(rawData.data) : null;
  if (!data) {
    return <ErrorCard message="Posts data is unavailable due to a failed API request." />;
  }

  const chartData = data.top5UsersByPostCount;

  return (
    <div>
      <SectionTitle>Post Statistics</SectionTitle>

      <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-4 max-w-[320px]">
        <StatCard icon={FileText} label="Total Posts" value={data.totalPosts} colorKey="violet" />
      </div>

      <div className="mt-6">
        <SectionTitle>Posts per User Leaderboard</SectionTitle>

        <div className="p-4 bg-white border border-slate-200 rounded-lg shadow-sm">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--dp-surface-200)" />
              <XAxis
                dataKey="userId"
                tickFormatter={(userId) => `User ${userId}`}
                tick={{ fill: 'var(--dp-text-muted)', fontSize: 12 }}
              />
              <YAxis tick={{ fill: 'var(--dp-text-muted)', fontSize: 12 }} allowDecimals={false} />
              <Tooltip content={<PostsTooltip />} />
              <Bar dataKey="postCount" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
