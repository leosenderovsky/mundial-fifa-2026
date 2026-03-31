/**
 * Netlify Function: thesportsdb
 *
 * Proxy simple para TheSportsDB (API gratuita).
 * Usa la key pública "123" para el v1 API.
 */

const BASE_URL = 'https://www.thesportsdb.com/api/v1/json/123';

export const handler = async (event: {
  httpMethod: string;
  queryStringParameters?: Record<string, string>;
}) => {
  if (event.httpMethod !== 'GET') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  const params = event.queryStringParameters ?? {};
  const endpoint = params.endpoint;
  if (!endpoint || typeof endpoint !== 'string') {
    return { statusCode: 400, body: JSON.stringify({ error: 'endpoint requerido' }) };
  }

  if (!endpoint.startsWith('/searchteams.php') && !endpoint.startsWith('/lookup_all_players.php')) {
    return { statusCode: 400, body: JSON.stringify({ error: 'endpoint no permitido' }) };
  }

  const { endpoint: _endpoint, ...rest } = params;
  const query = new URLSearchParams(rest).toString();
  const url = `${BASE_URL}${endpoint}${query ? `?${query}` : ''}`;

  try {
    const res = await fetch(url);
    const text = await res.text();
    return {
      statusCode: res.status,
      headers: { 'Content-Type': 'application/json' },
      body: text,
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Error al contactar TheSportsDB', detail: String(err) }),
    };
  }
};
