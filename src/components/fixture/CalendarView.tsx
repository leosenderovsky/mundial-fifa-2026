import type { Match } from '../../types/api';

interface CalendarViewProps {
  matches: Match[];
  isLoading?: boolean;
}

const formatDateHeader = (utcDate: string) =>
  new Date(utcDate).toLocaleDateString('es-AR', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
  });

const formatKickoff = (utcDate: string) =>
  new Date(utcDate).toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' });

export const CalendarView = ({ matches, isLoading }: CalendarViewProps) => {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-6 text-center">
        <div className="w-20 h-20 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center animate-pulse" />
        <p className="text-slate-500 dark:text-slate-400 text-sm">Cargando calendario...</p>
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
      {orderedDates.map((date) => (
        <div key={date} className="stadium-card p-6">
          <h3 className="font-headline font-bold uppercase text-fifa-blue dark:text-white mb-4">
            {formatDateHeader(`${date}T00:00:00Z`)}
          </h3>
          <div className="space-y-3">
            {grouped[date].map((match) => (
              <div key={match.id} className="flex items-center justify-between p-4 bg-white dark:bg-slate-900/60 rounded-xl">
                <div className="flex items-center gap-4">
                  {match.homeTeam.crest ? (
                    <img src={match.homeTeam.crest} alt={match.homeTeam.name} className="w-8 h-8 object-contain" />
                  ) : (
                    <div className="w-8 h-8 bg-slate-200 rounded" />
                  )}
                  <span className="font-bold text-sm">{match.homeTeam.name}</span>
                </div>
                <div className="text-center min-w-[80px]">
                  <span className="text-xs font-mono">{formatKickoff(match.utcDate)}</span>
                  <span className="block text-[10px] text-slate-400 uppercase">{match.group ?? match.stage}</span>
                </div>
                <div className="flex items-center gap-4 justify-end">
                  <span className="font-bold text-sm">{match.awayTeam.name}</span>
                  {match.awayTeam.crest ? (
                    <img src={match.awayTeam.crest} alt={match.awayTeam.name} className="w-8 h-8 object-contain" />
                  ) : (
                    <div className="w-8 h-8 bg-slate-200 rounded" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
