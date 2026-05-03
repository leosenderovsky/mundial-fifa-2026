import { useState, useEffect } from 'react';
import { Newspaper, RefreshCw, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import { getGeminiContent } from '../../lib/gemini';
import { cn } from '../../lib/utils';

interface NewsItem {
  title: string;
  summary: string;
  category: string;
  source: string;
  date: string;
  emoji: string;
  tags: string[];
}

const CATEGORY_COLORS: Record<string, string> = {
  'Selecciones': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  'Fixture': 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
  'Estadios': 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  'Historia': 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  'Análisis': 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  'Figuras': 'bg-fifa-gold/20 text-fifa-gold dark:bg-fifa-gold/10 dark:text-fifa-gold',
};

const STATIC_NEWS: NewsItem[] = [
  {
    title: "México se prepara para la gran inauguración en el Azteca",
    summary: "El legendario Estadio Azteca ultima detalles para recibir el partido inaugural. Se espera una ceremonia sin precedentes que unirá a los tres países anfitriones.",
    category: "Estadios",
    source: "Olé",
    date: "3 May 2026",
    emoji: "🏟️",
    tags: ["México", "Inauguración"]
  },
  {
    title: "Messi confirma su presencia: 'Llego en mi mejor momento mental'",
    summary: "El astro argentino declaró que el Mundial 2026 será un desafío único y que su objetivo es defender la corona con la Albiceleste en tierras norteamericanas.",
    category: "Figuras",
    source: "ESPN",
    date: "2 May 2026",
    emoji: "🐐",
    tags: ["Messi", "Argentina"]
  },
  {
    title: "Análisis del Grupo de la Muerte: El Grupo C bajo la lupa",
    summary: "Brasil, Marruecos, Haití y Escocia prometen una batalla táctica fascinante. Los expertos señalan a Marruecos como el gran contendiente tras su éxito en Qatar.",
    category: "Análisis",
    source: "Marca",
    date: "1 May 2026",
    emoji: "📊",
    tags: ["Brasil", "Marruecos"]
  },
  {
    title: "Nuevas tecnologías de refrigeración en sedes de EE.UU.",
    summary: "La FIFA aprobó los sistemas de control climático para los estadios en zonas de alta temperatura, garantizando el bienestar de jugadores y aficionados.",
    category: "Estadios",
    source: "Fox Sports",
    date: "30 Abr 2026",
    emoji: "❄️",
    tags: ["Tecnología", "Sedes"]
  },
  {
    title: "Canadá busca hacer historia en casa con Alphonso Davies",
    summary: "La selección canadiense intensifica su preparación en Vancouver. Davies liderará un grupo joven que sueña con superar la fase de grupos por primera vez.",
    category: "Selecciones",
    source: "TSN",
    date: "29 Abr 2026",
    emoji: "🇨🇦",
    tags: ["Canadá", "Davies"]
  },
  {
    title: "El trofeo del Mundial inicia su gira por las 16 sedes",
    summary: "La Copa inició su recorrido oficial en Nueva York y pasará por Ciudad de México y Toronto antes del pitazo inicial el 11 de junio.",
    category: "Historia",
    source: "FIFA",
    date: "28 Abr 2026",
    emoji: "🏆",
    tags: ["Trofeo", "Tour"]
  }
];

export const NewsSection = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNews = async (force = false) => {
    setIsLoading(true);
    setError(null);
    
    const prompt = `Eres un periodista deportivo latinoamericano. Genera 6 noticias verosímiles sobre el Mundial FIFA 2026 (EE.UU., México y Canadá, 11 jun - 19 jul 2026). Las noticias deben cubrir temas variados: preparación de selecciones, análisis de grupos, jugadores estrella (Messi, Mbappé, Vinicius, Bellingham, Pulisic, Yamal, etc.), sedes, expectativas, curiosidades históricas. Usa español latinoamericano natural.
Devuelve SOLO un JSON array válido, sin markdown, sin texto extra:
[{ "title": "...", "summary": "...", "category": "Selecciones | Fixture | Estadios | Historia | Análisis | Figuras", "source": "...", "date": "...", "emoji": "...", "tags": ["...", "..."] }]`;

    try {
      if (force) sessionStorage.removeItem('mundial2026_news_v1');
      const res = await getGeminiContent(prompt, 'mundial2026_news_v1');
      const cleaned = res.replace(/```json/g, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(cleaned);
      setNews(parsed);
    } catch (err) {
      console.error('Error fetching news:', err);
      // Use static news on error
      setNews(STATIC_NEWS);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  return (
    <section className="py-12">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-3">
          <div className="bg-fifa-blue/10 dark:bg-fifa-blue/20 p-2 rounded-lg text-fifa-blue dark:text-fifa-gold">
            <Newspaper size={24} />
          </div>
          <h2 className="headline-lg text-fifa-blue dark:text-white uppercase tracking-tight">Noticias del Mundial</h2>
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1,2,3,4,5,6].map(i => (
            <div key={i} className="stadium-card h-64 animate-pulse bg-slate-100 dark:bg-slate-800/50" />
          ))}
        </div>
      ) : error ? (
        <div className="stadium-card p-12 text-center bg-slate-50 dark:bg-slate-900/50">
          <p className="text-slate-500 mb-6 font-medium">{error}</p>
          <button 
            onClick={() => fetchNews(true)} 
            className="px-6 py-2 bg-fifa-blue text-white rounded-full text-xs font-black uppercase tracking-widest hover:bg-fifa-gold transition-colors"
          >
            Reintentar
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {news.map((item, idx) => (
            <motion.article
              key={idx}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.07 }}
              className="stadium-card p-6 flex flex-col h-full hover:border-fifa-blue/20 dark:hover:border-fifa-gold/20 hover:shadow-2xl transition-all group"
            >
              <div className="flex justify-between items-start mb-4">
                <span className={cn(
                  "px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider",
                  CATEGORY_COLORS[item.category] || CATEGORY_COLORS['Análisis']
                )}>
                  {item.category}
                </span>
                <span className="text-2xl transform group-hover:scale-125 transition-transform">{item.emoji}</span>
              </div>
              
              <h3 className="font-headline font-bold text-lg uppercase leading-tight mb-3 line-clamp-2 group-hover:text-fifa-blue dark:group-hover:text-fifa-gold transition-colors">
                {item.title}
              </h3>
              
              <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-3 mb-6 flex-1 leading-relaxed">
                {item.summary}
              </p>
              
              <div className="flex flex-wrap gap-2 mb-6">
                {item.tags.map(tag => (
                  <span key={tag} className="px-2 py-0.5 rounded bg-slate-50 dark:bg-slate-800/50 text-[9px] font-bold text-slate-400 uppercase tracking-tighter">
                    #{tag}
                  </span>
                ))}
              </div>
              
              <div className="flex justify-between items-center pt-4 border-t border-slate-50 dark:border-slate-800/50">
                <span className="text-[10px] font-black uppercase text-fifa-blue dark:text-fifa-gold">{item.source}</span>
                <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-bold">
                  <Clock size={12} />
                  {item.date}
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      )}
    </section>
  );
};
