/**
 * UsersPanel.jsx
 * Shows user statistics and the .biz users list.
 * Fixed to match new data structure from userStats module.
 */
"use client";
import { Users, Building2, Mail } from 'lucide-react';

import { StatCard } from '@/components/ui';
import { SectionTitle, SkeletonCard } from '@/components/ui';
import { Badge } from '@/components/ui';
import { EmptyState } from '@/components/ui';
import { useTheme } from '@/context/ThemeContext.jsx';
import { useFetch } from '@/hooks/useFetch';
import { userStats } from '@/app/dashboard/_utils/userStats';

/** Returns up to 2 uppercase initials from a display name */
function getInitials(name = '') {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? '')
    .join('');
}

export default function UsersPanel() {
  const { theme } = useTheme();
  const { data: rawData, loading, error } = useFetch(`${process.env.NEXT_PUBLIC_API_URL}/dashboard/users`);

  if (loading) return <div className="dp-fade-in"><SkeletonCard rows={6} /></div>;
  if (error) throw new Error(error);

  // API returns { data: [...] } envelope; unwrap the raw array for userStats
  const data = rawData?.data ? userStats(rawData.data) : null;
  if (!data) return <EmptyState title="No User Data" message="Unable to load user information." />;

  const uniqueCompanies = [...new Set(data.companies.map((c) => c.company).filter(Boolean))];

  return (
    <div className="dp-fade-in flex flex-col gap-6">
      {/* Stats row */}
      <div>
        <SectionTitle>User Statistics</SectionTitle>
        <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-4">
          <StatCard icon={Users} label="Total Users" value={data.totalUsers} colorKey="blue" />
          <StatCard
            icon={Building2}
            label="Unique Companies"
            value={data.totalCompanies}
            colorKey="violet"
          />
        </div>
      </div>

      {/* Companies */}
      <div className="bg-white border border-slate-100 rounded-xl p-5 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-sm font-semibold text-slate-800 m-0 uppercase tracking-wider">
            Companies
          </h3>
          <Badge color="#8b5cf6">{uniqueCompanies.length} Total</Badge>
        </div>
        <div className="flex flex-wrap gap-2">
          {uniqueCompanies.map((company) => (
            <span
              key={company}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium border ${
                theme === 'light'
                  ? 'bg-violet-50 text-violet-700 border-violet-100'
                  : 'bg-violet-950/40 text-violet-400 border-violet-900/30'
              }`}
            >
              {company}
            </span>
          ))}
        </div>
      </div>

      {/* .biz Users */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <SectionTitle>.biz Domain Users</SectionTitle>
          <Badge color="#3b82f6">{data.bizUsers.length} Found</Badge>
        </div>

        {data.bizUsers.length === 0 ? (
          <EmptyState
            title="No .biz Users"
            message="No users with a .biz email domain were found."
          />
        ) : (
          <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-4">
            {data.bizUsers.map((user) => (
              <div
                key={user.id}
                className="bg-white border border-slate-100 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow duration-200"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-11 h-11 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-sm border border-blue-100 dark:border-blue-900/30 shrink-0">
                    {getInitials(user.name)}
                  </div>
                  <div className="min-w-0">
                    <div className="font-semibold text-slate-900 truncate">{user.name}</div>
                    <div className="text-[11px] font-medium uppercase tracking-wider text-slate-400 mt-0.5">
                      User #{user.id}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-2.5">
                  <div className="flex items-center gap-2 text-slate-600 text-sm bg-slate-50 rounded-md p-2 border border-slate-100">
                    <Mail size={14} className="text-slate-400 shrink-0" />
                    <span className="truncate">{user.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-600 text-sm bg-slate-50 rounded-md p-2 border border-slate-100">
                    <Building2 size={14} className="text-slate-400 shrink-0" />
                    <span className="truncate font-medium">{user.company.name || 'Unknown'}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
