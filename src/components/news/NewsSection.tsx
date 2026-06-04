// src/components/news/NewsSection.tsx
import React, { useState, useMemo } from 'react';
import { Newspaper, RefreshCw, Globe2, Filter } from 'lucide-react';
import { useNews } from '../../hooks/useNews';
import { NewsCard } from './NewsCard';
import { RSS_SOURCES } from '../../data/rssSources';

// Filtros de país disponibles
const COUNTRY_FILTERS = [
  { id: 'all', label: 'Todos' },
  { id: 'ar', label: '🇦🇷 Argentina' },
  { id: 'br', label: '🇧🇷 Brasil' },
  { id: 'mx', label: '🇲🇽 México' },
  { id: 'co', label: '🇨🇴 Colombia' },
  { id: 'cl', label: '🇨🇱 Chile' },
  { id: 'pe', label: '🇵🇪 Perú' },
  { id: 'uy', label: '🇺🇾 Uruguay' },
  { id: 'py', label: '🇵🇾 Paraguay' },
  { id: 'int', label: '🌐 Internacional' },
];

export const NewsSection: React.FC = () => {
  const [activeCountry, setActiveCountry] = useState('all');
  const [activeLanguage, setActiveLanguage] = useState<'all' | 'es' | 'pt' | 'en'>('all');
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 12;

  const { data: articles = [], isLoading, isError, refetch, isFetching } = useNews();

  // Filtrar artículos
  const filtered = useMemo(() => {
    return articles.filter(a => {
      const matchCountry =
        activeCountry === 'all' ||
        a.countryCode === activeCountry ||
        (activeCountry === 'int' && ['us', 'ch', 'gb', 'int'].includes(a.countryCode));
      const matchLang = activeLanguage === 'all' || a.language === activeLanguage;
      return matchCountry && matchLang;
    });
  }, [articles, activeCountry, activeLanguage]);

  const paginated = filtered.slice(0, page * PAGE_SIZE);
  const hasMore = paginated.length < filtered.length;

  const featuredArticle = paginated[0];
  const restArticles = paginated.slice(1);

  const sourcesActive = RSS_SOURCES.filter(s => s.enabled).length;

  return (
    <section className="min-h-screen bg-gray-50 dark:bg-gray-950 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex items-start justify-between mb-8 gap-4 flex-wrap">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <Newspaper className="w-7 h-7 text-emerald-500" />
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Noticias del Mundial 2026
              </h1>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
              <Globe2 className="w-4 h-4" />
              {sourcesActive} medios · Actualizado cada 10 minutos
            </p>
          </div>
          <button
            onClick={() => refetch()}
            disabled={isFetching}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-medium transition-colors disabled:opacity-60"
          >
            <RefreshCw className={`w-4 h-4 ${isFetching ? 'animate-spin' : ''}`} />
            Actualizar
          </button>
        </div>

        {/* Filtros de país */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-4 scrollbar-hide">
          {COUNTRY_FILTERS.map(f => (
            <button
              key={f.id}
              onClick={() => { setActiveCountry(f.id); setPage(1); }}
              className={`flex-shrink-0 px-3 py-1.5 rounded-full text-sm font-medium transition-colors whitespace-nowrap
                ${activeCountry === f.id
                  ? 'bg-emerald-500 text-white'
                  : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700'
                }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Filtros de idioma */}
        <div className="flex items-center gap-2 mb-8">
          <Filter className="w-4 h-4 text-gray-400 flex-shrink-0" />
          {(['all', 'es', 'pt', 'en'] as const).map(lang => (
            <button
              key={lang}
              onClick={() => { setActiveLanguage(lang); setPage(1); }}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors
                ${activeLanguage === lang
                  ? 'bg-blue-500 text-white'
                  : 'bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
            >
              {lang === 'all' ? 'Todos los idiomas' : lang === 'es' ? 'Español' : lang === 'pt' ? 'Portugués' : 'Inglés'}
            </button>
          ))}
        </div>

        {/* Estado: cargando */}
        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.from({ length: 9 }).map((_, i) => (
              <div key={i} className="rounded-xl bg-white dark:bg-gray-800 h-64 animate-pulse border border-gray-100 dark:border-gray-700" />
            ))}
          </div>
        )}

        {/* Estado: error */}
        {isError && !isLoading && (
          <div className="text-center py-20 text-gray-500 dark:text-gray-400">
            <Newspaper className="w-12 h-12 mx-auto mb-3 opacity-40" />
            <p className="font-medium">No se pudieron cargar las noticias</p>
            <p className="text-sm mt-1">Verificá tu conexión o intentá de nuevo</p>
            <button onClick={() => refetch()} className="mt-4 px-4 py-2 bg-emerald-500 text-white rounded-lg text-sm hover:bg-emerald-600">
              Reintentar
            </button>
          </div>
        )}

        {/* Estado: sin resultados con filtro activo */}
        {!isLoading && !isError && filtered.length === 0 && (
          <div className="text-center py-16 text-gray-500 dark:text-gray-400">
            <p>No hay noticias para el filtro seleccionado.</p>
            <button
              onClick={() => { setActiveCountry('all'); setActiveLanguage('all'); }}
              className="mt-3 text-emerald-500 hover:text-emerald-400 text-sm underline"
            >
              Quitar filtros
            </button>
          </div>
        )}

        {/* Contenido: artículo destacado + grilla */}
        {!isLoading && !isError && filtered.length > 0 && (
          <>
            {/* Artículo destacado (primero) */}
            {featuredArticle && (
              <div className="mb-8">
                <NewsCard article={featuredArticle} variant="featured" />
              </div>
            )}

            {/* Grilla de artículos */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {restArticles.map(article => (
                <NewsCard key={article.id} article={article} variant="default" />
              ))}
            </div>

            {/* Cargar más */}
            {hasMore && (
              <div className="mt-10 text-center">
                <button
                  onClick={() => setPage(p => p + 1)}
                  className="px-6 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Cargar más noticias ({filtered.length - paginated.length} restantes)
                </button>
              </div>
            )}

            {/* Contador y créditos */}
            <p className="text-xs text-center text-gray-400 dark:text-gray-600 mt-8">
              Mostrando {paginated.length} de {filtered.length} noticias de {sourcesActive} medios · Solo noticias del Mundial 2026
            </p>
          </>
        )}
      </div>
    </section>
  );
};

export default NewsSection;