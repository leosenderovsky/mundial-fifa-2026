import type { Match } from '../../types/api';
import { getFlagCode } from '../../lib/flags';
import { Link } from 'react-router-dom';
import { getTeamLink } from '../../lib/teamLinks';
import { proxiedImage } from '../../lib/imageProxy';
import { cn } from '../../lib/utils';

interface KnockoutBracketProps {
  matches: Match[];
  isLoading?: boolean;
  errorMessage?: string | null;
  isStaticData?: boolean;
}

const STAGE_LABELS: Record<string, string> = {
  LAST_32: 'Ronda de 32',
  LAST_16: 'Octavos de Final',
  QUARTER_FINALS: 'Cuartos de Final',
  SEMI_FINALS: 'Semifinales',
  THIRD_PLACE: 'Tercer Puesto',
  FINAL: 'Final',
};

const stageOrder = Object.keys(STAGE_LABELS);

const formatKickoff = (utcDate: string) =>
  new Date(utcDate).toLocaleDateString('es-AR', { day: '2-digit', month: 'short' }).toUpperCase();

const TeamFlag = ({ team }: { team: Match['homeTeam'] }) => {
  if (getFlagCode(team)) {
    return <span className={`fi fi-${getFlagCode(team)} w-6 h-4 rounded-sm`} title={team.name} aria-label={team.name} />;
  }
  if (team.crest) {
    return <img src={proxiedImage(team.crest)} alt={team.name} className="w-6 h-6 object-contain" />;
  }
  return <div className="w-6 h-6 bg-slate-200 rounded" />;
};

export const KnockoutBracket = ({ matches, isLoading, errorMessage, isStaticData }: KnockoutBracketProps) => {
  if (isLoading) {
    return (
      <div className="stadium-card p-10 text-center text-sm text-slate-500">
        Cargando fase eliminatoria...
      </div>
    );
  }

  if (errorMessage) {
    return (
      <div className="stadium-card p-10 text-center text-sm text-slate-500">
        No se pudo cargar la fase eliminatoria por un error de API.
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

  const grouped = matches.reduce<Record<string, Match[]>>((acc, match) => {
    acc[match.stage] = acc[match.stage] ? [...acc[match.stage], match] : [match];
    return acc;
  }, {});

  return (
    <div className="space-y-10 min-w-[900px]">
      {isStaticData && (
        <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-widest font-bold mb-4">
          Cuadro eliminatorio según formato oficial — equipos por definir al cierre de grupos
        </p>
      )}
      {stageOrder.filter((stage) => grouped[stage]?.length).map((stage) => (
        <div key={stage} className="stadium-card p-6">
          <h3 className="font-headline font-bold uppercase text-fifa-blue dark:text-white mb-6">
            {STAGE_LABELS[stage]}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {grouped[stage].map((match) => {
              const isFinished = match.status === 'FINISHED';
              const isLive = match.status === 'IN_PLAY' || match.status === 'PAUSED';
              const isScheduled = match.status === 'SCHEDULED' || match.status === 'TIMED';

              return (
                <div key={match.id} className="flex items-center justify-between p-4 bg-white dark:bg-slate-900/60 rounded-xl">
                  <div className="flex items-center gap-3">
                    <Link to={getTeamLink(match.homeTeam)} className="hover:scale-110 transition-transform">
                      <TeamFlag team={match.homeTeam} />
                    </Link>
                    <span className="font-bold text-sm truncate max-w-[120px]">{match.homeTeam.name}</span>
                  </div>
                  <div className="text-center min-w-[80px]">
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
                      {isLive ? 'En vivo' : isFinished ? 'Finalizado' : match.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-sm truncate max-w-[120px]">{match.awayTeam.name}</span>
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
