import { useState, useEffect, useCallback } from 'react';
import { Newspaper, RefreshCw, Clock, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';
import { api } from '../../lib/api';
import { cn } from '../../lib/utils';

interface NewsItem {
  title: string;
  summary: string;
  category: string;
  source: string;
  date: string;
  emoji: string;
  tags: string[];
  url?: string;
}

const CATEGORY_COLORS: Record<string, string> = {
  'Selecciones': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  'Fixture': 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
  'Estadios': 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  'Historia': 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  'Análisis': 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  'Figuras': 'bg-fifa-gold/20 text-fifa-gold dark:bg-fifa-gold/10 dark:text-fifa-gold',
};

const CACHE_KEY = 'mundial2026_rss_news';
const CACHE_TTL = 1000 * 60 * 30;

export const NewsSection = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNews = useCallback(async (force = false) => {
    setIsLoading(true);
    setError(null);

    try {
      if (!force) {
        const cached = sessionStorage.getItem(CACHE_KEY);
        if (cached) {
          const { items, ts } = JSON.parse(cached);
          if (Date.now() - ts < CACHE_TTL && items?.length) {
            setNews(items);
            setIsLoading(false);
            return;
          }
        }
      } else {
        sessionStorage.removeItem(CACHE_KEY);
      }

      const { items } = await api.getWorldCupNews();
      if (!items?.length) {
        throw new Error('No hay noticias disponibles en este momento');
      }
      setNews(items);
      sessionStorage.setItem(CACHE_KEY, JSON.stringify({ items, ts: Date.now() }));
    } catch (err) {
      console.error('Error fetching news:', err);
      setError('No pudimos cargar noticias en este momento. Reintentá en unos minutos.');
      setNews([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNews();
  }, [fetchNews]);

  return (
    <section className="py-12">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-3">
          <div className="bg-fifa-blue/10 dark:bg-fifa-blue/20 p-2 rounded-lg text-fifa-blue dark:text-fifa-gold">
            <Newspaper size={24} />
          </div>
          <div>
            <h2 className="headline-lg text-fifa-blue dark:text-white uppercase tracking-tight">Noticias del Mundial</h2>
            <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold mt-1">
              Feeds en vivo · medios latinoamericanos
            </p>
          </div>
        </div>
        <button 
          onClick={() => fetchNews(true)}
          disabled={isLoading}
          className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 hover:text-fifa-blue transition-colors disabled:opacity-50"
        >
          <RefreshCw size={14} className={cn(isLoading && "animate-spin")} />
          Actualizar
        </button>
      </div>

      {isLoading ? (
        <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <motion.div key={i} className="stadium-card h-64 animate-pulse bg-slate-100 dark:bg-slate-800/50" />
          ))}
        </motion.div>
      ) : error ? (
        <motion.div className="stadium-card p-12 text-center bg-slate-50 dark:bg-slate-900/50">
          <p className="text-slate-500 mb-6 font-medium">{error}</p>
          <button 
            onClick={() => fetchNews(true)} 
            className="px-6 py-2 bg-fifa-blue text-white rounded-full text-xs font-black uppercase tracking-widest hover:bg-fifa-gold transition-colors"
          >
            Reintentar
          </button>
        </motion.div>
      ) : (
        <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {news.map((item, idx) => (
            <motion.article
              key={`${item.url ?? item.title}-${idx}`}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.07 }}
              className="stadium-card p-6 flex flex-col h-full hover:border-fifa-blue/20 dark:hover:border-fifa-gold/20 hover:shadow-2xl transition-all group"
            >
              <motion.div className="flex justify-between items-start mb-4">
                <span className={cn(
                  "px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider",
                  CATEGORY_COLORS[item.category] || CATEGORY_COLORS['Análisis']
                )}>
                  {item.category}
                </span>
                <span className="text-2xl transform group-hover:scale-125 transition-transform">{item.emoji}</span>
              </motion.div>
              
              <h3 className="font-headline font-bold text-lg uppercase leading-tight mb-3 line-clamp-2 group-hover:text-fifa-blue dark:group-hover:text-fifa-gold transition-colors">
                {item.url ? (
                  <a href={item.url} target="_blank" rel="noopener noreferrer" className="hover:underline">
                    {item.title}
                  </a>
                ) : item.title}
              </h3>
              
              <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-3 mb-6 flex-1 leading-relaxed">
                {item.summary}
              </p>
              
              <motion.div className="flex flex-wrap gap-2 mb-6">
                {item.tags.map((tag) => (
                  <span key={tag} className="px-2 py-0.5 rounded bg-slate-50 dark:bg-slate-800/50 text-[9px] font-bold text-slate-400 uppercase tracking-tighter">
                    #{tag}
                  </span>
                ))}
              </motion.div>
              
              <motion.div className="flex justify-between items-center pt-4 border-t border-slate-50 dark:border-slate-800/50">
                <span className="text-[10px] font-black uppercase text-fifa-blue dark:text-fifa-gold">{item.source}</span>
                <motion.div className="flex items-center gap-3">
                  <motion.div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-bold">
                    <Clock size={12} />
                    {item.date}
                  </motion.div>
                  {item.url && (
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-slate-400 hover:text-fifa-blue transition-colors"
                      aria-label="Leer noticia original"
                    >
                      <ExternalLink size={14} />
                    </a>
                  )}
                </motion.div>
              </motion.div>
            </motion.article>
          ))}
        </motion.div>
      )}
    </section>
  );
};
