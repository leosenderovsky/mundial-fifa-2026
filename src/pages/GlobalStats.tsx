import { Navigate } from 'react-router-dom';
import { useApiData } from '../hooks/useApiData';
import { api } from '../lib/api';
import { SEO } from '../components/shared/SEO';
import { Goal, HandCoins, ShieldCheck, BarChart3, TrendingUp } from 'lucide-react';
import { proxiedImage } from '../lib/imageProxy';
import { useStatsVisibility } from '../hooks/useStatsVisibility';
import type { Scorer } from '../types/api';
import type { Standing } from '../types/api';
import { STATIC_TOP_SCORERS } from '../data/worldCupResults';
import { getFlagCode } from '../lib/flags';

export default function GlobalStats() {
  const { isVisible, isTournamentStarted, isLoading: visibilityLoading } = useStatsVisibility();

  const { data: scorersData, isLoading: scorersLoading } = useApiData<{ scorers: Scorer[] }>(
    ['top-scorers'],
    () => api.getTopScorers(10),
    { enabled: isTournamentStarted }
  );

  const { data: standingsData, isLoading: standingsLoading } = useApiData<{ standings: Standing[] }>(
    ['standings'],
    () => api.getStandings(),
    { enabled: isTournamentStarted }
  );

  const { data: matchesData } = useApiData<{ matches: any[] }>(
    ['wc-matches-stats'],
    () => api.getAllMatches(),
    { enabled: isTournamentStarted }
  );

  if (!visibilityLoading && !isVisible) return <Navigate to="/" replace />;

  const scorers = scorersData?.scorers ?? [];
  const hasScorers = scorers.length > 0;

  // Top assists from scorers endpoint
  const topAssists = [...scorers]
    .filter((s) => (s.assists ?? 0) > 0)
    .sort((a, b) => (b.assists ?? 0) - (a.assists ?? 0))
    .slice(0, 5);

  // Teams sorted by goals scored from standings
  const allTeams: any[] = [];
  (standingsData?.standings ?? []).forEach((group) => {
    group.table?.forEach((entry: any) => allTeams.push(entry));
  });
  const topGoalsTeams = [...allTeams]
    .sort((a, b) => b.goalsFor - a.goalsFor)
    .slice(0, 5);

  // Teams with most wins
  const topWinTeams = [...allTeams]
    .sort((a, b) => b.won - a.won || b.goalsFor - a.goalsFor)
    .slice(0, 5);

  // Matches played count
  const finishedMatches = (matchesData?.matches ?? []).filter((m: any) => m.status === 'FINISHED');
  const totalGoals = finishedMatches.reduce((acc: number, m: any) => {
    return acc + (m.score?.fullTime?.home ?? 0) + (m.score?.fullTime?.away ?? 0);
  }, 0);
  const avgGoals = finishedMatches.length > 0
    ? (totalGoals / finishedMatches.length).toFixed(2)
    : null;

  // Use static data for scorers if API hasn't returned anything
  const displayScorers = hasScorers
    ? scorers.slice(0, 5)
    : STATIC_TOP_SCORERS.slice(0, 5).map((s) => ({
        player: { name: s.playerName, nationality: s.teamName },
        team: { name: s.teamName, shortName: s.teamShortName },
        goals: s.goals,
        assists: s.assists,
        playedMatches: 1,
      }));

  const isLoading = scorersLoading || standingsLoading;

  return (
    <div className="min-h-screen bg-surface-canvas pt-12 pb-24 px-4 md:px-8">
      <SEO
        title="Estadísticas Globales"
        description="Goleadores, asistidores, mejores equipos y resumen del torneo del Mundial FIFA 2026."
        keywords="estadisticas mundial, goleadores mundial 2026, tabla goleadores fifa"
        jsonLd={[
          {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              {
                "@type": "ListItem",
                "position": 1,
                "name": "Inicio",
                "item": "https://mundial-fifa-2026.netlify.app/",
              },
              {
                "@type": "ListItem",
                "position": 2,
                "name": "Estadísticas Globales",
                "item": "https://mundial-fifa-2026.netlify.app/stats",
              },
            ],
          },
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
              {
                "@type": "Question",
                "name": "¿Quién es el goleador del Mundial 2026?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "El goleador del Mundial FIFA 2026 se actualiza en tiempo real en esta página con los datos oficiales del torneo.",
                },
              },
              {
                "@type": "Question",
                "name": "¿Cuántos goles se marcaron en el Mundial 2026?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "El total de goles del Mundial FIFA 2026 se actualiza partido a partido. El promedio histórico de los Mundiales modernos es de aproximadamente 2.6 goles por partido.",
                },
              },
            ],
          },
        ]}
      />
      <div className="container mx-auto space-y-8">
        <header className="flex flex-col md:flex-row justify-between items-end gap-6 mb-12">
          <div>
            <span className="label-caps flex items-center gap-2 mb-2">
              <span className="w-2 h-2 bg-fifa-red rounded-full animate-pulse" />
              Actualizado en Tiempo Real
            </span>
            <h1 className="display-md text-fifa-blue dark:text-white leading-none">
              Estadísticas <br /> Globales
            </h1>
          </div>

          {/* Summary cards */}
          {!isLoading && finishedMatches.length > 0 && (
            <div className="flex gap-4">
              <div className="stadium-card px-6 py-4 text-center min-w-[100px]">
                <p className="text-3xl font-black font-mono text-white">{finishedMatches.length}</p>
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mt-1">Partidos</p>
              </div>
              <div className="stadium-card px-6 py-4 text-center min-w-[100px]">
                <p className="text-3xl font-black font-mono text-fifa-gold">{totalGoals}</p>
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mt-1">Goles</p>
              </div>
              {avgGoals && (
                <div className="stadium-card px-6 py-4 text-center min-w-[100px]">
                  <p className="text-3xl font-black font-mono text-white">{avgGoals}</p>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mt-1">Prom/PJ</p>
                </div>
              )}
            </div>
          )}
        </header>

        {/* Grid de tablas */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* Máximos Goleadores */}
          <div className="stadium-card p-8">
            <div className="flex justify-between items-center mb-8">
              <h3 className="headline-md uppercase flex items-center gap-3">
                <Goal className="text-fifa-blue" size={20} /> Máximos Goleadores
              </h3>
            </div>
            <StatsTable
              rows={displayScorers.map((s, i) => ({
                rank: i + 1,
                name: s.player.name,
                team: s.team.shortName ?? s.team.name,
                crest: (s.team as any).crest,
                flagTeam: s.team as any,
                primary: s.goals,
                primaryLabel: 'Goles',
                secondary: s.assists ?? 0,
                secondaryLabel: 'Asist.',
                tertiary: s.playedMatches,
                tertiaryLabel: 'PJ',
              }))}
            />
          </div>

          {/* Máximos Asistidores */}
          <div className="stadium-card p-8">
            <div className="flex justify-between items-center mb-8">
              <h3 className="headline-md uppercase flex items-center gap-3">
                <HandCoins className="text-fifa-gold" size={20} /> Máximos Asistidores
              </h3>
            </div>
            {topAssists.length > 0 ? (
              <StatsTable
                rows={topAssists.map((s, i) => ({
                  rank: i + 1,
                  name: s.player.name,
                  team: s.team.shortName ?? s.team.name,
                  crest: (s.team as any).crest,
                  flagTeam: s.team as any,
                  primary: s.assists ?? 0,
                  primaryLabel: 'Asist.',
                  secondary: s.goals,
                  secondaryLabel: 'Goles',
                  tertiary: s.playedMatches,
                  tertiaryLabel: 'PJ',
                }))}
              />
            ) : (
              <EmptyPlaceholder text="Los asistidores aparecerán aquí una vez que la API publique esos datos." />
            )}
          </div>

          {/* Equipos más goleadores */}
          <div className="stadium-card p-8">
            <div className="flex justify-between items-center mb-8">
              <h3 className="headline-md uppercase flex items-center gap-3">
                <TrendingUp className="text-fifa-blue" size={20} /> Equipos Más Goleadores
              </h3>
            </div>
            {topGoalsTeams.length > 0 ? (
              <StatsTable
                rows={topGoalsTeams.map((e, i) => ({
                  rank: i + 1,
                  name: e.team?.name ?? '—',
                  team: e.team?.shortName ?? e.team?.tla ?? '',
                  crest: e.team?.crest,
                  flagTeam: e.team,
                  primary: e.goalsFor,
                  primaryLabel: 'Goles',
                  secondary: e.goalsAgainst,
                  secondaryLabel: 'Recibidos',
                  tertiary: e.playedGames,
                  tertiaryLabel: 'PJ',
                }))}
              />
            ) : (
              <EmptyPlaceholder text="Las estadísticas por equipo estarán disponibles cuando la API publique datos de grupos." />
            )}
          </div>

          {/* Mejores equipos por victorias */}
          <div className="stadium-card p-8">
            <div className="flex justify-between items-center mb-8">
              <h3 className="headline-md uppercase flex items-center gap-3">
                <ShieldCheck className="text-green-400" size={20} /> Líderes por Victorias
              </h3>
            </div>
            {topWinTeams.length > 0 ? (
              <StatsTable
                rows={topWinTeams.map((e, i) => ({
                  rank: i + 1,
                  name: e.team?.name ?? '—',
                  team: e.team?.tla ?? '',
                  crest: e.team?.crest,
                  flagTeam: e.team,
                  primary: e.won,
                  primaryLabel: 'Victorias',
                  secondary: e.draw,
                  secondaryLabel: 'Empates',
                  tertiary: e.lost,
                  tertiaryLabel: 'Derrotas',
                }))}
              />
            ) : (
              <EmptyPlaceholder text="Las posiciones por victorias estarán disponibles cuando comiencen los partidos." />
            )}
          </div>

        </div>
      </div>
    </div>
  );
}

// ── Componente tabla reutilizable ─────────────────────────────────────────────
interface StatsRow {
  rank: number;
  name: string;
  team: string;
  crest?: string;
  flagTeam?: any;
  primary: number;
  primaryLabel: string;
  secondary?: number;
  secondaryLabel?: string;
  tertiary?: number;
  tertiaryLabel?: string;
}

function StatsTable({ rows }: { rows: StatsRow[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 dark:border-slate-800">
          <tr>
            <th className="text-left pb-4 w-8">#</th>
            <th className="text-left pb-4">Jugador / Equipo</th>
            <th className="text-center pb-4">{rows[0]?.primaryLabel}</th>
            {rows[0]?.secondaryLabel && <th className="text-center pb-4">{rows[0].secondaryLabel}</th>}
            {rows[0]?.tertiaryLabel && <th className="text-center pb-4">{rows[0].tertiaryLabel}</th>}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
          {rows.map((row) => {
            const flagCode = getFlagCode(row.flagTeam);
            return (
              <tr key={row.rank} className="group hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors">
                <td className="py-4 text-xs font-mono text-slate-400">{row.rank}</td>
                <td className="py-4 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden flex-shrink-0 flex items-center justify-center">
                    {row.crest ? (
                      <img src={proxiedImage(row.crest)} className="w-full h-full object-cover" alt={row.team} />
                    ) : flagCode ? (
                      <span className={`fi fi-${flagCode} w-6 h-4 rounded-sm`} />
                    ) : (
                      <BarChart3 size={14} className="text-slate-400" />
                    )}
                  </div>
                  <div>
                    <p className="font-bold text-sm leading-none mb-0.5">{row.name}</p>
                    <p className="text-[10px] text-slate-500 uppercase tracking-wide">{row.team}</p>
                  </div>
                </td>
                <td className="py-4 text-center font-mono font-bold text-xl">{row.primary}</td>
                {row.secondary !== undefined && (
                  <td className="py-4 text-center font-mono text-slate-500">{row.secondary}</td>
                )}
                {row.tertiary !== undefined && (
                  <td className="py-4 text-center font-mono text-xs text-slate-400">{row.tertiary ?? '—'}</td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function EmptyPlaceholder({ text }: { text: string }) {
  return (
    <div className="py-10 text-center text-sm text-slate-500 dark:text-slate-400 italic">{text}</div>
  );
}
