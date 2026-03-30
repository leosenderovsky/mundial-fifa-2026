import { HeroSection } from '../components/home/HeroSection';
import { LiveMatchSection } from '../components/home/LiveMatchSection';
import { ResultsStrip } from '../components/home/ResultsStrip';
import { GroupsSummary } from '../components/home/GroupsSummary';
import { VenuesPreview } from '../components/home/VenuesPreview';
import { TopScorers } from '../components/home/TopScorers';
import { BottomNav } from '../components/layout/BottomNav';

export default function Home() {
  return (
    <main className="relative min-h-screen pb-20 md:pb-0">
      <HeroSection />
      
      <div className="container mx-auto px-4 -mt-24 relative z-10 space-y-20 pb-20">
        <LiveMatchSection />
        
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

        <VenuesPreview />

        <section>
          <div className="flex items-center gap-3 mb-8">
            <span className="text-fifa-red">⚡</span>
            <h2 className="headline-lg text-fifa-blue dark:text-white uppercase">Máximos Goleadores</h2>
          </div>
          <TopScorers />
        </section>
      </div>

      <BottomNav />
    </main>
  );
}