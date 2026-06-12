import { useState, useEffect, useCallback } from 'react';
import { Newspaper, RefreshCw, Clock, ExternalLink, Globe } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';
import { RSS_FEEDS_FEATURED, type RssFeed } from '../../lib/rssFeeds';

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

const CACHE_KEY = 'mundial2026_home_news_v2';
const CACHE_TTL = 10 * 60 * 1000;

function stripHtml(html: string): string {
  return html.replace(/<[^>]+>/g, '').replace(/&[a-z]+;/g, ' ').trim().slice(0, 140);
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

async function fetchHomeNews(): Promise<NewsItem[]> {
  try {
    const cached = sessionStorage.getItem(CACHE_KEY);
    if (cached) {
      const { items, ts } = JSON.parse(cached);
      if (Date.now() - ts < CACHE_TTL && items?.length) return items;
    }
  } catch { /* ignore */ }

  const results = await Promise.allSettled(
    RSS_FEEDS_FEATURED.map(async (feed) => {
      const proxyUrl = `/.netlify/functions/rss-proxy?url=${encodeURIComponent(feed.url)}`;
      const res = await fetch(proxyUrl, { signal: AbortSignal.timeout(8000) });
      if (!res.ok) throw new Error(`${feed.name}: HTTP ${res.status}`);
      const data = await res.json();
      const rawItems: any[] = data.items ?? data.entries ?? data.rss?.channel?.item ?? [];
      return rawItems.slice(0, 5).map((item: any): NewsItem => ({
        title: item.title ?? '',
        link: item.link ?? item.url ?? '',
        pubDate: item.pubDate ?? item.published ?? item.isoDate ?? new Date().toISOString(),
        description: item.contentSnippet ?? item.summary ?? item.description ?? '',
        imageUrl: item.enclosure?.url ?? item['media:content']?.['@_url'] ?? item.image ?? '',
        source: feed.name,
        sourceFlag: feed.flag,
        sourceCountry: feed.country,
        category: feed.category,
      }));
    })
  );

  const items: NewsItem[] = results
    .filter((r): r is PromiseFulfilledResult<NewsItem[]> => r.status === 'fulfilled')
    .flatMap(r => r.value)
    .filter(i => i.title && i.link)
    .sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime());

  if (items.length > 0) {
    try { sessionStorage.setItem(CACHE_KEY, JSON.stringify({ items, ts: Date.now() })); } catch { /* ignore */ }
  }
  return items;
}

export const NewsSection = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadNews = useCallback(async (force = false) => {
    setIsLoading(true);
    setError(null);
    if (force) sessionStorage.removeItem(CACHE_KEY);
    try {
      const items = await fetchHomeNews();
      if (!items.length && force) throw new Error('No hay noticias disponibles');
      setNews(items);
    } catch {
      setError('No pudimos cargar noticias. Reintentá en unos minutos.');
      setNews([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { loadNews(); }, [loadNews]);

  const display = news.slice(0, 6);

  return (
    <section className="py-12">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-3">
          <div className="bg-emerald-500/10 p-2.5 rounded-xl border border-emerald-500/20">
            <Newspaper size={22} className="text-emerald-400" />
          </div>
          <div>
            <h2 className="headline-lg text-fifa-blue dark:text-white uppercase tracking-tight">
              Noticias del Mundial
            </h2>
            <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold mt-1 flex items-center gap-1.5">
              <Globe size={10} /> Cobertura internacional en vivo
            </p>
          </div>
        </div>
        <button
          onClick={() => loadNews(true)}
          disabled={isLoading}
          className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 hover:text-emerald-400 transition-colors disabled:opacity-50"
        >
          <RefreshCw size={14} className={cn(isLoading && "animate-spin")} />
          Actualizar
        </button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="stadium-card h-56 animate-pulse bg-slate-100 dark:bg-slate-800/50" />
          ))}
        </div>
      ) : error ? (
        <div className="stadium-card p-8 text-center bg-red-50/50 dark:bg-red-900/10 border border-red-200 dark:border-red-800/30">
          <p className="text-sm text-red-600 dark:text-red-400 mb-4">{error}</p>
          <button
            onClick={() => loadNews(true)}
            className="px-5 py-2 bg-fifa-blue text-white rounded-full text-xs font-black uppercase tracking-widest hover:bg-emerald-600 transition-colors"
          >
            Reintentar
          </button>
        </div>
      ) : display.length === 0 ? (
        <div className="stadium-card p-8 text-center text-slate-500">
          No hay noticias disponibles en este momento.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {display.map((item, idx) => {
            const desc = item.description ? stripHtml(item.description) : '';
            return (
              <motion.a
                key={`${item.link}-${idx}`}
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.06 }}
                className="group flex flex-col bg-white/5 dark:bg-slate-800/30 border border-white/10 dark:border-slate-700/30
                  rounded-2xl overflow-hidden hover:border-emerald-500/40 hover:bg-white/8
                  transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-emerald-900/10"
              >
                {item.imageUrl ? (
                  <div className="relative h-36 overflow-hidden bg-slate-200 dark:bg-slate-700">
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                      onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                  </div>
                ) : (
                  <div className="h-20 bg-gradient-to-br from-emerald-900/20 to-slate-200 dark:to-slate-700 flex items-center justify-center">
                    <Newspaper className="w-8 h-8 text-emerald-600/40" />
                  </div>
                )}

                <div className="flex flex-col flex-1 p-4 gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-emerald-500 dark:text-emerald-400">
                      {item.sourceFlag} {item.source}
                    </span>
                    <span className="text-[10px] text-slate-400 dark:text-slate-500">{item.sourceCountry}</span>
                    <span className="ml-auto text-[10px] text-slate-400 flex items-center gap-1">
                      <Clock size={10} />
                      {timeAgo(item.pubDate)}
                    </span>
                  </div>
                  <h3 className="text-sm font-semibold leading-snug text-slate-800 dark:text-white
                    group-hover:text-emerald-600 dark:group-hover:text-emerald-300 transition-colors line-clamp-3">
                    {item.title}
                  </h3>
                  {desc && (
                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">{desc}</p>
                  )}
                  <div className="mt-auto pt-2 flex items-center gap-1 text-[10px] text-emerald-500 font-semibold
                    opacity-0 group-hover:opacity-100 transition-opacity">
                    Leer nota <ExternalLink size={10} />
                  </div>
                </div>
              </motion.a>
            );
          })}
        </div>
      )}
    </section>
  );
};
