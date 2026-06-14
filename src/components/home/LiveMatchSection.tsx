import { useApiData } from '../../hooks/useApiData';
import { api } from '../../lib/api';
import { SkeletonLoader } from '../shared/SkeletonLoader';
import { getFlagCode } from '../../lib/flags';
import type { Match } from '../../types/api';

const formatMatchMinute = (utcDate: string) => {
  const start = new Date(utcDate);
  const now = new Date();
  const elapsed = Math.floor((now.getTime() - start.getTime()) / 60000);
  return `${elapsed}'`;
};

export const LiveMatchSection = () => {
  const { data, isLoading } = useApiData<{ matches: Match[] }>(
    ['home-matches'],
    () => api.getLiveMatches(),
    { refetchInterval: 120_000 }
  );

  const matches = data?.matches ?? [];
  const liveMatches = matches.filter(
    (m) => m.status === 'IN_PLAY' || m.status === 'PAUSED'
  );
  const match = liveMatches[0] ?? null;

  if (isLoading) return <SkeletonLoader variant="match" />;
  if (!match) return null;

  const homeScore = match.score.fullTime.home ?? match.score.halfTime.home ?? 0;
  const awayScore = match.score.fullTime.away ?? match.score.halfTime.away ?? 0;

  return (
    <div className="stadium-card flex flex-col border-t-4 border-fifa-red">
      <div className="bg-fifa-red text-white px-6 py-2 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 bg-white rounded-full animate-ping" />
          <span className="text-xs font-bold uppercase tracking-widest">
            {match.status === 'PAUSED' ? 'Entretiempo' : 'Partido en Vivo'}
          </span>
        </div>
        <span className="font-mono font-bold text-sm">
          {match.status === 'PAUSED' ? 'HT' : formatMatchMinute(match.utcDate)}
        </span>
      </div>

      <div className="p-8 md:p-12 flex items-center justify-around gap-4">
        <div className="flex flex-col items-center gap-4 group cursor-pointer">
          {getFlagCode(match.homeTeam) ? (
            <span className={`fi fi-${getFlagCode(match.homeTeam)} w-20 h-14 md:w-32 md:h-24 rounded-md drop-shadow-xl group-hover:scale-110 transition-transform`} title={match.homeTeam.name} />
          ) : match.homeTeam.crest ? (
            <img src={match.homeTeam.crest} className="w-20 h-20 md:w-32 md:h-32 drop-shadow-xl group-hover:scale-110 transition-transform" alt={match.homeTeam.name} />
          ) : (
            <div className="w-20 h-14 bg-slate-200 rounded-md" />
          )}
          <span className="headline-md uppercase">{match.homeTeam.shortName ?? match.homeTeam.name}</span>
        </div>

        <div className="flex flex-col items-center">
          <div className="flex items-center gap-8 mb-2">
            <span className="display-md text-fifa-blue dark:text-white">{homeScore}</span>
            <span className="text-slate-300 text-4xl">—</span>
            <span className="display-md text-fifa-blue dark:text-white">{awayScore}</span>
          </div>
        </div>

        <div className="flex flex-col items-center gap-4 group cursor-pointer">
          {getFlagCode(match.awayTeam) ? (
            <span className={`fi fi-${getFlagCode(match.awayTeam)} w-20 h-14 md:w-32 md:h-24 rounded-md drop-shadow-xl group-hover:scale-110 transition-transform`} title={match.awayTeam.name} />
          ) : match.awayTeam.crest ? (
            <img src={match.awayTeam.crest} className="w-20 h-20 md:w-32 md:h-32 drop-shadow-xl group-hover:scale-110 transition-transform" alt={match.awayTeam.name} />
          ) : (
            <div className="w-20 h-14 bg-slate-200 rounded-md" />
          )}
          <span className="headline-md uppercase">{match.awayTeam.shortName ?? match.awayTeam.name}</span>
        </div>
      </div>

      {match.venue && (
        <div className="bg-slate-50 dark:bg-slate-900/50 p-4 flex justify-center gap-8 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
            <span className="opacity-50">🏟️</span> {match.venue}
          </div>
        </div>
      )}
    </div>
  );
};
