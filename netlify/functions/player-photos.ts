/**
 * Netlify Function: player-photos
 * Busca fotos de jugadores/DT en TheSportsDB por nombre (searchplayers.php).
 */

const BASE_URL = 'https://www.thesportsdb.com/api/v1/json/123';

interface SportsDbPlayer {
  strPlayer?: string;
  strThumb?: string;
  strCutout?: string;
  strRender?: string;
  strNationality?: string;
}

async function findPhotoByName(name: string): Promise<string | null> {
  const url = `${BASE_URL}/searchplayers.php?p=${encodeURIComponent(name)}`;
  const res = await fetch(url, { signal: AbortSignal.timeout(6000) });
  if (!res.ok) return null;

  const data = (await res.json()) as { player?: SportsDbPlayer[] };
  const players = data.player ?? [];
  if (!players.length) return null;

  const normalized = name.trim().toLowerCase();
  const match =
    players.find((p) => p.strPlayer?.trim().toLowerCase() === normalized) ??
    players.find((p) => p.strPlayer?.toLowerCase().includes(normalized.split(' ')[0] ?? '')) ??
    players[0];

  return match?.strThumb || match?.strCutout || match?.strRender || null;
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

    await Promise.all(
      uniqueNames.map(async (name) => {
        photos[name] = await findPhotoByName(name);
      })
    );

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
