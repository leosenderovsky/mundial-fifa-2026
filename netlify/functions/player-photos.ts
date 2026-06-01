/**
 * Netlify Function: player-photos
 * Busca fotos de jugadores/DT en el siguiente orden:
 *  1. API-Football (api-sports.io)
 *  2. TheSportsDB (searchplayers.php)
 *  3. Wikipedia (pageimages)
 */

// Minimal declaration to satisfy TypeScript in the editor for server-side env
declare const process: any;

const BASE_URL = 'https://www.thesportsdb.com/api/v1/json/123';

interface SportsDbPlayer {
  strPlayer?: string;
  strThumb?: string;
  strCutout?: string;
  strRender?: string;
  strNationality?: string;
}

async function findWikiImage(name: string): Promise<string | null> {
  const url = `https://es.wikipedia.org/w/api.php?action=query&format=json&formatversion=2&prop=pageimages&piprop=original|thumbnail&pithumbsize=600&titles=${encodeURIComponent(name)}`;
  const res = await fetch(url, { signal: AbortSignal.timeout(6000) });
  if (!res.ok) return null;

  const data = await res.json() as any;
  const pages = data?.query?.pages ?? [];
  if (!Array.isArray(pages) || pages.length === 0) return null;

  const page = pages[0];
  if (!page || page.missing) return null;

  return page.original?.source || page.thumbnail?.source || null;
}

// Mantener la implementación existente como fallback para TheSportsDB
async function findPhotoByNameTheSportsDB(name: string): Promise<string | null> {
  const url = `${BASE_URL}/searchplayers.php?p=${encodeURIComponent(name)}`;
  const res = await fetch(url, { signal: AbortSignal.timeout(6000) });
  if (!res.ok) return null;

  const data = (await res.json()) as { player?: SportsDbPlayer[] };
  const players = data.player ?? [];
  if (!players.length) return findWikiImage(name);

  const normalized = name.trim().toLowerCase();
  const match =
    players.find((p) => p.strPlayer?.trim().toLowerCase() === normalized) ??
    players.find((p) => p.strPlayer?.toLowerCase().includes(normalized.split(' ')[0] ?? '')) ??
    players[0];

  const photo = match?.strThumb || match?.strCutout || match?.strRender || null;
  return photo ?? findWikiImage(name);
}

// API-Football lookup
async function findPhotoByNameApiFootball(name: string): Promise<string | null> {
  const key = process.env.API_SPORTS_KEY;
  if (!key) return null;

  // Intento 1: buscar en el contexto del Mundial 2026
  try {
    let url = `https://v3.football.api-sports.io/players?search=${encodeURIComponent(name)}&league=1&season=2026`;
    let res = await fetch(url, {
      headers: { 'x-apisports-key': key },
      signal: AbortSignal.timeout(6000),
    });
    if (res.ok) {
      const data = await res.json();
      const photo = data?.response?.[0]?.player?.photo;
      if (photo) return photo;
    }

    // Intento 2: búsqueda global (sin filtro de liga)
    url = `https://v3.football.api-sports.io/players?search=${encodeURIComponent(name)}`;
    res = await fetch(url, {
      headers: { 'x-apisports-key': key },
      signal: AbortSignal.timeout(6000),
    });
    if (res.ok) {
      const data = await res.json();
      return data?.response?.[0]?.player?.photo ?? null;
    }
  } catch (err) {
    // Silenciar errores para permitir fallbacks
    return null;
  }

  return null;
}

// Orquestador: intenta API-Football -> TheSportsDB -> Wikipedia
async function findPhotoByName(name: string, cache?: Map<string, string | null>): Promise<string | null> {
  const keyName = name.trim();
  if (cache && cache.has(keyName)) return cache.get(keyName) ?? null;

  // 1. API-Football
  const apiFootballPhoto = await findPhotoByNameApiFootball(name);
  if (apiFootballPhoto) {
    cache?.set(keyName, apiFootballPhoto);
    return apiFootballPhoto;
  }

  // 2. TheSportsDB
  const sportsDbPhoto = await findPhotoByNameTheSportsDB(name);
  if (sportsDbPhoto) {
    cache?.set(keyName, sportsDbPhoto);
    return sportsDbPhoto;
  }

  // 3. Wikipedia
  const wiki = await findWikiImage(name);
  cache?.set(keyName, wiki);
  return wiki;
}

export const handler = async (event: { httpMethod: string; body?: string }) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  try {
    const { names } = JSON.parse(event.body ?? '{}') as { names?: string[] };
    if (!names?.length) {
      return { statusCode: 400, body: JSON.stringify({ error: 'names requerido' }) };
    }

    const uniqueNames = [...new Set(names.map((n) => n.trim()).filter(Boolean))].slice(0, 35);
    const photos: Record<string, string | null> = {};

    const cache = new Map<string, string | null>();
    const batchSize = 5;

    for (let i = 0; i < uniqueNames.length; i += batchSize) {
      const batch = uniqueNames.slice(i, i + batchSize);
      await Promise.all(
        batch.map(async (name) => {
          if (cache.has(name)) {
            photos[name] = cache.get(name) ?? null;
            return;
          }
          const p = await findPhotoByName(name, cache);
          photos[name] = p;
          cache.set(name, p);
        })
      );

      // Delay between batches to reduce burst rate
      if (i + batchSize < uniqueNames.length) {
        await new Promise((r) => setTimeout(r, 200));
      }
    }

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=86400',
      },
      body: JSON.stringify({ photos }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Error al buscar fotos', detail: String(err) }),
    };
  }
};
