import { Link } from 'react-router-dom';
import { TrendingUp } from 'lucide-react';
import { useApiData } from '../../hooks/useApiData';
import { api } from '../../lib/api';
import { STATIC_GROUPS } from '../../data/fixtureData';
import { getFlagCode } from '../../lib/flags';
import type { Standing } from '../../types/api';

export const GroupsSummary = () => {
  const { data: standingsData } = useApiData<{ standings: Standing[] }>(
    ['standings-home'],
    () => api.getStandings(),
    { staleTime: 5 * 60_000 }
  );

  const standings = standingsData?.standings ?? [];
  // Mostrar solo los primeros 4 grupos en la home
  const PREVIEW_GROUPS = ['A', 'B', 'C', 'D'];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {PREVIEW_GROUPS.map((letter) => {
        const key = `GROUP_${letter}`;
        const apiGroup = standings.find((s) => s.group === key);
        const staticGroup = STATIC_GROUPS.find((sg) => sg.key === key);

        // Priorizar datos reales; fallback a estáticos
        const hasRealData = (apiGroup?.table?.length ?? 0) > 0;

        return (
          <div key={letter} className="stadium-card p-6 bg-white dark:bg-slate-800">
            <div className="flex justify-between items-center mb-6">
              <h3 className="headline-md text-lg">GRUPO {letter}</h3>
              <TrendingUp size={16} className="text-slate-400" />
            </div>
            <div className="space-y-4">
              {hasRealData
                ? apiGroup!.table.slice(0, 3).map((entry, idx) => {
                    const flagCode = getFlagCode(entry.team) || (entry.team as any).flag;
                    return (
                      <div
                        key={entry.team.id}
                        className="flex justify-between items-center text-sm border-b border-slate-50 dark:border-slate-800 pb-2 last:border-0"
                      >
                        <div className="flex items-center gap-3">
                          <span
                            className={`w-1 h-1 rounded-full ${
                              idx < 2 ? 'bg-green-500' : 'bg-slate-300'
                            }`}
                          />
                          {flagCode && (
                            <span className={`fi fi-${flagCode} w-5 h-3 rounded-sm`} />
                          )}
                          <span className="font-bold uppercase tracking-tight truncate max-w-[90px]">
                            {entry.team.shortName ?? entry.team.name}
                          </span>
                        </div>
                        <div className="flex gap-4 font-mono text-xs">
                          <span className="text-slate-400">{entry.playedGames} PJ</span>
                          <span className="font-bold text-fifa-blue dark:text-fifa-gold">
                            {entry.points} PTS
                          </span>
                        </div>
                      </div>
                    );
                  })
                : (staticGroup?.teams ?? []).slice(0, 3).map((team, idx) => (
                    <div
                      key={team.name}
                      className="flex justify-between items-center text-sm border-b border-slate-50 dark:border-slate-800 pb-2 last:border-0"
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className={`w-1 h-1 rounded-full ${
                            idx < 2 ? 'bg-green-500' : 'bg-slate-300'
                          }`}
                        />
                        {team.flag && (
                          <span className={`fi fi-${team.flag} w-5 h-3 rounded-sm`} />
                        )}
                        <span className="font-bold uppercase tracking-tight truncate max-w-[90px]">
                          {team.nameEs}
                        </span>
                      </div>
                      <div className="flex gap-4 font-mono text-xs">
                        <span className="text-slate-400">— PJ</span>
                        <span className="font-bold text-fifa-blue dark:text-fifa-gold">— PTS</span>
                      </div>
                    </div>
                  ))}
            </div>
          </div>
        );
      })}
      <div className="lg:col-span-4 flex justify-center mt-8">
        <Link
          to="/fixture"
          className="px-10 py-4 border-2 border-slate-200 dark:border-slate-700 rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
        >
          Ver todos los grupos
        </Link>
      </div>
    </div>
  );
};