import { motion } from 'framer-motion';
import { useApiData } from '../../hooks/useApiData';
import { api } from '../../lib/api';
import { getFlagCode } from '../../lib/flags';
import { Link } from 'react-router-dom';
import { getTeamLink } from '../../lib/teamLinks';
import type { Match } from '../../types/api';

export const ResultsStrip = () => {
  const { data, isLoading } = useApiData<{ matches: Match[] }>(
    ['home-recent-results'],
    () => api.getLiveMatches(),
    { staleTime: 60_000 }
  );

  const matches = data?.matches ?? [];
  const recentMatches = matches
    .filter((m) => m.status === 'FINISHED')
    .sort((a, b) => new Date(b.utcDate).getTime() - new Date(a.utcDate).getTime())
    .slice(0, 6);

  if (isLoading || recentMatches.length === 0) return null;

  return (
    <div className="flex gap-4 overflow-x-auto pb-4 snap-x no-scrollbar">
      {recentMatches.map((match) => {
        const homeScore = match.score.fullTime.home ?? '-';
        const awayScore = match.score.fullTime.away ?? '-';

        return (
          <motion.div
            key={match.id}
            whileHover={{ y: -5 }}
            className="stadium-card min-w-[280px] p-4 flex justify-between items-center snap-center border border-slate-100 dark:border-slate-800"
          >
            <div className="flex flex-col gap-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase">
                {match.group ? match.group.replace('GROUP_', 'Grupo ') : match.stage}
              </span>
              <div className="flex items-center gap-3">
                <Link to={getTeamLink(match.homeTeam)} className="hover:scale-110 transition-transform">
                  {getFlagCode(match.homeTeam) ? (
                    <span className={`fi fi-${getFlagCode(match.homeTeam)} w-6 h-4 rounded-sm`} />
                  ) : match.homeTeam.crest ? (
                    <img src={match.homeTeam.crest} alt={match.homeTeam.name} className="w-6 h-4 object-contain" />
                  ) : (
                    <div className="w-6 h-4 bg-slate-200 rounded-sm" />
                  )}
                </Link>
                <span className="font-bold text-sm uppercase">{match.homeTeam.shortName ?? match.homeTeam.name}</span>
              </div>
              <div className="flex items-center gap-3">
                <Link to={getTeamLink(match.awayTeam)} className="hover:scale-110 transition-transform">
                  {getFlagCode(match.awayTeam) ? (
                    <span className={`fi fi-${getFlagCode(match.awayTeam)} w-6 h-4 rounded-sm`} />
                  ) : match.awayTeam.crest ? (
                    <img src={match.awayTeam.crest} alt={match.awayTeam.name} className="w-6 h-4 object-contain" />
                  ) : (
                    <div className="w-6 h-4 bg-slate-200 rounded-sm" />
                  )}
                </Link>
                <span className="font-bold text-sm uppercase">{match.awayTeam.shortName ?? match.awayTeam.name}</span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-[10px] font-bold text-fifa-red uppercase block mb-1">Finalizado</span>
              <span className="stat-lg text-2xl tracking-normal">{homeScore} - {awayScore}</span>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};
