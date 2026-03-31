/**
 * Netlify Function: football-data
 *
 * Proxy seguro para la API de football-data.org.
 * Configurar en Netlify -> Site settings -> Environment variables:
 *   FOOTBALL_DATA_API_KEY = <tu API key>
 */

const BASE_URL = 'https://api.football-data.org/v4';

export const handler = async (event: {
  httpMethod: string;
  queryStringParameters?: Record<string, string>;
}) => {
  if (event.httpMethod !== 'GET') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  const apiKey = process.env.FOOTBALL_DATA_API_KEY;
  if (!apiKey) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'FOOTBALL_DATA_API_KEY no configurada en el servidor' }),
    };
  }

  const params = event.queryStringParameters ?? {};
  const endpoint = params.endpoint;
  if (!endpoint || typeof endpoint !== 'string') {
    return { statusCode: 400, body: JSON.stringify({ error: 'endpoint requerido' }) };
  }

  if (!endpoint.startsWith('/competitions/WC/')) {
    return { statusCode: 400, body: JSON.stringify({ error: 'endpoint no permitido' }) };
  }

  const { endpoint: _endpoint, ...rest } = params;
  const query = new URLSearchParams(rest).toString();
  const url = `${BASE_URL}${endpoint}${query ? `?${query}` : ''}`;

  try {
    const res = await fetch(url, {
      headers: { 'X-Auth-Token': apiKey },
    });

    const text = await res.text();
    return {
      statusCode: res.status,
      headers: { 'Content-Type': 'application/json' },
      body: text,
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Error al contactar football-data', detail: String(err) }),
    };
  }
};
