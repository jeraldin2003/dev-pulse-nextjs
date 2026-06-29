/**
 * LeaderboardPanel.jsx
 * Displays top 10 users and highlights current user.
 */

import { Trophy, Award, Medal, User } from 'lucide-react';
import { SectionTitle } from '@/components/ui';

export default function LeaderboardPanel({ top10 = [], currentUser }) {
  const isUserInTop10 = top10.some((item) => item.username === currentUser?.username);

  return (
    <div className="flex flex-col gap-8 dp-fade-in">
      {/* Global Leaderboard Table */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <SectionTitle>Global Leaderboard</SectionTitle>
          <span className="px-2.5 py-1 bg-blue-50 text-blue-700 text-[11px] font-bold uppercase tracking-wider rounded-lg border border-blue-100 dark:text-blue-400 dark:border-blue-900/30">
            Top 10 players
          </span>
        </div>

        <div className="bg-white border border-slate-100 rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="px-6 py-3.5 text-[11px] font-bold uppercase tracking-wider text-slate-400 w-20">
                    Rank
                  </th>
                  <th className="px-6 py-3.5 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Player
                  </th>
                  <th className="px-6 py-3.5 text-[11px] font-bold uppercase tracking-wider text-slate-400 text-right">
                    Total Score
                  </th>
                  <th className="px-6 py-3.5 text-[11px] font-bold uppercase tracking-wider text-slate-400 text-right">
                    Games
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100/60">
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
                      <tr
                        key={player.username}
                        className={`transition-colors duration-150 ${
                          isCurrentUser
                            ? 'bg-blue-50/40 hover:bg-blue-50/60'
                            : 'hover:bg-slate-50/60'
                        }`}
                      >
                        <td className="px-6 py-3.5">
                          <div className="flex items-center gap-2">
                            {player.rank === 1 && (
                              <Trophy size={18} className="text-amber-500 shrink-0" />
                            )}
                            {player.rank === 2 && (
                              <Award size={18} className="text-slate-400 shrink-0" />
                            )}
                            {player.rank === 3 && (
                              <Medal size={18} className="text-amber-700 shrink-0" />
                            )}
                            {player.rank > 3 && (
                              <span className="font-semibold text-slate-500 w-5 text-center">
                                #{player.rank}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-3.5">
                          <div className="flex items-center gap-2.5">
                            <div
                              className={`flex items-center justify-center w-7 h-7 rounded-full shrink-0 ${isCurrentUser ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-400'}`}
                            >
                              <User size={14} />
                            </div>
                            <span
                              className={`font-semibold ${isCurrentUser ? 'text-blue-700' : 'text-slate-700'}`}
                            >
                              {player.username}
                            </span>
                            {isCurrentUser && (
                              <span className="text-[9px] bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400 font-bold px-1.5 py-0.5 rounded uppercase tracking-widest ml-1">
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
      </div>

      {/* Current User Stats (if not in top 10) */}
      {!isUserInTop10 && currentUser && (
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border border-blue-100/60 dark:border-blue-900/30 rounded-xl p-5 shadow-sm relative overflow-hidden">
          {/* Decorative background circle */}
          <div className="absolute -right-10 -top-10 w-40 h-40 bg-blue-600/5 rounded-full blur-2xl pointer-events-none" />

          <h4 className="text-xs font-bold text-blue-800 dark:text-blue-400 uppercase tracking-widest mb-4 flex items-center gap-2">
            <User size={15} />
            Your Current Standing
          </h4>
          <div className="grid grid-cols-3 gap-4 relative z-10">
            <div className="bg-white/80 backdrop-blur-sm rounded-lg border border-white p-4 shadow-sm">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Rank
              </span>
              <p className="text-2xl font-black text-blue-600 mt-1">
                {currentUser.rank ? `#${currentUser.rank}` : 'Unranked'}
              </p>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-lg border border-white p-4 shadow-sm">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Total Score
              </span>
              <p className="text-2xl font-bold text-slate-800 mt-1 tabular-nums">
                {currentUser.totalScore.toLocaleString()}
              </p>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-lg border border-white p-4 shadow-sm">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Games Played
              </span>
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
