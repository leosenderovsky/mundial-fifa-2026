// src/lib/rssFeeds.ts
// Configuración centralizada de fuentes RSS para la sección Noticias
// Actualizado: Junio 2026 - Feeds expandidos y diversificados internacionalmente

export interface RssFeed {
  url: string;
  name: string;
  country: string;
  flag: string;
  category: 'latinoamerica' | 'europa' | 'global';
}

export const RSS_FEEDS: RssFeed[] = [
  // ── ARGENTINA ──────────────────────────────────────────────
  { url: 'https://www.clarin.com/rss/deportes/futbol/', name: 'Clarín', country: 'Argentina', flag: '🇦🇷', category: 'latinoamerica' },
  { url: 'https://www.lanacion.com.ar/arc/outboundfeeds/rss/category/deportes/', name: 'La Nación', country: 'Argentina', flag: '🇦🇷', category: 'latinoamerica' },
  { url: 'https://www.ole.com.ar/rss/futbol/', name: 'Olé', country: 'Argentina', flag: '🇦🇷', category: 'latinoamerica' },
  { url: 'https://www.infobae.com/feed/deportes/', name: 'Infobae', country: 'Argentina', flag: '🇦🇷', category: 'latinoamerica' },
  { url: 'https://www.tycsports.com/rss.xml', name: 'TyC Sports', country: 'Argentina', flag: '🇦🇷', category: 'latinoamerica' },

  // ── BRASIL ─────────────────────────────────────────────────
  { url: 'https://ge.globo.com/rss/ultimas-noticias/', name: 'Globo Esporte', country: 'Brasil', flag: '🇧🇷', category: 'latinoamerica' },
  { url: 'https://www.uol.com.br/esporte/futebol/copa-do-mundo/rss.xml', name: 'UOL Esporte', country: 'Brasil', flag: '🇧🇷', category: 'latinoamerica' },

  // ── MÉXICO ─────────────────────────────────────────────────
  { url: 'https://www.mediotiempo.com/feed', name: 'Mediotiempo', country: 'México', flag: '🇲🇽', category: 'latinoamerica' },
  { url: 'https://www.record.com.mx/rss', name: 'Récord', country: 'México', flag: '🇲🇽', category: 'latinoamerica' },
  { url: 'https://www.eluniversal.com.mx/rss/deportes.xml', name: 'El Universal', country: 'México', flag: '🇲🇽', category: 'latinoamerica' },

  // ── COLOMBIA ───────────────────────────────────────────────
  { url: 'https://www.eltiempo.com/rss/deportes.xml', name: 'El Tiempo', country: 'Colombia', flag: '🇨🇴', category: 'latinoamerica' },
  { url: 'https://www.elespectador.com/deportes/feed/', name: 'El Espectador', country: 'Colombia', flag: '🇨🇴', category: 'latinoamerica' },

  // ── URUGUAY ────────────────────────────────────────────────
  { url: 'https://ovacion.com.uy/rss', name: 'Ovación', country: 'Uruguay', flag: '🇺🇾', category: 'latinoamerica' },

  // ── CHILE ──────────────────────────────────────────────────
  { url: 'https://www.biobiochile.cl/rss/categorias/deporte.rss', name: 'BioBío Chile', country: 'Chile', flag: '🇨🇱', category: 'latinoamerica' },

  // ── ESPAÑA ─────────────────────────────────────────────────
  { url: 'https://e00-marca.uecdn.es/rss/futbol/mundial.xml', name: 'Marca', country: 'España', flag: '🇪🇸', category: 'europa' },
  { url: 'https://as.com/rss/tags/copa_del_mundo.xml', name: 'AS', country: 'España', flag: '🇪🇸', category: 'europa' },
  { url: 'https://feeds.elpais.com/mrss-s/pages/ep/site/elpais.com/section/deportes/portada', name: 'El País', country: 'España', flag: '🇪🇸', category: 'europa' },
  { url: 'https://www.mundodeportivo.com/rss/futbol/mundial', name: 'Mundo Deportivo', country: 'España', flag: '🇪🇸', category: 'europa' },

  // ── GLOBAL ─────────────────────────────────────────────────
  { url: 'https://www.goal.com/feeds/es/news', name: 'Goal.com', country: 'Global', flag: '🌍', category: 'global' },
  { url: 'https://www.espndeportes.com/rss/news', name: 'ESPN Deportes', country: 'Global', flag: '🌍', category: 'global' },
  { url: 'https://feeds.bbci.co.uk/sport/football/rss.xml', name: 'BBC Sport', country: 'Global', flag: '🌍', category: 'global' },
  { url: 'https://www.skysports.com/rss/12040', name: 'Sky Sports', country: 'Global', flag: '🌍', category: 'global' },
  { url: 'https://www.fifaclubworldcup.com/en/news.rss', name: 'FIFA News', country: 'Global', flag: '🌍', category: 'global' },
];

// Para la Home: feeds de MAYOR ALCANCE internacional
export const RSS_FEEDS_FEATURED: RssFeed[] = RSS_FEEDS.filter(f =>
  ['Marca', 'Goal.com', 'ESPN Deportes', 'Olé', 'Globo Esporte', 'Mediotiempo', 'BBC Sport'].includes(f.name)
);