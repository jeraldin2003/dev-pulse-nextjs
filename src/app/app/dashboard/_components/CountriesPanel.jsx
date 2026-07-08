"use client";
import { useState } from 'react';
import { Globe } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

import { StatCard } from '@/components/ui';
import { SectionTitle } from '@/components/ui';
import { ErrorCard } from '@/components/ui';

function CountriesTooltip({ active, payload }) {
  if (!active || !payload || payload.length === 0) {
    return null;
  }

  const entry = payload[0].payload;

  return (
    <div className="p-2 bg-white border border-slate-200 rounded-md text-xs shadow-sm">
      <p className="font-semibold text-slate-800 mb-0.5">{entry.name}</p>
      <p className="text-slate-500">{entry.population.toLocaleString()} people</p>
    </div>
  );
}

export default function CountriesPanel({ data }) {
  const [search, setSearch] = useState('');

  if (!data) {
    return <ErrorCard message="Countries data is unavailable due to a failed API request." />;
  }

  const countries = data.top10CountriesByPopulation;
  const chartData = countries.slice(0, 5);

  const filtered = countries.filter((country) =>
    country.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <SectionTitle>Country Statistics</SectionTitle>

      <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-4 max-w-[320px]">
        <StatCard
          icon={Globe}
          label="Total Countries"
          value={data.totalCountries}
          colorKey="cyan"
        />
      </div>

      <div className="mt-6">
        <SectionTitle>Top 5 by Population</SectionTitle>

        <div className="p-4 bg-white border border-slate-200 rounded-lg shadow-sm mb-6">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--dp-surface-200)" />
              <XAxis
                dataKey="name"
                tick={{ fill: 'var(--dp-text-muted)', fontSize: 11 }}
                interval={0}
                angle={-20}
                textAnchor="end"
                height={70}
              />
              <YAxis
                tick={{ fill: 'var(--dp-text-muted)', fontSize: 12 }}
                tickFormatter={(v) => `${(v / 1e6).toFixed(0)}M`}
              />
              <Tooltip content={<CountriesTooltip />} />
              <Bar dataKey="population" fill="#06b6d4" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="flex items-center justify-between gap-4 mb-4 flex-wrap">
        <h2 className="text-lg font-semibold text-slate-800 pb-2 border-b border-slate-200 flex-1">
          Countries ({filtered.length})
        </h2>
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search countries..."
          className="px-3 py-1.5 border border-slate-200 rounded-lg text-sm min-w-[200px] outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white text-slate-800"
        />
      </div>

      {filtered.length === 0 ? (
        <p className="p-8 text-center text-slate-500 bg-white rounded-lg border border-slate-200 shadow-sm">
          No countries match your search
        </p>
      ) : (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-4">
          {filtered.map((country) => (
            <div
              key={country.name}
              className="p-4 bg-white border border-slate-200 rounded-lg shadow-sm"
            >
              <p className="font-semibold text-slate-800 mb-0.5">{country.name}</p>
              <p className="text-sm text-slate-500">{country.population.toLocaleString()}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
