import { SEO } from '../components/shared/SEO';
import { NewsSection } from '../components/home/NewsSection';

export default function News() {
  return (
    <main className="relative min-h-screen pb-20">
      <SEO
        title="Noticias"
        description="Cobertura en español y regional del Mundial FIFA 2026 con los principales medios latinoamericanos y transnacionales."
        keywords="noticias mundial 2026, rss, deportes, prensa latinoamericana, fifa 2026"
      />

      <section className="container mx-auto px-4 pt-12 pb-24">
        <div className="max-w-4xl mb-10">
          <span className="label-caps text-fifa-blue">Noticias</span>
          <h1 className="headline-lg text-fifa-blue dark:text-white uppercase tracking-tight mt-4">
            Cobertura completa del Mundial 2026
          </h1>
          <p className="mt-4 text-slate-600 dark:text-slate-300 leading-relaxed">
            Seguimos las noticias en español de los principales medios regionales y transnacionales del Mundial: Argentina, Brasil, Colombia, Chile, Perú, México, Uruguay, Paraguay y más.
          </p>
        </div>

        <NewsSection />
      </section>
    </main>
  );
}
