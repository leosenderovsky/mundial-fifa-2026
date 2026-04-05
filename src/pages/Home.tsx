import { SEO } from '../components/shared/SEO';
import { ErrorBoundary } from '../components/shared/ErrorBoundary';
import { CountdownTimer } from '../components/shared/CountdownTimer';
import { HeroSection } from '../components/home/HeroSection';
import { LiveMatchSection } from '../components/home/LiveMatchSection';
import { ResultsStrip } from '../components/home/ResultsStrip';
import { GroupsSummary } from '../components/home/GroupsSummary';
import { VenuesPreview } from '../components/home/VenuesPreview';
import { TopScorers } from '../components/home/TopScorers';
import { TournamentGuideSection } from '../components/home/TournamentGuideSection';
import { KeyDatesSection } from '../components/home/KeyDatesSection';
import { FanRouteSection } from '../components/home/FanRouteSection';
import { VenueStoriesSection } from '../components/home/VenueStoriesSection';
import { FollowWorldCupSection } from '../components/home/FollowWorldCupSection';
import { useApiData } from '../hooks/useApiData';
import { api } from '../lib/api';
import type { Match } from '../types/api';

export default function Home() {
  const { data: matchesData, error: matchesError, isLoading: matchesLoading } = useApiData<{ matches: Match[] }>(
    ['home-matches', '2026-06-01', '2026-07-31'],
    () => api.getMatches({ dateFrom: '2026-06-01', dateTo: '2026-07-31' }),
    { staleTime: 1000 * 60 * 10 }
  );
  const matches = matchesData?.matches ?? [];
  const tournamentWindowStart = new Date('2026-06-01T00:00:00Z');
  const tournamentWindowEnd = new Date('2026-07-31T23:59:59Z');
  const hasTournamentData = matches.some((match) => {
    if (!match.matchday || match.matchday < 1) return false;
    const matchDate = new Date(match.utcDate);
    return matchDate >= tournamentWindowStart && matchDate <= tournamentWindowEnd;
  });

  const tournamentStart = new Date('2026-06-11T00:00:00Z');
  const now = new Date();
  const isPreTournament = now < tournamentStart;

  return (
    <main className="relative min-h-screen pb-20 md:pb-0">
      <SEO
        title="Inicio"
        description="El portal oficial del Mundial FIFA 2026. Seguí a tus selecciones favoritas y viví la pasión del fútbol mundial."
        keywords="mundial, fifa 2026, futbol en vivo, copa del mundo, world cup results"
      />

      <HeroSection />

      <div className="container mx-auto px-4 -mt-24 relative z-10 space-y-20 pb-20">
        <VenuesPreview />

        {(isPreTournament || (!hasTournamentData && !matchesLoading)) && (
          <>
            {matchesError && (
              <div className="stadium-card border border-red-200 dark:border-red-900/40 bg-red-50/80 dark:bg-red-950/30 p-4 text-sm text-red-700 dark:text-red-300">
                No pudimos cargar los datos del Mundial. Revisá la API y volvé a intentar.
              </div>
            )}
            <div className="text-center p-8 stadium-card border border-fifa-blue/20 bg-fifa-blue/10 mb-8 mt-8">
              <h3 className="headline-md uppercase text-fifa-blue dark:text-fifa-gold mb-6">
                El torneo comienza el 11 de junio de 2026. ¡Quedan:
              </h3>
              <CountdownTimer />
            </div>
            <TournamentGuideSection />
            <KeyDatesSection />
            <FanRouteSection />
            <VenueStoriesSection />
            <FollowWorldCupSection />
          </>
        )}

        {!isPreTournament && hasTournamentData && !matchesError && (
          <>
            <ErrorBoundary>
              <LiveMatchSection />
            </ErrorBoundary>

            <section>
              <div className="flex justify-between items-end mb-8">
                <div>
                  <span className="label-caps mb-2 block">Ayer</span>
                  <h2 className="headline-lg text-fifa-blue dark:text-white uppercase">Últimos Resultados</h2>
                </div>
                <button className="text-sm font-bold uppercase tracking-widest flex items-center gap-2 hover:text-fifa-blue transition-colors">
                  Ver todos <span>→</span>
                </button>
              </div>
              <ResultsStrip />
            </section>

            <section>
              <h2 className="headline-lg text-fifa-blue dark:text-white uppercase mb-8">Grupos en Resumen</h2>
              <GroupsSummary />
            </section>

            <section>
              <div className="flex items-center gap-3 mb-8">
                <span className="text-fifa-red">⚡</span>
                <h2 className="headline-lg text-fifa-blue dark:text-white uppercase">Máximos Goleadores</h2>
              </div>
              <TopScorers />
            </section>
          </>
        )}
      </div>
    </main>
  );
}
