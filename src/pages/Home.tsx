import { SEO } from '../components/shared/SEO';
import { ErrorBoundary } from '../components/shared/ErrorBoundary';
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
import { AdBanner } from '../components/shared/AdBanner';

const TOURNAMENT_START = new Date(2026, 5, 11);

export default function Home() {
  const { data: matchesData, error: matchesError, isLoading: matchesLoading } = useApiData<{ matches: Match[] }>(
    ['home-matches'],
    () => api.getLiveMatches(),
    { staleTime: 60_000 }
  );
  const matches = matchesData?.matches ?? [];

  const liveMatches = matches.filter(
    (m) => m.status === 'IN_PLAY' || m.status === 'PAUSED'
  );
  const recentMatches = matches.filter((m) => m.status === 'FINISHED');
  const upcomingMatches = matches.filter(
    (m) => m.status === 'TIMED' || m.status === 'SCHEDULED'
  );

  const now = new Date();
  const isPreTournament = now < TOURNAMENT_START;
  const hasAnyMatchData = matches.length > 0;
  const showTournamentView = !isPreTournament && hasAnyMatchData;

  return (
    <main className="relative min-h-screen pb-20 md:pb-0">
      <SEO
        title="Inicio"
        description="El portal oficial del Mundial FIFA 2026. Seguí a tus selecciones favoritas y viví la pasión del fútbol."
        keywords="mundial, fifa 2026, copa del mundo, world cup results, sedes 2026"
      />

      <HeroSection />

      <div className="container mx-auto px-4 -mt-24 relative z-10 space-y-20 pb-20">
        <div className="w-full flex justify-center">
          <AdBanner slot="1111111111" format="horizontal" className="w-full max-w-4xl" />
        </div>
        <VenuesPreview />

        {showTournamentView && (
          <>
            <ErrorBoundary>
              <LiveMatchSection />
            </ErrorBoundary>

            {recentMatches.length > 0 && (
              <section>
                <div className="flex justify-between items-end mb-8">
                  <div>
                    <span className="label-caps mb-2 block">Resultados</span>
                    <h2 className="headline-lg text-fifa-blue dark:text-white uppercase">Últimos Resultados</h2>
                  </div>
                  <button className="text-sm font-bold uppercase tracking-widest flex items-center gap-2 hover:text-fifa-blue transition-colors">
                    Ver todos <span>→</span>
                  </button>
                </div>
                <ResultsStrip />
              </section>
            )}

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

        {!showTournamentView && (
          <>
            {matchesError && !matchesLoading && (
              <div className="stadium-card border border-red-200 dark:border-red-900/40 bg-red-50/80 dark:bg-red-950/30 p-4 text-sm text-red-700 dark:text-red-300">
                No pudimos cargar los datos del Mundial. Revisá la API y volvé a intentar.
              </div>
            )}

            {liveMatches.length === 0 && recentMatches.length === 0 && (
              <section className="stadium-card overflow-hidden shadow-2xl border-none">
                <div className="bg-gradient-to-r from-fifa-blue to-blue-900 p-8 text-white flex flex-col md:flex-row justify-between items-center gap-8">
                  <div className="text-center md:text-left">
                    <h3 className="headline-md uppercase mb-3 leading-tight">
                      {isPreTournament
                        ? <>El torneo se disputa <br /> desde el 11 de junio de 2026</>
                        : <>El torneo está en marcha</>
                      }
                    </h3>
                    {isPreTournament && (
                      <div className="flex justify-center md:justify-start items-center gap-2">
                        <span className="bg-fifa-gold text-fifa-blue text-[10px] font-black px-3 py-1 rounded-sm uppercase tracking-widest shadow-lg">
                          Faltan {Math.ceil((TOURNAMENT_START.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))} días
                        </span>
                      </div>
                    )}
                  </div>
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
            )}

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
      </div>
    </main>
  );
}
