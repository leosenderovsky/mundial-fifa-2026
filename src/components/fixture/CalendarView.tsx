import type { Match } from '../../types/api';
import { getFlagCode } from '../../lib/flags';
import { Link } from 'react-router-dom';
import { getTeamLink } from '../../lib/teamLinks';
import { proxiedImage } from '../../lib/imageProxy';
import { cn } from '../../lib/utils';

interface CalendarViewProps {
  matches: Match[];
  isLoading?: boolean;
  errorMessage?: string | null;
  isStaticData?: boolean;
}

const formatDateHeader = (utcDate: string) =>
  new Date(utcDate).toLocaleDateString('es-AR', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
  });

const formatKickoff = (utcDate: string) =>
  new Date(utcDate).toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' });

const TeamFlag = ({ team }: { team: Match['homeTeam'] }) => {
  if (getFlagCode(team)) {
    return <span className={`fi fi-${getFlagCode(team)} w-8 h-6 rounded-sm`} title={team.name} aria-label={team.name} />;
  }
  if (team.crest) {
    return <img src={proxiedImage(team.crest)} alt={team.name} className="w-8 h-8 object-contain" />;
  }
  return <div className="w-8 h-8 bg-slate-200 rounded" />;
};

export const CalendarView = ({ matches, isLoading, errorMessage, isStaticData }: CalendarViewProps) => {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-6 text-center">
        <div className="w-20 h-20 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center animate-pulse" />
        <p className="text-slate-500 dark:text-slate-400 text-sm">Cargando calendario...</p>
      </div>
    );
  }

  if (errorMessage) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-6 text-center">
        <div className="w-20 h-20 rounded-full bg-red-50 dark:bg-red-900/20 flex items-center justify-center">
          <span className="text-red-500 text-3xl">⚠</span>
        </div>
        <div>
          <h3 className="font-headline font-bold text-xl uppercase tracking-tight mb-2">
            No pudimos cargar el calendario
          </h3>
          <p className="text-slate-500 dark:text-slate-400 text-sm max-w-sm">
            Hubo un problema al consultar la API. Reintentá en unos minutos.
          </p>
        </div>
      </div>
    );
  }

  if (!matches.length) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-6 text-center">
        <div className="w-20 h-20 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
          <span className="text-slate-400 text-3xl">📅</span>
        </div>
        <div>
          <h3 className="font-headline font-bold text-xl uppercase tracking-tight mb-2">
            Calendario no disponible
          </h3>
          <p className="text-slate-500 dark:text-slate-400 text-sm max-w-sm">
            La API aún no publicó partidos del Mundial 2026 o los datos están restringidos.
          </p>
        </div>
      </div>
    );
  }

  const grouped = matches.reduce<Record<string, Match[]>>((acc, match) => {
    const key = match.utcDate.split('T')[0];
    acc[key] = acc[key] ? [...acc[key], match] : [match];
    return acc;
  }, {});

  const orderedDates = Object.keys(grouped).sort();

  return (
    <div className="space-y-10">
      {isStaticData && (
        <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-widest font-bold">
          Calendario basado en el sorteo oficial — 72 partidos de fase de grupos
        </p>
      )}
      {orderedDates.map((date) => (
        <div key={date} className="stadium-card p-6">
          <h3 className="font-headline font-bold uppercase text-fifa-blue dark:text-white mb-4">
            {formatDateHeader(`${date}T00:00:00Z`)}
          </h3>
          <div className="space-y-3">
            {grouped[date].map((match) => {
              const isFinished = match.status === 'FINISHED';
              const isLive = match.status === 'IN_PLAY' || match.status === 'PAUSED';
              const isScheduled = match.status === 'SCHEDULED' || match.status === 'TIMED';

              return (
                <div key={match.id} className="flex items-center justify-between p-4 bg-white dark:bg-slate-900/60 rounded-xl">
                  <div className="flex items-center gap-4">
                    <Link to={getTeamLink(match.homeTeam)} className="hover:scale-110 transition-transform">
                      <TeamFlag team={match.homeTeam} />
                    </Link>
                    <span className="font-bold text-sm">{match.homeTeam.name}</span>
                  </div>
                  <div className="text-center min-w-[100px]">
                    {isFinished || isLive ? (
                      <span className={cn(
                        "text-sm font-mono font-bold",
                        isLive && "text-fifa-red animate-pulse"
                      )}>
                        {match.score.fullTime.home ?? match.score.halfTime.home ?? '-'}
                        {' - '}
                        {match.score.fullTime.away ?? match.score.halfTime.away ?? '-'}
                      </span>
                    ) : isScheduled ? (
                      <span className="text-xs font-mono">{formatKickoff(match.utcDate)}</span>
                    ) : (
                      <span className="text-xs font-mono text-slate-400">vs</span>
                    )}
                    <span className="block text-[10px] text-slate-400 uppercase">
                      {match.group ? match.group.replace('GROUP_', 'Grupo ') : match.stage}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 justify-end">
                    <span className="font-bold text-sm">{match.awayTeam.name}</span>
                    <Link to={getTeamLink(match.awayTeam)} className="hover:scale-110 transition-transform">
                      <TeamFlag team={match.awayTeam} />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};
