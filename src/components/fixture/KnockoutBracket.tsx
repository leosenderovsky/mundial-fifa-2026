import type { Match } from '../../types/api';
import { getFlagCode } from '../../lib/flags';
import { Link } from 'react-router-dom';
import { getTeamLink } from '../../lib/teamLinks';

interface KnockoutBracketProps {
  matches: Match[];
  isLoading?: boolean;
  errorMessage?: string | null;
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

export const KnockoutBracket = ({ matches, isLoading, errorMessage }: KnockoutBracketProps) => {
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

  const knockoutMatches = matches.filter((match) => match.stage !== 'GROUP_STAGE');
  if (!knockoutMatches.length) {
    return (
      <div className="stadium-card p-10 text-center text-sm text-slate-500">
        La fase eliminatoria aún no está disponible en la API.
      </div>
    );
  }

  const grouped = knockoutMatches.reduce<Record<string, Match[]>>((acc, match) => {
    acc[match.stage] = acc[match.stage] ? [...acc[match.stage], match] : [match];
    return acc;
  }, {});

  return (
    <div className="space-y-10 min-w-[900px]">
      {stageOrder.filter((stage) => grouped[stage]?.length).map((stage) => (
        <div key={stage} className="stadium-card p-6">
          <h3 className="font-headline font-bold uppercase text-fifa-blue dark:text-white mb-6">
            {STAGE_LABELS[stage]}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {grouped[stage].map((match) => (
              <div key={match.id} className="flex items-center justify-between p-4 bg-white dark:bg-slate-900/60 rounded-xl">
                <div className="flex items-center gap-3">
                  <Link to={getTeamLink(match.homeTeam)} className="hover:scale-110 transition-transform">
                    {getFlagCode(match.homeTeam) ? (
                      <span
                        className={`fi fi-${getFlagCode(match.homeTeam)} w-6 h-4 rounded-sm`}
                        title={match.homeTeam.name}
                        aria-label={match.homeTeam.name}
                      />
                    ) : match.homeTeam.crest ? (
                      <img src={match.homeTeam.crest} alt={match.homeTeam.name} className="w-6 h-6 object-contain" />
                    ) : (
                      <div className="w-6 h-6 bg-slate-200 rounded" />
                    )}
                  </Link>
                  <span className="sr-only">{match.homeTeam.name}</span>
                </div>
                <div className="text-center">
                  <span className="text-xs font-mono">{formatKickoff(match.utcDate)}</span>
                  <span className="block text-[10px] text-slate-400 uppercase">{match.status}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="sr-only">{match.awayTeam.name}</span>
                  <Link to={getTeamLink(match.awayTeam)} className="hover:scale-110 transition-transform">
                    {getFlagCode(match.awayTeam) ? (
                      <span
                        className={`fi fi-${getFlagCode(match.awayTeam)} w-6 h-4 rounded-sm`}
                        title={match.awayTeam.name}
                        aria-label={match.awayTeam.name}
                      />
                    ) : match.awayTeam.crest ? (
                      <img src={match.awayTeam.crest} alt={match.awayTeam.name} className="w-6 h-6 object-contain" />
                    ) : (
                      <div className="w-6 h-6 bg-slate-200 rounded" />
                    )}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
