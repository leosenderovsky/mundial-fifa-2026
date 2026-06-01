/**
 * Netlify Function: api-football-proxy
 * Proxy simple para API-Football (api-sports.io).
 * Endpoints permitidos: /players, /players/squads
 */

// Minimal declaration to satisfy TypeScript in the editor for server-side env
declare const process: any;

const BASE_URL = 'https://v3.football.api-sports.io';

export const handler = async (event: { httpMethod: string; queryStringParameters?: Record<string, string> }) => {
  if (event.httpMethod !== 'GET') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  const params = event.queryStringParameters ?? {};
  const endpoint = params.endpoint;
  if (!endpoint || typeof endpoint !== 'string') {
    return { statusCode: 400, body: JSON.stringify({ error: 'endpoint requerido' }) };
  }

  if (!endpoint.startsWith('/players') && !endpoint.startsWith('/players/squads')) {
    return { statusCode: 400, body: JSON.stringify({ error: 'endpoint no permitido' }) };
  }

  const key = process.env.API_SPORTS_KEY;
  if (!key) {
    return { statusCode: 500, body: JSON.stringify({ error: 'API_SPORTS_KEY no configurada en el entorno' }) };
  }

  const { endpoint: _endpoint, ...rest } = params;
  const query = new URLSearchParams(rest).toString();
  const url = `${BASE_URL}${endpoint}${query ? `?${query}` : ''}`;

  try {
    const res = await fetch(url, { headers: { 'x-apisports-key': key } });
    const text = await res.text();
    return {
      statusCode: res.status,
      headers: { 'Content-Type': 'application/json' },
      body: text,
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Error al contactar API-Football', detail: String(err) }),
    };
  }
};
