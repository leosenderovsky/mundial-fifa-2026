import { SEO } from '../components/shared/SEO';
import { ErrorBoundary } from '../components/shared/ErrorBoundary';
import { CountdownTimer, getDaysToTournament } from '../components/shared/CountdownTimer';
import { HeroSection } from '../components/home/HeroSection';
import { LiveMatchSection } from '../components/home/LiveMatchSection';
import { ResultsStrip } from '../components/home/ResultsStrip';
import { GroupsSummary } from '../components/home/GroupsSummary';
import { VenuesPreview } from '../components/home/VenuesPreview';
import { TopScorers } from '../components/home/TopScorers';
import { TournamentGuideSection } from '../components/home/TournamentGuideSection';
import { KeyDatesSection } from '../components/home/KeyDatesSection';
import { NewsSection } from '../components/home/NewsSection';
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

  const tournamentStart = new Date(2026, 5, 11);
  const now = new Date();
  const isPreTournament = now < tournamentStart;
  const daysLeft = getDaysToTournament();

  return (
    <main className="relative min-h-screen pb-20 md:pb-0">
      <SEO
        title="Inicio"
        description="El portal oficial del Mundial FIFA 2026. Seguí a tus selecciones favoritas y viví la pasión del fútbol."
        keywords="mundial, fifa 2026, copa del mundo, world cup results, sedes 2026"
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
            
            <section className="stadium-card overflow-hidden shadow-2xl border-none">
              <div className="bg-gradient-to-r from-fifa-blue to-blue-900 p-8 text-white flex flex-col md:flex-row justify-between items-center gap-8">
                <div className="text-center md:text-left">
                  <h3 className="headline-md uppercase mb-3 leading-tight">El torneo comienza el <br /> 11 de junio de 2026</h3>
                  <div className="flex justify-center md:justify-start items-center gap-2">
                    <span className="bg-fifa-gold text-fifa-blue text-[10px] font-black px-3 py-1 rounded-sm uppercase tracking-widest shadow-lg">
                      Faltan {daysLeft} días
                    </span>
                  </div>
                </div>
                <CountdownTimer variant="site" />
              </div>
              <div className="bg-white dark:bg-slate-800/50 p-6 flex flex-wrap justify-center gap-x-12 gap-y-4 border-t border-slate-100 dark:border-slate-800 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                <div className="flex items-center gap-3">
                  <span className="text-fifa-blue dark:text-fifa-gold text-lg">⚽</span> 104 Partidos
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-fifa-blue dark:text-fifa-gold text-lg">🏟️</span> 16 Estadios
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-fifa-blue dark:text-fifa-gold text-lg">🌍</span> 48 Selecciones
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-fifa-blue dark:text-fifa-gold text-lg">🏆</span> Final 19 Julio
                </div>
              </div>
            </section>

            <TournamentGuideSection />
            <KeyDatesSection />
            <ErrorBoundary>
              <NewsSection />
            </ErrorBoundary>
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

            <ErrorBoundary>
              <NewsSection />
            </ErrorBoundary>
          </>
        )}
      </div>
    </main>
  );
}

