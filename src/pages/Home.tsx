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
import { PLAYED_MATCHES } from '../data/worldCupResults';
import { AdBanner } from '../components/shared/AdBanner';

const TOURNAMENT_START = new Date(2026, 5, 11);

function ScorersSectionWrapper() {
  // TopScorers ya devuelve null si no hay datos reales; esta envoltura solo agrega el header
  return (
    <section>
      <div className="flex items-center gap-3 mb-8">
        <span className="text-fifa-red">⚡</span>
        <h2 className="headline-lg text-fifa-blue dark:text-white uppercase">Máximos Goleadores</h2>
      </div>
      <TopScorers />
    </section>
  );
}

export default function Home() {
  const { data: matchesData, error: matchesError, isLoading: matchesLoading } = useApiData<{ matches: Match[] }>(
    ['home-matches'],
    () => api.getLiveMatches(),
    { staleTime: 60_000 }
  );
  const apiMatches: Match[] = matchesData?.matches ?? [];
  const hasApiMatches = apiMatches.length > 0;

  // Si la API falla, usar los resultados conocidos como fallback
  const matches: Match[] = hasApiMatches
    ? apiMatches
    : (PLAYED_MATCHES as Match[]);

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
  // El torneo inició el 11 de junio 2026. Mostrar vista de torneo siempre que no sea pre-torneo.
  // hasAnyMatchData solo se usa para secciones que requieren datos de partidos específicos.
  const showTournamentView = !isPreTournament;

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

            <ErrorBoundary>
              <ScorersSectionWrapper />
            </ErrorBoundary>

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
                      El Mundial está en marcha
                    </h3>
                    <p className="text-white/70 text-sm">
                      Los datos de partidos se actualizan automáticamente. Revisá el fixture completo para ver todos los resultados.
                    </p>
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