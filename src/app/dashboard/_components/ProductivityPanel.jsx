/**
 * ProductivityPanel.jsx
 * Shows completion rate bar chart.
 * Sorted descending by completion rate, adds a 70% goal line.
 */
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Cell,
  ReferenceLine,
} from 'recharts';

import { SectionTitle, SkeletonCard } from '@/components/ui';
import { EmptyState } from '@/components/ui';
import { useFetch } from '@/hooks/useFetch';

function getCompletionColor(rate) {
  if (rate >= 70) return '#10b981'; // emerald-500
  if (rate >= 40) return '#f59e0b'; // amber-500
  return '#ef4444'; // rose-500
}

function ProductivityTooltip({ active, payload }) {
  if (!active || !payload || payload.length === 0) return null;
  const entry = payload[0].payload;

  return (
    <div className="p-3 bg-white border border-slate-200 rounded-lg shadow-sm">
      <p className="font-semibold text-slate-800 mb-1">{entry.userName}</p>
      <div className="flex items-center justify-between gap-4 text-sm">
        <span className="text-slate-500">Completed</span>
        <span className="font-medium text-slate-700">
          {entry.completedTodos} / {entry.totalTodos}
        </span>
      </div>
      <div className="flex items-center justify-between gap-4 text-sm mt-0.5">
        <span className="text-slate-500">Rate</span>
        <span className="font-bold text-blue-600">{entry.completionPercentage}%</span>
      </div>
    </div>
  );
}

export default function ProductivityPanel() {
  const data = useFetch(`${process.env.NEXT_PUBLIC_API_URL}/dashboard/productivity`);
  if (data.loading) {
    return <div className="dp-fade-in"><SkeletonCard rows={6} /></div>;
  }
  const userCompletionStats = data?.data?.data?.userCompletionStats ?? [];
  if (data.error) {
    throw new Error(data.error);
  }


  if (!userCompletionStats?.length) {
    return (
      <EmptyState title="No Productivity Data" message="Unable to fetch todos or users data." />
    );
  }

  // Sort descending by completion percentage
  const chartData = userCompletionStats.sort(
    (a, b) => b.completionPercentage - a.completionPercentage
  );
  const avgCompletion = Math.round(
    chartData.reduce((sum, u) => sum + u.completionPercentage, 0) / chartData.length
  );
  const bestPerformer = chartData[0];

  return (
    <div className="dp-fade-in flex flex-col gap-6">
      <div>
        <SectionTitle>Productivity Overview</SectionTitle>
        <div className="grid grid-cols-2 gap-4 mb-2">
          <div className="p-4 bg-white rounded-xl border border-slate-100 shadow-sm flex items-center justify-between">
            <span className="text-sm font-medium text-slate-500">Average Completion</span>
            <span className="text-xl font-bold text-slate-800">{avgCompletion}%</span>
          </div>
          <div className="p-4 bg-white rounded-xl border border-slate-100 shadow-sm flex items-center justify-between">
            <span className="text-sm font-medium text-slate-500">Top Performer</span>
            <span className="text-xl font-bold text-emerald-600">
              {bestPerformer.userName} ({bestPerformer.completionPercentage}%)
            </span>
          </div>
        </div>
      </div>

      <div className="p-5 bg-white border border-slate-100 rounded-xl shadow-sm">
        <h3 className="text-sm font-semibold text-slate-800 mb-6">Completion Rate by User</h3>
        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} layout="vertical" margin={{ left: 40, right: 20 }}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="var(--dp-surface-200)"
                horizontal={false}
              />
              <XAxis
                type="number"
                domain={[0, 100]}
                tick={{ fontSize: 12, fill: 'var(--dp-text-muted)' }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                type="category"
                dataKey="userName"
                width={100}
                tick={{ fontSize: 12, fill: 'var(--dp-text-secondary)' }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                cursor={{ fill: 'var(--dp-surface-100)' }}
                content={<ProductivityTooltip />}
              />
              <ReferenceLine
                x={70}
                stroke="var(--dp-text-muted)"
                strokeDasharray="3 3"
                label={{
                  position: 'top',
                  value: 'Goal: 70%',
                  fill: 'var(--dp-text-secondary)',
                  fontSize: 11,
                }}
              />
              <Bar dataKey="completionPercentage" radius={[0, 4, 4, 0]} barSize={20}>
                {chartData.map((entry) => (
                  <Cell key={entry.userId} fill={getCompletionColor(entry.completionPercentage)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
