import { useState, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Newspaper, RefreshCw, Globe, ExternalLink,
  Clock, Wifi, WifiOff, Search
} from 'lucide-react';
import { SEO } from '../components/shared/SEO';
import { RSS_FEEDS, type RssFeed } from '../lib/rssFeeds';
import { cn } from '../lib/utils';

// ── Tipos ────────────────────────────────────────────────────────────────────
interface NewsItem {
  title: string;
  link: string;
  pubDate: string;
  description?: string;
  imageUrl?: string;
  source: string;
  sourceFlag: string;
  sourceCountry: string;
  category: RssFeed['category'];
}

type ActiveFilter = 'all' | RssFeed['category'];

// ── Helpers ──────────────────────────────────────────────────────────────────
const SESSION_KEY = 'news_cache_v3';
const TTL_MS = 10 * 60 * 1000;

function getCached(): { items: NewsItem[]; ts: number } | null {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (Date.now() - parsed.ts > TTL_MS) return null;
    return parsed;
  } catch { return null; }
}

function setCached(items: NewsItem[]) {
  try { sessionStorage.setItem(SESSION_KEY, JSON.stringify({ items, ts: Date.now() })); }
  catch { /* storage full */ }
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return 'Ahora';
  if (m < 60) return `Hace ${m}m`;
  const h = Math.floor(m / 60);
  if (h < 24) return `Hace ${h}h`;
  return `Hace ${Math.floor(h / 24)}d`;
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]+>/g, '').replace(/&[a-z]+;/g, ' ').trim().slice(0, 150);
}

// ── Fetcher ───────────────────────────────────────────────────────────────────
async function fetchAllNews(): Promise<NewsItem[]> {
  const cached = getCached();
  if (cached) return cached.items;

  // Una sola llamada al proxy que ya agrega y filtra todos los feeds
  const res = await fetch('/.netlify/functions/rss-proxy', {
    signal: AbortSignal.timeout(30000),
  });

  if (!res.ok) throw new Error(`rss-proxy HTTP ${res.status}`);

  const data = await res.json();
  // rss-proxy devuelve { articles: [...], cached: bool, total: number }
  const rawArticles: any[] = data.articles ?? [];

  const items: NewsItem[] = rawArticles
    .filter((a: any) => a.title && a.link)
    .map((a: any): NewsItem => ({
      title:         a.title,
      link:          a.link,
      pubDate:       a.pubDate ?? new Date().toISOString(),
      description:   a.description ?? '',
      imageUrl:      a.imageUrl || '',
      source:        a.sourceName ?? a.sourceId ?? 'Fuente',
      sourceFlag:    a.flag ?? '🌍',
      sourceCountry: a.country ?? '',
      category:      (a.category as RssFeed['category']) ?? 'global',
    }));

  if (items.length > 0) setCached(items);
  return items;
}

// ── NewsCard ──────────────────────────────────────────────────────────────────
function NewsCard({ item, featured = false }: { item: NewsItem; featured?: boolean }) {
  const [imgError, setImgError] = useState(false);
  const desc = item.description ? stripHtml(item.description) : '';

  return (
    <a
      href={item.link}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        'stadium-card group flex flex-col bg-slate-900/70 border border-white/5',
        'hover:border-fifa-blue/50 hover:-translate-y-1 hover:shadow-2xl transition-all duration-300',
        featured ? 'md:col-span-2 md:flex-row' : ''
      )}
    >
      {/* Imagen */}
      {item.imageUrl && !imgError ? (
        <div className={cn(
          'relative overflow-hidden bg-slate-800 flex-shrink-0',
          featured ? 'md:w-72 h-48 md:h-auto' : 'h-44'
        )}>
          <img
            src={item.imageUrl}
            alt={item.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={() => setImgError(true)}
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        </div>
      ) : (
        <div className={cn(
          'relative overflow-hidden bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center flex-shrink-0',
          featured ? 'md:w-72 h-48 md:h-auto' : 'h-44'
        )}>
          {/* Emoji de bandera grande como fondo visual */}
          <span
            className="absolute text-8xl select-none pointer-events-none"
            style={{ opacity: 0.12, filter: 'blur(2px)' }}
            aria-hidden="true"
          >
            {item.sourceFlag}
          </span>
          {/* Ícono central */}
          <div className="relative z-10 flex flex-col items-center gap-2">
            <Newspaper className="w-8 h-8 text-slate-600" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-600">
              {item.source}
            </span>
          </div>
        </div>
      )}

      {/* Contenido */}
      <div className="flex flex-col flex-1 p-5 gap-3">
        {/* Badge fuente */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-bold uppercase tracking-wider text-fifa-blue dark:text-fifa-gold">
            {item.sourceFlag} {item.source}
          </span>
          <span className="text-[10px] text-slate-500 uppercase tracking-wide">{item.sourceCountry}</span>
          <span className="ml-auto text-xs text-slate-500 flex items-center gap-1 font-mono">
            <Clock className="w-3 h-3" />
            {timeAgo(item.pubDate)}
          </span>
        </div>

        {/* Título */}
        <h3 className={cn(
          'font-headline font-bold leading-snug text-slate-900 dark:text-white',
          'group-hover:text-fifa-blue dark:group-hover:text-fifa-gold transition-colors line-clamp-3',
          featured ? 'text-lg' : 'text-sm'
        )}>
          {item.title}
        </h3>

        {/* Descripción */}
        {(featured || !item.imageUrl) && desc && (
          <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">{desc}</p>
        )}

        {/* Footer */}
        <div className="mt-auto pt-2 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-fifa-blue dark:text-fifa-gold opacity-0 group-hover:opacity-100 transition-opacity">
          Leer nota <ExternalLink className="w-3 h-3" />
        </div>
      </div>
    </a>
  );
}

// ── Skeleton ──────────────────────────────────────────────────────────────────
function NewsSkeleton() {
  return (
    <div className="stadium-card overflow-hidden animate-pulse">
      <div className="h-44 bg-slate-200 dark:bg-slate-800" />
      <div className="p-5 space-y-3">
        <div className="h-2.5 bg-slate-200 dark:bg-slate-700 rounded w-1/3" />
        <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-full" />
        <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-4/5" />
      </div>
    </div>
  );
}

// ── Filtros ───────────────────────────────────────────────────────────────────
const FILTERS: { key: ActiveFilter; label: string; icon: string }[] = [
  { key: 'all',           label: 'Todas',         icon: '⚽' },
  { key: 'latinoamerica', label: 'Latinoamérica', icon: '🌎' },
  { key: 'europa',        label: 'Europa',         icon: '🌍' },
  { key: 'global',        label: 'Global',         icon: '🌐' },
];

// ── Componente Principal ──────────────────────────────────────────────────────
export default function NewsPage() {
  const [filter, setFilter] = useState<ActiveFilter>('all');
  const [search, setSearch] = useState('');
  const [manualRefresh, setManualRefresh] = useState(0);

  const { data: allNews = [], isLoading, isError, refetch, isFetching } = useQuery({
    queryKey: ['news-all', manualRefresh],
    queryFn: fetchAllNews,
    staleTime: 10 * 60 * 1000,
    retry: 1,
  });

  const handleRefresh = useCallback(() => {
    sessionStorage.removeItem(SESSION_KEY);
    setManualRefresh(n => n + 1);
  }, []);

  const visible = allNews
    .filter(n => filter === 'all' || n.category === filter)
    .filter(n => !search || n.title.toLowerCase().includes(search.toLowerCase())
                          || n.source.toLowerCase().includes(search.toLowerCase()));

  const featured = visible.slice(0, 2);
  const rest     = visible.slice(2);

  const totalSources = Object.keys(
    allNews.reduce<Record<string, number>>((acc, n) => { acc[n.source] = 1; return acc; }, {})
  ).length;

  return (
    <>
      <SEO
        title="Noticias del Mundial"
        description="Últimas noticias del Mundial FIFA 2026 en español: resultados, análisis, selecciones, sedes y todo lo que pasa en el World Cup 2026 desde Argentina, España, México y todo el mundo."
        keywords="noticias mundial 2026, noticias world cup, resultados mundial en vivo, analisis mundial fifa 2026"
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Inicio", "item": "https://mundial-fifa-2026.netlify.app/" },
            { "@type": "ListItem", "position": 2, "name": "Noticias", "item": "https://mundial-fifa-2026.netlify.app/noticias" }
          ]
        }}
      />

      <div className="min-h-screen bg-surface-canvas pt-12 pb-24 px-4 md:px-8">
        <div className="container mx-auto space-y-10">

          {/* ── HEADER ── */}
          <header className="flex flex-col md:flex-row justify-between items-end gap-6 mb-2">
            <div>
              <span className="label-caps mb-2 block">Copa Mundial de la FIFA™</span>
              <h1 className="display-md text-fifa-blue dark:text-white">
                Noticias<br />del Mundial
              </h1>
              {!isLoading && allNews.length > 0 && (
                <div className="flex flex-wrap gap-5 mt-4 text-sm">
                  <span className="flex items-center gap-1.5 text-fifa-blue dark:text-fifa-gold font-bold">
                    <Wifi className="w-4 h-4" />
                    {allNews.length} noticias
                  </span>
                  <span className="flex items-center gap-1.5 text-slate-500">
                    <Globe className="w-4 h-4" />
                    {totalSources} fuentes internacionales
                  </span>
                </div>
              )}
            </div>

            <button
              onClick={handleRefresh}
              disabled={isFetching}
              className={cn(
                'flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-bold uppercase tracking-wider border transition-all duration-200',
                'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700',
                'text-slate-600 dark:text-slate-300 hover:text-fifa-blue dark:hover:text-fifa-gold',
                'hover:border-fifa-blue/40 dark:hover:border-fifa-gold/40',
                'disabled:opacity-50 shadow-stadium dark:shadow-stadium-dark'
              )}
            >
              <RefreshCw className={cn('w-4 h-4', isFetching && 'animate-spin')} />
              Actualizar
            </button>
          </header>

          {/* ── CONTROLES ── */}
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">

            {/* Search — estilo Teams.tsx */}
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-white/40" size={18} />
              <input
                type="text"
                placeholder="Buscar noticias o fuente..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full bg-white/5 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-full pl-12 pr-6 py-3 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-white/30 focus:ring-2 ring-fifa-blue outline-none transition-all"
              />
            </div>

            {/* Tabs — estilo FixtureGroups.tsx */}
            <div className="flex bg-white dark:bg-slate-800 p-1.5 rounded-xl shadow-stadium dark:shadow-stadium-dark overflow-x-auto no-scrollbar">
              {FILTERS.map(f => (
                <button
                  key={f.key}
                  onClick={() => setFilter(f.key)}
                  className={cn(
                    'flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-sm font-bold transition-all whitespace-nowrap',
                    filter === f.key
                      ? 'bg-fifa-blue text-white shadow-lg'
                      : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-700'
                  )}
                >
                  {f.icon}
                  <span className="hidden sm:inline">{f.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* ── ERROR ── */}
          {isError && (
            <div className="stadium-card border border-red-200 dark:border-red-900/40 bg-red-50/80 dark:bg-red-950/30 p-5 flex items-center gap-4 text-red-700 dark:text-red-300">
              <WifiOff className="w-5 h-5 flex-shrink-0" />
              <div className="flex-1">
                <p className="font-bold text-sm uppercase tracking-wide">Error al cargar noticias</p>
                <p className="text-xs mt-0.5 opacity-70">Revisá tu conexión o intentá actualizar.</p>
              </div>
              <button
                onClick={() => refetch()}
                className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg text-xs font-bold uppercase tracking-wide transition"
              >
                Reintentar
              </button>
            </div>
          )}

          {/* ── SKELETON ── */}
          {isLoading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 9 }).map((_, i) => <NewsSkeleton key={i} />)}
            </div>
          )}

          {/* ── SIN RESULTADOS ── */}
          {!isLoading && !isError && visible.length === 0 && (
            <div className="stadium-card flex flex-col items-center justify-center py-24 text-slate-400">
              <Newspaper className="w-14 h-14 mb-4 opacity-20" />
              <p className="headline-md text-slate-500 uppercase">Sin noticias</p>
              <p className="text-sm text-slate-400 mt-2">No hay resultados para este filtro.</p>
              <button
                onClick={() => { setFilter('all'); setSearch(''); }}
                className="mt-6 text-sm font-bold uppercase tracking-wider text-fifa-blue dark:text-fifa-gold hover:underline"
              >
                Ver todas las noticias
              </button>
            </div>
          )}

          {/* ── CONTENIDO ── */}
          {!isLoading && visible.length > 0 && (
            <>
              {featured.length > 0 && (
                <section>
                  <span className="label-caps mb-4 block">Más recientes</span>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {featured.map((item, i) => (
                      <NewsCard key={`${item.link}-${i}`} item={item} featured />
                    ))}
                  </div>
                </section>
              )}

              {rest.length > 0 && (
                <section>
                  <span className="label-caps mb-4 block">Últimas noticias</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {rest.map((item, i) => (
                      <NewsCard key={`${item.link}-${i}`} item={item} />
                    ))}
                  </div>
                </section>
              )}
            </>
          )}

        </div>
      </div>
    </>
  );
}
