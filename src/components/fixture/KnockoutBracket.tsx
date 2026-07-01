import type { Match } from '../../types/api';
import { getFlagCode } from '../../lib/flags';
import { Link } from 'react-router-dom';
import { getTeamLink } from '../../lib/teamLinks';
import { proxiedImage } from '../../lib/imageProxy';
import { cn } from '../../lib/utils';
import {
  normalizeStage,
  STAGE_LABELS,
  STAGE_PROGRESSION as stageOrder,
} from '../../lib/knockoutUtils';

interface KnockoutBracketProps {
  matches: Match[];
  isLoading?: boolean;
  errorMessage?: string | null;
  isStaticData?: boolean;
}

const formatKickoff = (utcDate: string) =>
  new Date(utcDate).toLocaleDateString('es-AR', {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  }).toUpperCase();

const TeamFlag = ({ team }: { team: Match['homeTeam'] }) => {
  if (getFlagCode(team)) {
    return <span className={`fi fi-${getFlagCode(team)} w-6 h-4 rounded-sm`} title={team.name} aria-label={team.name} />;
  }
  if (team.crest) {
    return <img src={proxiedImage(team.crest)} alt={team.name} className="w-6 h-6 object-contain" />;
  }
  return <div className="w-6 h-4 bg-slate-200 dark:bg-slate-700 rounded-sm" />;
};

export const KnockoutBracket = ({ matches, isLoading, errorMessage, isStaticData }: KnockoutBracketProps) => {
  if (isLoading) {
    return (
      <div className="stadium-card p-10 text-center text-sm text-slate-500">
        Cargando fase eliminatoria…
      </div>
    );
  }

  if (errorMessage && !matches.length) {
    return (
      <div className="stadium-card p-10 text-center text-sm text-slate-500">
        No se pudo cargar la fase eliminatoria. Intenta de nuevo en unos momentos.
      </div>
    );
  }

  if (!matches.length) {
    return (
      <div className="stadium-card p-10 text-center text-sm text-slate-500">
        La fase eliminatoria aún no está disponible en la API.
      </div>
    );
  }

  // Agrupar normalizando los stage names de la API
  const grouped = matches.reduce<Record<string, Match[]>>((acc, match) => {
    const canonical = normalizeStage(match.stage);
    acc[canonical] = acc[canonical] ? [...acc[canonical], match] : [match];
    return acc;
  }, {});

  const hasResults = stageOrder.some((s) => grouped[s]?.length);

  if (!hasResults) {
    return (
      <div className="stadium-card p-10 text-center text-sm text-slate-500">
        Los partidos eliminatorios están siendo procesados. Actualizando…
      </div>
    );
  }

  return (
    <div className="space-y-10 min-w-[900px]">
      {isStaticData && (
        <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-widest font-bold mb-4">
          Cuadro eliminatorio según formato oficial FIFA 2026 — equipos clasificados en curso
        </p>
      )}

      {stageOrder.filter((stage) => grouped[stage]?.length).map((stage) => (
        <div key={stage} className="stadium-card p-6">
          <h3 className="font-headline font-bold uppercase text-fifa-blue dark:text-white mb-6 text-lg tracking-wide">
            {STAGE_LABELS[stage] ?? stage}
          </h3>

          <div className={cn(
            'grid gap-4',
            stage === 'LAST_32' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-2' :
            stage === 'LAST_16' ? 'grid-cols-1 md:grid-cols-2' :
            'grid-cols-1 md:grid-cols-2'
          )}>
            {grouped[stage]
              .slice()
              .sort((a, b) => a.utcDate.localeCompare(b.utcDate))
              .map((match) => {
                const isFinished  = match.status === 'FINISHED';
                const isLive      = match.status === 'IN_PLAY' || match.status === 'PAUSED';
                const isScheduled = match.status === 'SCHEDULED' || match.status === 'TIMED';
                const isTBD       = !match.homeTeam.crest && !getFlagCode(match.homeTeam);

                return (
                  <div
                    key={match.id}
                    className={cn(
                      'flex items-center justify-between p-4 rounded-xl border transition-all',
                      isLive
                        ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
                        : isFinished
                          ? 'bg-slate-50 dark:bg-slate-900/60 border-slate-200 dark:border-slate-700'
                          : 'bg-white dark:bg-slate-900/40 border-slate-100 dark:border-slate-800'
                    )}
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      {isTBD ? (
                        <div className="w-6 h-4 bg-slate-200 dark:bg-slate-700 rounded-sm shrink-0" />
                      ) : (
                        <Link to={getTeamLink(match.homeTeam)} className="hover:scale-110 transition-transform shrink-0">
                          <TeamFlag team={match.homeTeam} />
                        </Link>
                      )}
                      <span className={cn(
                        'font-bold text-sm truncate',
                        isTBD && 'text-slate-400 dark:text-slate-500 italic'
                      )}>
                        {match.homeTeam.name}
                      </span>
                    </div>

                    <div className="text-center px-3 min-w-[100px] shrink-0">
                      {isFinished || isLive ? (
                        <>
                          <span className={cn(
                            'text-base font-mono font-bold block',
                            isLive && 'text-fifa-red animate-pulse'
                          )}>
                            {match.score.fullTime.home ?? '-'}
                            {' — '}
                            {match.score.fullTime.away ?? '-'}
                          </span>
                          <span className="block text-[10px] text-slate-400 uppercase tracking-widest mt-0.5">
                            {isLive ? '🔴 En vivo' : 'Finalizado'}
                          </span>
                        </>
                      ) : isScheduled ? (
                        <>
                          <span className="text-xs font-mono font-bold text-slate-600 dark:text-slate-300 block">
                            {formatKickoff(match.utcDate)}
                          </span>
                          <span className="block text-[10px] text-slate-400 uppercase tracking-widest mt-0.5">
                            Programado
                          </span>
                        </>
                      ) : (
                        <span className="text-sm font-mono text-slate-300 dark:text-slate-600">vs</span>
                      )}
                    </div>

                    <div className="flex items-center gap-3 flex-1 min-w-0 justify-end">
                      <span className={cn(
                        'font-bold text-sm truncate text-right',
                        isTBD && 'text-slate-400 dark:text-slate-500 italic'
                      )}>
                        {match.awayTeam.name}
                      </span>
                      {isTBD ? (
                        <div className="w-6 h-4 bg-slate-200 dark:bg-slate-700 rounded-sm shrink-0" />
                      ) : (
                        <Link to={getTeamLink(match.awayTeam)} className="hover:scale-110 transition-transform shrink-0">
                          <TeamFlag team={match.awayTeam} />
                        </Link>
                      )}
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
