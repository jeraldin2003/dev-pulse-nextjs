/**
 * LeaderboardPanel.jsx
 * Displays top 10 users and highlights current user.
 */

import { Trophy, Award, Medal, User } from 'lucide-react';
import { SectionTitle } from '@/components/ui';

function RankBadge({ rank }) {
  if (rank === 1) return <Trophy size={18} className="text-amber-500" />;
  if (rank === 2) return <Award size={18} className="text-slate-400" />;
  if (rank === 3) return <Medal size={18} className="text-amber-700" />;
  return <span className="font-semibold text-slate-500">#{rank}</span>;
}

export default function LeaderboardPanel({ top10 = [], currentUser }) {
  const isInTop10 = top10.some((p) => p.username === currentUser?.username);

  return (
    <div className="flex flex-col gap-8">
      <div>
        <div className="flex justify-between items-center mb-4">
          <SectionTitle>Global Leaderboard</SectionTitle>
          <span className="px-2.5 py-1 bg-blue-50 text-blue-700 text-xs font-bold uppercase rounded-lg border border-blue-100">
            Top 10
          </span>
        </div>

        <div className="bg-white border border-slate-100 rounded-xl overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-xs font-bold uppercase text-slate-400">
                <th className="px-6 py-3.5 w-20">Rank</th>
                <th className="px-6 py-3.5">Player</th>
                <th className="px-6 py-3.5 text-right">Total Score</th>
                <th className="px-6 py-3.5 text-right">Games</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {top10.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-slate-400 text-sm">
                    No leaderboard data available yet.
                  </td>
                </tr>
              ) : (
                top10.map((player) => {
                  const isCurrentUser = player.username === currentUser?.username;
                  return (
                    <tr key={player.username} className={isCurrentUser ? 'bg-blue-50/40' : ''}>
                      <td className="px-6 py-3.5">
                        <RankBadge rank={player.rank} />
                      </td>
                      <td className="px-6 py-3.5">
                        <div className="flex items-center gap-2.5">
                          <div
                            className={`flex items-center justify-center w-7 h-7 rounded-full ${isCurrentUser ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-400'}`}
                          >
                            <User size={14} />
                          </div>
                          <span className={`font-semibold ${isCurrentUser ? 'text-blue-700' : 'text-slate-700'}`}>
                            {player.username}
                          </span>
                          {isCurrentUser && (
                            <span className="text-[9px] bg-blue-100 text-blue-700 font-bold px-1.5 py-0.5 rounded uppercase ml-1">
                              You
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-3.5 font-bold text-slate-800 text-right tabular-nums">
                        {player.totalScore.toLocaleString()}
                      </td>
                      <td className="px-6 py-3.5 font-medium text-slate-500 text-right tabular-nums">
                        {player.totalGamesPlayed.toLocaleString()}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {!isInTop10 && currentUser && (
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-5">
          <h4 className="text-xs font-bold text-blue-800 uppercase tracking-widest mb-4 flex items-center gap-2">
            <User size={15} />
            Your Current Standing
          </h4>
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white rounded-lg border border-slate-100 p-4">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Rank</span>
              <p className="text-2xl font-black text-blue-600 mt-1">
                {currentUser.rank ? `#${currentUser.rank}` : 'Unranked'}
              </p>
            </div>
            <div className="bg-white rounded-lg border border-slate-100 p-4">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Total Score</span>
              <p className="text-2xl font-bold text-slate-800 mt-1 tabular-nums">
                {currentUser.totalScore.toLocaleString()}
              </p>
            </div>
            <div className="bg-white rounded-lg border border-slate-100 p-4">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Games Played</span>
              <p className="text-2xl font-bold text-slate-800 mt-1 tabular-nums">
                {currentUser.totalGamesPlayed.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
