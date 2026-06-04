// src/lib/rssService.ts
// Servicio cliente para consumir la Netlify Function rss-proxy

export interface NewsArticle {
  id: string;
  title: string;
  description: string;
  link: string;
  pubDate: string;
  imageUrl: string | null;
  sourceId: string;
  sourceName: string;
  country: string;
  countryCode: string;
  language: 'es' | 'pt' | 'en';
}

interface RssProxyResponse {
  articles: NewsArticle[];
  cached: boolean;
  total: number;
  error?: string;
}

const SESSION_CACHE_KEY = 'rss_news_cache';
const SESSION_CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutos

interface SessionCache {
  articles: NewsArticle[];
  timestamp: number;
}

/**
 * Obtiene noticias del Mundial 2026 desde la Netlify Function.
 * Usa sessionStorage como caché secundaria.
 */
export async function fetchMundialNews(sourceIds?: string[]): Promise<NewsArticle[]> {
  // 1. Intentar caché de sessionStorage
  try {
    const raw = sessionStorage.getItem(SESSION_CACHE_KEY);
    if (raw) {
      const cached: SessionCache = JSON.parse(raw);
      if (Date.now() - cached.timestamp < SESSION_CACHE_TTL_MS) {
        return cached.articles;
      }
    }
  } catch {
    // sessionStorage no disponible (SSR o bloqueado) — continuar
  }

  // 2. Construir URL del proxy
  const params = new URLSearchParams();
  if (sourceIds?.length) params.set('sources', sourceIds.join(','));

  const proxyUrl = `/.netlify/functions/rss-proxy${params.toString() ? '?' + params.toString() : ''}`;

  const res = await fetch(proxyUrl, { cache: 'no-store' });
  if (!res.ok) throw new Error(`rss-proxy responded ${res.status}`);

  const data: RssProxyResponse = await res.json();

  // 3. Guardar en sessionStorage
  try {
    const toCache: SessionCache = {
      articles: data.articles,
      timestamp: Date.now(),
    };
    sessionStorage.setItem(SESSION_CACHE_KEY, JSON.stringify(toCache));
  } catch {
    // Cuota excedida o modo privado — ignorar
  }

  return data.articles;
}

/**
 * Formatea la fecha de publicación en español relativo
 */
export function formatRelativeDate(isoDate: string): string {
  const now = new Date();
  const date = new Date(isoDate);
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 5) return 'Hace un momento';
  if (diffMins < 60) return `Hace ${diffMins} min`;
  if (diffHours < 24) return `Hace ${diffHours} h`;
  if (diffDays === 1) return 'Ayer';
  if (diffDays < 7) return `Hace ${diffDays} días`;
  return date.toLocaleDateString('es-AR', { day: 'numeric', month: 'short' });
}

/**
 * Flag emoji por código de país (ISO 3166-1 alpha-2)
 */
export function countryFlag(code: string): string {
  if (!code || code === 'int') return '🌐';
  const codePoints = [...code.toUpperCase()].map(
    c => 127397 + c.charCodeAt(0)
  );
  return String.fromCodePoint(...codePoints);
}

/**
 * Badge de idioma
 */
export function languageBadge(lang: 'es' | 'pt' | 'en'): string {
  const map = { es: 'ESP', pt: 'POR', en: 'ENG' };
  return map[lang] ?? lang.toUpperCase();
}