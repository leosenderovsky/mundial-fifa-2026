// netlify/functions/rss-proxy.js
// Proxy server-side para RSS feeds — evita CORS y protege URLs
// Parsea XML, filtra por keywords del Mundial 2026, retorna JSON normalizado

const { XMLParser } = require('fast-xml-parser');

// Keywords unificados (español + inglés + portugués)
const MUNDIAL_KEYWORDS = [
  // Español
  'mundial 2026', 'copa del mundo 2026', 'copa mundial 2026',
  'mundial fifa', 'world cup 2026', 'fifa 2026',
  'mundial de futbol', 'mundial de fútbol',
  'eliminatorias mundial', 'fase de grupos mundial',
  'octavos de final', 'cuartos de final', 'semifinal mundial', 'final mundial',
  'goleadores mundial', 'fixture mundial', 'sorteo mundial',
  'estadio azteca', 'metlife', 'bc place',
  'argentina mundial', 'brasil mundial', 'mexico mundial',
  'españa mundial', 'francia mundial', 'alemania mundial',
  'portugal mundial', 'marruecos mundial', 'uruguay mundial',
  // Inglés
  '2026 world cup', 'world cup 2026', 'fifa 2026',
  'world cup squad', 'world cup draw', 'world cup group',
  'world cup final', 'world cup host', 'world cup qualifier',
  // Portugués
  'copa do mundo 2026', 'copa do mundo', 'seleção mundial',
  'copa fifa', 'oitavas de final', 'quartas de final',
];

/**
 * Verifica si un texto contiene al menos un keyword del mundial
 */
function isMundialRelated(text = '') {
  const lower = text.toLowerCase();
  return MUNDIAL_KEYWORDS.some(kw => lower.includes(kw));
}

/**
 * Normaliza un item de RSS a formato estándar
 */
function normalizeItem(item, sourceId, sourceName, country, countryCode, language, flag, category) {
  const title = item.title || '';
  const description = stripHtml(item.description || item['content:encoded'] || '');
  const link = item.link || item.guid || '';
  const pubDate = item.pubDate || item.published || item['dc:date'] || '';
  const imageUrl = extractImage(item) || null;   // null explícito, no string vacío

  return {
    id: `${sourceId}-${Buffer.from(link).toString('base64').slice(0, 12)}`,
    title: stripHtml(title).trim(),
    description: description.slice(0, 280).trim(),
    link,
    pubDate: pubDate ? new Date(pubDate).toISOString() : new Date().toISOString(),
    imageUrl,
    sourceId,
    sourceName,
    country,
    countryCode,
    language,
    flag: flag || '🌍',
    category: category || 'global',
  };
}

function stripHtml(str = '') {
  return str
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&/g, '&')
    .replace(/</g, '<')
    .replace(/>/g, '>')
    .replace(/"/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s{2,}/g, ' ')
    .trim();
}

function extractImage(item) {
  // 1. media:thumbnail
  const mt = item['media:thumbnail'];
  if (mt) {
    if (Array.isArray(mt) && mt[0]?.['@_url']) return mt[0]['@_url'];
    if (mt['@_url']) return mt['@_url'];
  }

  // 2. media:content con tipo imagen
  const mc = item['media:content'];
  if (mc) {
    const arr = Array.isArray(mc) ? mc : [mc];
    const img = arr.find((m) => m['@_type']?.startsWith('image/') || m['@_url']);
    if (img?.['@_url']) return img['@_url'];
  }

  // 3. enclosure con tipo imagen
  const enc = item.enclosure;
  if (enc?.['@_url'] && enc?.['@_type']?.startsWith('image/')) return enc['@_url'];

  // 4. itunes:image
  if (item['itunes:image']?.['@_href']) return item['itunes:image']['@_href'];

  // 5. image directo (algunos feeds Atom)
  if (typeof item.image === 'string' && item.image.startsWith('http')) return item.image;
  if (item.image?.url) return item.image.url;

  // 6. Buscar <img src="..."> dentro de content:encoded o description
  const content = item['content:encoded'] || item.description || '';
  if (content) {
    const imgMatch = content.match(/<img[^>]+src=["']([^"']+)["']/i);
    if (imgMatch?.[1] && imgMatch[1].startsWith('http')) return imgMatch[1];
    // También buscar srcset
    const srcsetMatch = content.match(/srcset=["']([^\s"']+)/i);
    if (srcsetMatch?.[1] && srcsetMatch[1].startsWith('http')) return srcsetMatch[1];
  }

  // 7. Buscar URL de imagen en el campo description plano
  const desc = item.description || '';
  const urlMatch = desc.match(/https?:\/\/[^\s"'<>]+\.(?:jpg|jpeg|png|webp|gif)(?:\?[^\s"'<>]*)?/i);
  if (urlMatch?.[0]) return urlMatch[0];

  return null;
}

/**
 * Obtiene y parsea un feed RSS
 */
async function fetchFeed(source) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000); // 8s timeout por feed

  try {
    const res = await fetch(source.rss, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; MundialFIFA2026Bot/1.0)',
        'Accept': 'application/rss+xml, application/xml, text/xml, */*',
      },
    });

    clearTimeout(timeout);

    if (!res.ok) {
      console.warn(`[rss-proxy] Feed ${source.id} returned ${res.status}`);
      return [];
    }

    const xml = await res.text();

    const parser = new XMLParser({
      ignoreAttributes: false,
      attributeNamePrefix: '@_',
      allowBooleanAttributes: true,
    });

    const parsed = parser.parse(xml);
    const channel = parsed?.rss?.channel || parsed?.feed;
    if (!channel) return [];

    // Soporta RSS 2.0 (items) y Atom (entry)
    const rawItems = channel.item
      ? Array.isArray(channel.item) ? channel.item : [channel.item]
      : channel.entry
      ? Array.isArray(channel.entry) ? channel.entry : [channel.entry]
      : [];

    // Normalizar y filtrar por keywords mundial
    return rawItems
      .map(item => normalizeItem(
        item,
        source.id,
        source.name,
        source.country,
        source.countryCode,
        source.language,
        source.flag,
        source.category,
      ))
      .filter(item => {
        const searchText = `${item.title} ${item.description}`;
        return isMundialRelated(searchText);
      })
      .slice(0, 8); // máximo 8 por fuente

  } catch (err) {
    clearTimeout(timeout);
    if (err.name !== 'AbortError') {
      console.warn(`[rss-proxy] Error fetching ${source.id}:`, err.message);
    }
    return [];
  }
}

// Caché en memoria del proceso (dura mientras la función esté caliente)
let memCache = null;
let cacheTime = 0;
const CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutos

exports.handler = async function (event) {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json',
    'Cache-Control': 'public, max-age=600',
  };

  // OPTIONS preflight
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers, body: '' };
  }

  // Devolver caché si está vigente
  if (memCache && Date.now() - cacheTime < CACHE_TTL_MS) {
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ articles: memCache, cached: true }),
    };
  }

  try {
    // Obtener lista de fuentes activas desde query param o usar todas
    // ?sources=infobae-arg,clarin-arg (opcional, para filtrar desde el cliente)
    const requestedIds = event.queryStringParameters?.sources
      ? event.queryStringParameters.sources.split(',')
      : null;

    // Importar fuentes (inlined para evitar dependencias de módulo ESM en Netlify CJS)
    // Las fuentes están hardcoded aquí para que la function sea autónoma
    const SOURCES = getSources();
    const activeSources = requestedIds
      ? SOURCES.filter(s => s.enabled && requestedIds.includes(s.id))
      : SOURCES.filter(s => s.enabled);

    // Fetch en paralelo con Promise.allSettled (resiliente a fallos individuales)
    const results = await Promise.allSettled(
      activeSources.map(source => fetchFeed(source))
    );

    let articles = results
      .filter(r => r.status === 'fulfilled')
      .flatMap(r => r.value);

    // Deduplicar por título similar (Levenshtein simplificado: si los primeros 60 chars son iguales)
    const seen = new Set();
    articles = articles.filter(article => {
      const key = article.title.slice(0, 60).toLowerCase().replace(/\s/g, '');
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });

    // Ordenar por fecha (más recientes primero)
    articles.sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));

    // Asegurar diversidad de fuentes: intercalar para que no aparezcan seguidas del mismo medio
    articles = interleaveBySource(articles);

    // Actualizar caché
    memCache = articles;
    cacheTime = Date.now();

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ articles, cached: false, total: articles.length }),
    };

  } catch (err) {
    console.error('[rss-proxy] Error general:', err);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Error al procesar feeds RSS', articles: [] }),
    };
  }
};

/**
 * Intercala artículos para diversidad de fuentes
 */
function interleaveBySource(articles) {
  const bySource = {};
  articles.forEach(a => {
    if (!bySource[a.sourceId]) bySource[a.sourceId] = [];
    bySource[a.sourceId].push(a);
  });

  const queues = Object.values(bySource);
  const result = [];
  let i = 0;

  while (queues.some(q => q.length > 0)) {
    const q = queues[i % queues.length];
    if (q.length > 0) result.push(q.shift());
    i++;
  }

  return result;
}

/**
 * Fuentes RSS hardcoded (espejo de rssSources.ts para uso en Netlify CJS)
 */
function getSources() {
  return [
    // ARGENTINA
    { id: 'infobae-arg',     name: 'Infobae Deportes',     country: 'Argentina',      countryCode: 'ar', language: 'es', flag: '🇦🇷', category: 'latinoamerica', rss: 'https://www.infobae.com/feeds/rss/deportes.xml',                                                                enabled: true },
    { id: 'clarin-arg',      name: 'Clarín Deportes',      country: 'Argentina',      countryCode: 'ar', language: 'es', flag: '🇦🇷', category: 'latinoamerica', rss: 'https://www.clarin.com/rss/deportes/',                                                                       enabled: true },
    { id: 'lanacion-arg',    name: 'La Nación',            country: 'Argentina',      countryCode: 'ar', language: 'es', flag: '🇦🇷', category: 'latinoamerica', rss: 'https://www.lanacion.com.ar/arc/outboundfeeds/rss/category/deportes/?outputType=xml',                        enabled: true },
    { id: 'ole-arg',         name: 'Olé',                  country: 'Argentina',      countryCode: 'ar', language: 'es', flag: '🇦🇷', category: 'latinoamerica', rss: 'https://www.ole.com.ar/rss/futbol/',                                                                         enabled: true },
    { id: 'tyc-arg',         name: 'TyC Sports',           country: 'Argentina',      countryCode: 'ar', language: 'es', flag: '🇦🇷', category: 'latinoamerica', rss: 'https://www.tycsports.com/rss.html',                                                                         enabled: true },
    // BRASIL
    { id: 'globo-bra',       name: 'Globo Esporte',        country: 'Brasil',         countryCode: 'br', language: 'pt', flag: '🇧🇷', category: 'latinoamerica', rss: 'https://ge.globo.com/dynamo/rss2.xml',                                                                       enabled: true },
    { id: 'lance-bra',       name: 'LANCE!',               country: 'Brasil',         countryCode: 'br', language: 'pt', flag: '🇧🇷', category: 'latinoamerica', rss: 'https://www.lance.com.br/feeds/rss',                                                                         enabled: true },
    // MÉXICO
    { id: 'mediotiempo-mex', name: 'Mediotiempo',          country: 'México',         countryCode: 'mx', language: 'es', flag: '🇲🇽', category: 'latinoamerica', rss: 'https://www.mediotiempo.com/feeds/rss',                                                                      enabled: true },
    { id: 'record-mex',      name: 'Récord',               country: 'México',         countryCode: 'mx', language: 'es', flag: '🇲🇽', category: 'latinoamerica', rss: 'https://www.record.com.mx/rss.xml',                                                                          enabled: true },
    { id: 'eluniversal-mex', name: 'El Universal',         country: 'México',         countryCode: 'mx', language: 'es', flag: '🇲🇽', category: 'latinoamerica', rss: 'https://www.eluniversal.com.mx/rss.xml',                                                                     enabled: true },
    // COLOMBIA
    { id: 'eltiempo-col',    name: 'El Tiempo',            country: 'Colombia',       countryCode: 'co', language: 'es', flag: '🇨🇴', category: 'latinoamerica', rss: 'https://www.eltiempo.com/rss/deportes.xml',                                                                  enabled: true },
    { id: 'espectador-col',  name: 'El Espectador',        country: 'Colombia',       countryCode: 'co', language: 'es', flag: '🇨🇴', category: 'latinoamerica', rss: 'https://www.elespectador.com/arc/outboundfeeds/rss/category/deportes/?outputType=xml',                      enabled: true },
    // CHILE
    { id: 'latercera-chi',   name: 'La Tercera',           country: 'Chile',          countryCode: 'cl', language: 'es', flag: '🇨🇱', category: 'latinoamerica', rss: 'https://www.latercera.com/arcio/rss/category/el-deportivo/',                                                enabled: true },
    { id: 'biobio-chi',      name: 'BioBioChile',          country: 'Chile',          countryCode: 'cl', language: 'es', flag: '🇨🇱', category: 'latinoamerica', rss: 'https://www.biobiochile.cl/lista/categoria/deportes/feed',                                                  enabled: true },
    { id: 'emol-chi',        name: 'Emol Deportes',        country: 'Chile',          countryCode: 'cl', language: 'es', flag: '🇨🇱', category: 'latinoamerica', rss: 'https://www.emol.com/rss/emol/deportes.xml',                                                                 enabled: true },
    // PERÚ
    { id: 'elcomercio-per',  name: 'El Comercio',          country: 'Perú',           countryCode: 'pe', language: 'es', flag: '🇵🇪', category: 'latinoamerica', rss: 'https://elcomercio.pe/arc/outboundfeeds/rss/category/deporte-total/?outputType=xml',                        enabled: true },
    { id: 'depor-per',       name: 'Depor',                country: 'Perú',           countryCode: 'pe', language: 'es', flag: '🇵🇪', category: 'latinoamerica', rss: 'https://depor.com/arc/outboundfeeds/rss/?outputType=xml',                                                    enabled: true },
    { id: 'rpp-per',         name: 'RPP Deportes',         country: 'Perú',           countryCode: 'pe', language: 'es', flag: '🇵🇪', category: 'latinoamerica', rss: 'https://rpp.pe/rss/deportes.xml',                                                                            enabled: true },
    // URUGUAY
    { id: 'ovacion-uru',     name: 'Ovación',              country: 'Uruguay',        countryCode: 'uy', language: 'es', flag: '🇺🇾', category: 'latinoamerica', rss: 'https://www.elpais.com.uy/rss/ovacion.xml',                                                                  enabled: true },
    // PARAGUAY
    { id: 'abc-par',         name: 'ABC Color',            country: 'Paraguay',       countryCode: 'py', language: 'es', flag: '🇵🇾', category: 'latinoamerica', rss: 'https://www.abc.com.py/rss/deportes.xml',                                                                    enabled: true },
    // ESPAÑA
    { id: 'marca-esp',       name: 'Marca',                country: 'España',         countryCode: 'es', language: 'es', flag: '🇪🇸', category: 'europa',        rss: 'https://e00-marca.uecdn.es/rss/futbol/mundial.xml',                                                          enabled: true },
    { id: 'as-esp',          name: 'AS',                   country: 'España',         countryCode: 'es', language: 'es', flag: '🇪🇸', category: 'europa',        rss: 'https://as.com/rss/tags/copa_del_mundo.xml',                                                                enabled: true },
    { id: 'elpais-esp',      name: 'El País',              country: 'España',         countryCode: 'es', language: 'es', flag: '🇪🇸', category: 'europa',        rss: 'https://feeds.elpais.com/mrss-s/pages/ep/site/elpais.com/section/deportes/portada',                         enabled: true },
    { id: 'mundodep-esp',    name: 'Mundo Deportivo',      country: 'España',         countryCode: 'es', language: 'es', flag: '🇪🇸', category: 'europa',        rss: 'https://www.mundodeportivo.com/rss/futbol/mundial',                                                          enabled: true },
    // GLOBAL
    { id: 'goal-int',        name: 'Goal.com',             country: 'Global',         countryCode: 'int', language: 'es', flag: '🌍', category: 'global',        rss: 'https://www.goal.com/feeds/es/news',                                                                        enabled: true },
    { id: 'espnfc-int',      name: 'ESPN FC',              country: 'Global',         countryCode: 'us',  language: 'en', flag: '🌍', category: 'global',        rss: 'https://www.espn.com/espn/rss/soccer/news',                                                                  enabled: true },
    { id: 'bbc-football',    name: 'BBC Football',         country: 'Reino Unido',    countryCode: 'gb',  language: 'en', flag: '🌍', category: 'global',        rss: 'https://feeds.bbci.co.uk/sport/football/rss.xml',                                                           enabled: true },
    { id: 'guardian-football',name: 'The Guardian',        country: 'Reino Unido',    countryCode: 'gb',  language: 'en', flag: '🌍', category: 'global',        rss: 'https://www.theguardian.com/football/rss',                                                                  enabled: true },
  ];
}
