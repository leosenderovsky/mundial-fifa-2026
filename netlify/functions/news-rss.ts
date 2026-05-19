/**
 * Netlify Function: news-rss
 * Agrega feeds RSS de medios latinoamericanos y filtra noticias del Mundial 2026.
 */

const FEEDS = [
  { source: 'Infobae Deportes', url: 'https://www.infobae.com/feeds/rss/deportes.xml' },
  { source: 'Clarín Deportes', url: 'https://www.clarin.com/rss/deportes/' },
  { source: 'La Nación Deportes', url: 'https://www.lanacion.com.ar/arc/outboundfeeds/rss/category/deportes/?outputType=xml' },
  { source: 'TyC Sports', url: 'https://www.tycsports.com/rss.html' },
  { source: 'Globo Esporte', url: 'https://ge.globo.com/dynamo/rss2.xml' },
  { source: 'UOL Esporte', url: 'https://rss.uol.com.br/feed/esporte.xml' },
  { source: 'LANCE!', url: 'https://www.lance.com.br/feeds/rss' },
  { source: 'El Tiempo Deportes', url: 'https://www.eltiempo.com/rss/deportes.xml' },
  { source: 'El Espectador Deportes', url: 'https://www.elespectador.com/arc/outboundfeeds/rss/category/deportes/?outputType=xml' },
  { source: 'La Tercera - El Deportivo', url: 'https://www.latercera.com/arcio/rss/category/el-deportivo/' },
  { source: 'BioBioChile Deportes', url: 'https://www.biobiochile.cl/lista/categoria/deportes/feed' },
  { source: 'Emol Deportes', url: 'https://www.emol.com/rss/emol/deportes.xml' },
  { source: 'El Comercio Deportes', url: 'https://elcomercio.pe/arc/outboundfeeds/rss/category/deporte-total/?outputType=xml' },
  { source: 'Depor', url: 'https://depor.com/arc/outboundfeeds/rss/?outputType=xml' },
  { source: 'RPP Deportes', url: 'https://rpp.pe/rss/deportes.xml' },
  { source: 'El Universal Deportes', url: 'https://www.eluniversal.com.mx/rss.xml' },
  { source: 'Récord', url: 'https://www.record.com.mx/rss.xml' },
  { source: 'Mediotiempo', url: 'https://www.mediotiempo.com/feeds/rss' },
  { source: 'Ovación - El País', url: 'https://www.elpais.com.uy/rss/ovacion.xml' },
  { source: 'ABC Color Deportes', url: 'https://www.abc.com.py/rss/deportes.xml' },
  { source: 'ESPN FC', url: 'https://www.espn.com/espn/rss/soccer/news' },
  { source: 'FIFA Official News', url: 'https://inside.fifa.com/rss-feeds/news' },
  { source: 'TUDN', url: 'https://www.tudn.com/rss' },
  { source: 'BBC Football', url: 'https://feeds.bbci.co.uk/sport/football/rss.xml' },
  { source: 'The Guardian Football', url: 'https://www.theguardian.com/football/rss' },
  { source: 'Goal.com', url: 'https://www.goal.com/feeds/en/news' },
];

const KEYWORDS = [
  'mundial',
  'world cup',
  'copa del mundo',
  'fifa 2026',
  'mundial 2026',
  'mundial fifa',
  'fifa world cup',
  'copa mundial',
  'fifa',
  'selección',
  'selecciones',
  'grupos del mundial',
  'sorteo del mundial',
];

interface NewsItem {
  title: string;
  summary: string;
  category: string;
  source: string;
  date: string;
  emoji: string;
  tags: string[];
  url: string;
}

function decodeHtml(text: string): string {
  return text
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
    .replace(/<[^>]+>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .trim();
}

function extractTag(block: string, tag: string): string {
  const cdata = new RegExp(`<${tag}[^>]*><!\\[CDATA\\[([\\s\\S]*?)\\]\\]><\\/${tag}>`, 'i').exec(block);
  if (cdata) return decodeHtml(cdata[1]);
  const plain = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, 'i').exec(block);
  return plain ? decodeHtml(plain[1]) : '';
}

function parseRss(xml: string, source: string): NewsItem[] {
  const items: NewsItem[] = [];
  const blocks = xml.match(/<item[\s\S]*?<\/item>/gi) ?? xml.match(/<entry[\s\S]*?<\/entry>/gi) ?? [];

  for (const block of blocks) {
    const title = extractTag(block, 'title');
    const link =
      extractTag(block, 'link') ||
      (/<link[^>]+href="([^"]+)"/i.exec(block)?.[1] ?? '');
    const description =
      extractTag(block, 'description') ||
      extractTag(block, 'summary') ||
      extractTag(block, 'content');
    const pubDate =
      extractTag(block, 'pubDate') ||
      extractTag(block, 'published') ||
      extractTag(block, 'updated');

    if (!title) continue;

    const haystack = `${title} ${description}`.toLowerCase();
    const matchesWorldCup = KEYWORDS.some((kw) => haystack.includes(kw));
    if (!matchesWorldCup) continue;

    const date = pubDate
      ? new Date(pubDate).toLocaleDateString('es-AR', { day: 'numeric', month: 'short', year: 'numeric' })
      : new Date().toLocaleDateString('es-AR', { day: 'numeric', month: 'short', year: 'numeric' });

    let category = 'Análisis';
    if (/estadio|sede|venue/i.test(haystack)) category = 'Estadios';
    else if (/grupo|fixture|partido|calendario/i.test(haystack)) category = 'Fixture';
    else if (/selecci|plantel|convoca/i.test(haystack)) category = 'Selecciones';
    else if (/messi|mbapp|vinici|bellingham|figura|gol/i.test(haystack)) category = 'Figuras';

    items.push({
      title,
      summary: description.slice(0, 220) + (description.length > 220 ? '…' : ''),
      category,
      source,
      date,
      emoji: category === 'Estadios' ? '🏟️' : category === 'Fixture' ? '📅' : '⚽',
      tags: ['Mundial 2026'],
      url: link,
    });
  }

  return items;
}

export const handler = async () => {
  try {
    const results = await Promise.allSettled(
      FEEDS.map(async ({ source, url }) => {
        const res = await fetch(url, {
          headers: { 'User-Agent': 'MundialFIFA2026/1.0 (RSS aggregator)' },
          signal: AbortSignal.timeout(8000),
        });
        if (!res.ok) return [] as NewsItem[];
        const xml = await res.text();
        return parseRss(xml, source);
      })
    );

    const merged = results
      .flatMap((r) => (r.status === 'fulfilled' ? r.value : []))
      .filter((item, index, arr) => arr.findIndex((x) => x.title === item.title) === index)
      .slice(0, 18);

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=900',
      },
      body: JSON.stringify({ items: merged }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Error al obtener noticias', detail: String(err), items: [] }),
    };
  }
};
