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
  const tryWiki = async (lang: string, searchName: string): Promise<string | null> => {
    const url = `https://${lang}.wikipedia.org/w/api.php?action=query&format=json&formatversion=2&prop=pageimages&piprop=original|thumbnail&pithumbsize=600&titles=${encodeURIComponent(searchName)}`;
    try {
      const res = await fetch(url, { signal: AbortSignal.timeout(6000) });
      if (!res.ok) return null;
      const data = await res.json() as any;
      const pages = data?.query?.pages ?? [];
      if (!Array.isArray(pages) || pages.length === 0) return null;
      const page = pages[0];
      if (!page || page.missing) return null;
      return page.original?.source || page.thumbnail?.source || null;
    } catch {
      return null;
    }
  };

  // Generar variaciones del nombre para aumentar la tasa de aciertos
  const nameVariants = [
    name,                                          // "Lionel Messi"
    name.split(' ').reverse().join(' '),           // "Messi Lionel"
    name.split(' ').slice(-1).join(' '),           // "Messi" (apellido)
    name.split(' ').slice(0, 2).join(' '),         // "Lionel Messi" (primeros 2 tokens)
  ].filter((v, i, arr) => v && arr.indexOf(v) === i); // deduplicar

  for (const variant of nameVariants) {
    // Probar español primero, luego inglés
    const esResult = await tryWiki('es', variant);
    if (esResult) return esResult;
    const enResult = await tryWiki('en', variant);
    if (enResult) return enResult;
  }

  return null;
}

// Busca el equipo nacional en TheSportsDB y retorna su idTeam
async function findNationalTeamId(teamName: string): Promise<string | null> {
  try {
    const url = `${BASE_URL}/searchteams.php?t=${encodeURIComponent(teamName)}`;
    const res = await fetch(url, { signal: AbortSignal.timeout(6000) });
    if (!res.ok) return null;
    const data = await res.json() as any;
    const teams: any[] = data?.teams ?? [];
    if (!teams.length) return null;

    // Priorizar equipos nacionales (strSport === 'Soccer' y sin 'FC'/'Club'/'SC' en el nombre)
    const national = teams.find(
      (t) =>
        t.strSport === 'Soccer' &&
        !/\b(fc|sc|ac|club|united|city)\b/i.test(t.strTeam ?? '')
    ) ?? teams[0];

    return national?.idTeam ?? null;
  } catch {
    return null;
  }
}

// Dado el idTeam de la selección nacional, retorna un mapa nombre → URL de foto
// Estas fotos son en contexto de selección nacional (camiseta del país)
async function fetchNationalTeamPhotoMap(teamId: string): Promise<Map<string, string>> {
  const map = new Map<string, string>();
  try {
    const url = `${BASE_URL}/lookup_all_players.php?id=${teamId}`;
    const res = await fetch(url, { signal: AbortSignal.timeout(8000) });
    if (!res.ok) return map;
    const data = await res.json() as any;
    const players: any[] = data?.player ?? [];

    for (const p of players) {
      const photo = p.strThumb || p.strCutout || p.strRender;
      if (p.strPlayer && photo) {
        map.set(p.strPlayer.trim().toLowerCase(), photo);
      }
    }
  } catch {
    // Ignorar — el mapa quedará vacío y se usarán los fallbacks individuales
  }
  return map;
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
    const { names, teamName } = JSON.parse(event.body ?? '{}') as { names?: string[]; teamName?: string };
    if (!names?.length) {
      return { statusCode: 400, body: JSON.stringify({ error: 'names requerido' }) };
    }

    const uniqueNames = [...new Set(names.map((n) => n.trim()).filter(Boolean))].slice(0, 35);
    const photos: Record<string, string | null> = {};

    const cache = new Map<string, string | null>();
    const batchSize = 5;

    // Paso 1: lookup del equipo nacional (una sola llamada para todos los jugadores)
    let nationalPhotoMap = new Map<string, string>();
    if (teamName) {
      const teamId = await findNationalTeamId(teamName);
      if (teamId) {
        nationalPhotoMap = await fetchNationalTeamPhotoMap(teamId);
      }
    }

    // Paso 2: para cada jugador, usar foto nacional si existe; si no, cascada individual
    for (let i = 0; i < uniqueNames.length; i += batchSize) {
      const batch = uniqueNames.slice(i, i + batchSize);
      await Promise.all(
        batch.map(async (name) => {
          if (cache.has(name)) {
            photos[name] = cache.get(name) ?? null;
            return;
          }
          // Buscar en el mapa de fotos del seleccionado (coincidencia exacta o parcial)
          const normalizedName = name.trim().toLowerCase();
          const tokens = normalizedName.split(' ').filter(t => t.length > 2);
          const nationalPhoto =
            nationalPhotoMap.get(normalizedName) ??
            [...nationalPhotoMap.entries()].find(([k]) => {
              const kTokens = k.split(' ').filter(t => t.length > 2);
              // Coincidencia si al menos un token significativo coincide en ambos sentidos
              return tokens.some(t => kTokens.some(kt => kt.startsWith(t) || t.startsWith(kt)));
            })?.[1] ??
            null;

          if (nationalPhoto) {
            photos[name] = nationalPhoto;
            cache.set(name, nationalPhoto);
            return;
          }

          // Fallback individual: API-Football → TheSportsDB por nombre → Wikipedia
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
