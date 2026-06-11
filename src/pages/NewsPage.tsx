import { useState, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Newspaper, RefreshCw, Globe, Filter, ExternalLink,
  Clock, Wifi, WifiOff
} from 'lucide-react';
import { SEO } from '../components/shared/SEO';
import { RSS_FEEDS, type RssFeed } from '../lib/rssFeeds';

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
const TTL_MS = 10 * 60 * 1000; // 10 min

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
  catch { /* storage full – ignorar */ }
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

  const results = await Promise.allSettled(
    RSS_FEEDS.map(async (feed) => {
      const proxyUrl = `/.netlify/functions/rss-proxy?url=${encodeURIComponent(feed.url)}`;
      const res = await fetch(proxyUrl, { signal: AbortSignal.timeout(8000) });
      if (!res.ok) throw new Error(`${feed.name}: HTTP ${res.status}`);
      const data = await res.json();

      // Soportar múltiples estructuras de respuesta del proxy
      const rawItems: any[] = data.items ?? data.entries ?? data.rss?.channel?.item ?? [];
      return rawItems.slice(0, 8).map((item: any): NewsItem => ({
        title:         item.title ?? '',
        link:          item.link ?? item.url ?? '',
        pubDate:       item.pubDate ?? item.published ?? item.isoDate ?? new Date().toISOString(),
        description:   item.contentSnippet ?? item.summary ?? item.description ?? '',
        imageUrl:      item.enclosure?.url ?? item['media:content']?.['@_url'] ?? item.image ?? '',
        source:        feed.name,
        sourceFlag:    feed.flag,
        sourceCountry: feed.country,
        category:      feed.category,
      }));
    })
  );

  const items: NewsItem[] = results
    .filter((r): r is PromiseFulfilledResult<NewsItem[]> => r.status === 'fulfilled')
    .flatMap(r => r.value)
    .filter(i => i.title && i.link)
    .sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime());

  if (items.length > 0) setCached(items);
  return items;
}

// ── Componente NewsCard ────────────────────────────────────────────────────────
function NewsCard({ item, featured = false }: { item: NewsItem; featured?: boolean }) {
  const [imgError, setImgError] = useState(false);
  const desc = item.description ? stripHtml(item.description) : '';

  return (
    <a
      href={item.link}
      target="_blank"
      rel="noopener noreferrer"
      className={`group flex flex-col bg-white/5 border border-white/10 rounded-2xl overflow-hidden
        hover:border-emerald-500/50 hover:bg-white/8 transition-all duration-300 hover:-translate-y-1
        hover:shadow-xl hover:shadow-emerald-900/20
        ${featured ? 'md:col-span-2 md:flex-row' : ''}`}
    >
      {/* Imagen */}
      {item.imageUrl && !imgError ? (
        <div className={`relative overflow-hidden bg-gray-800 flex-shrink-0
          ${featured ? 'md:w-64 h-44 md:h-auto' : 'h-40'}`}>
          <img
            src={item.imageUrl}
            alt={item.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={() => setImgError(true)}
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        </div>
      ) : (
        <div className={`bg-gradient-to-br from-emerald-900/30 to-gray-800 flex items-center justify-center flex-shrink-0
          ${featured ? 'md:w-64 h-44 md:h-auto' : 'h-40'}`}>
          <Newspaper className="w-10 h-10 text-emerald-700/50" />
        </div>
      )}

      {/* Contenido */}
      <div className="flex flex-col flex-1 p-4 gap-2">
        {/* Badge fuente */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm font-medium text-emerald-400">
            {item.sourceFlag} {item.source}
          </span>
          <span className="text-xs text-gray-500">{item.sourceCountry}</span>
          <span className="ml-auto text-xs text-gray-500 flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {timeAgo(item.pubDate)}
          </span>
        </div>

        {/* Título */}
        <h3 className={`font-semibold leading-snug text-white group-hover:text-emerald-300 transition-colors line-clamp-3
          ${featured ? 'text-lg' : 'text-sm'}`}>
          {item.title}
        </h3>

        {/* Descripción — solo en featured o si hay espacio */}
        {(featured || !item.imageUrl) && desc && (
          <p className="text-xs text-gray-400 line-clamp-2">{desc}</p>
        )}

        {/* Footer */}
        <div className="mt-auto pt-2 flex items-center gap-1 text-xs text-emerald-500 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
          Leer nota <ExternalLink className="w-3 h-3" />
        </div>
      </div>
    </a>
  );
}

// ── Skeleton ──────────────────────────────────────────────────────────────────
function NewsSkeleton() {
  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden animate-pulse">
      <div className="h-40 bg-gray-700/40" />
      <div className="p-4 space-y-3">
        <div className="h-3 bg-gray-700/40 rounded w-1/3" />
        <div className="h-4 bg-gray-700/40 rounded w-full" />
        <div className="h-4 bg-gray-700/40 rounded w-4/5" />
      </div>
    </div>
  );
}

// ── FILTROS ───────────────────────────────────────────────────────────────────
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

  // Filtrar
  const visible = allNews
    .filter(n => filter === 'all' || n.category === filter)
    .filter(n => !search || n.title.toLowerCase().includes(search.toLowerCase())
                          || n.source.toLowerCase().includes(search.toLowerCase()));

  const featured = visible.slice(0, 2);
  const rest     = visible.slice(2);

  // Estadísticas de fuentes
  const sourceCounts = allNews.reduce<Record<string, number>>((acc, n) => {
    acc[n.source] = (acc[n.source] ?? 0) + 1;
    return acc;
  }, {});
  const totalSources = Object.keys(sourceCounts).length;

  return (
    <>
      <SEO
        title="Noticias del Mundial 2026 | Últimas novedades"
        description="Las últimas noticias del Mundial FIFA 2026 desde los medios más importantes de Argentina, Brasil, México, España y el mundo."
      />

      <div className="min-h-screen bg-gray-950 text-white pb-24">

        {/* ── HERO HEADER ───────────────────────────────────────── */}
        <div className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-emerald-950/20 to-gray-900
          border-b border-white/5 pt-8 pb-10 px-4">
          {/* Glow decorativo */}
          <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-96 h-96
            bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative max-w-6xl mx-auto">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2.5 rounded-xl bg-emerald-500/15 border border-emerald-500/20">
                <Newspaper className="w-6 h-6 text-emerald-400" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
                  Noticias del Mundial
                </h1>
                <p className="text-sm text-gray-400 mt-0.5">
                  Cobertura internacional · actualización automática cada 10 min
                </p>
              </div>

              {/* Refresh */}
              <button
                onClick={handleRefresh}
                disabled={isFetching}
                className="ml-auto flex items-center gap-2 px-4 py-2 rounded-xl
                  bg-white/5 border border-white/10 hover:border-emerald-500/40
                  hover:bg-emerald-500/10 text-sm text-gray-300 hover:text-emerald-300
                  transition-all duration-200 disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${isFetching ? 'animate-spin' : ''}`} />
                <span className="hidden sm:inline">Actualizar</span>
              </button>
            </div>

            {/* Stats */}
            {!isLoading && allNews.length > 0 && (
              <div className="flex flex-wrap gap-4 mt-4 text-sm">
                <span className="flex items-center gap-1.5 text-emerald-400">
                  <Wifi className="w-4 h-4" />
                  {allNews.length} noticias
                </span>
                <span className="flex items-center gap-1.5 text-gray-400">
                  <Globe className="w-4 h-4" />
                  {totalSources} fuentes internacionales
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 mt-6 space-y-6">

          {/* ── BUSCADOR + FILTROS ────────────────────────────── */}
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search */}
            <div className="relative flex-1">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="text"
                placeholder="Buscar noticias, fuente..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl
                  text-sm text-white placeholder-gray-500 outline-none
                  focus:border-emerald-500/50 focus:bg-white/8 transition-all"
              />
            </div>

            {/* Region filters */}
            <div className="flex gap-2">
              {FILTERS.map(f => (
                <button
                  key={f.key}
                  onClick={() => setFilter(f.key)}
                  className={`px-3 py-2 rounded-xl text-xs font-medium border transition-all duration-200
                    ${filter === f.key
                      ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300'
                      : 'bg-white/5 border-white/10 text-gray-400 hover:border-white/20 hover:text-gray-200'
                    }`}
                >
                  {f.icon} <span className="hidden sm:inline ml-1">{f.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* ── ESTADOS ──────────────────────────────────────── */}
          {isError && (
            <div className="flex items-center gap-3 p-4 bg-red-900/20 border border-red-500/30 rounded-2xl text-red-400">
              <WifiOff className="w-5 h-5 flex-shrink-0" />
              <div>
                <p className="font-medium text-sm">Error al cargar noticias</p>
                <p className="text-xs text-red-400/70 mt-0.5">
                  Revisá tu conexión o intentá actualizar.
                </p>
              </div>
              <button
                onClick={() => refetch()}
                className="ml-auto px-3 py-1.5 bg-red-500/20 hover:bg-red-500/30 rounded-lg text-xs transition"
              >
                Reintentar
              </button>
            </div>
          )}

          {/* ── GRID CARGANDO ────────────────────────────────── */}
          {isLoading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: 9 }).map((_, i) => <NewsSkeleton key={i} />)}
            </div>
          )}

          {/* ── SIN RESULTADOS ───────────────────────────────── */}
          {!isLoading && !isError && visible.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-gray-500">
              <Newspaper className="w-12 h-12 mb-4 opacity-30" />
              <p className="text-lg font-medium">Sin noticias para este filtro</p>
              <button
                onClick={() => { setFilter('all'); setSearch(''); }}
                className="mt-4 text-sm text-emerald-400 hover:underline"
              >
                Ver todas las noticias
              </button>
            </div>
          )}

          {/* ── CONTENIDO ─────────────────────────────────────── */}
          {!isLoading && visible.length > 0 && (
            <>
              {/* Destacadas (2 primeras) */}
              {featured.length > 0 && (
                <section>
                  <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-3">
                    Más recientes
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {featured.map((item, i) => (
                      <NewsCard key={`${item.link}-${i}`} item={item} featured />
                    ))}
                  </div>
                </section>
              )}

              {/* Grilla general */}
              {rest.length > 0 && (
                <section>
                  <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-3">
                    Últimas noticias
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
