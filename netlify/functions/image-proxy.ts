// Netlify Function: image-proxy
// Proxy external images (crests, player photos) to avoid expanding CSP.
declare const process: any;

const ALLOWED_HOSTS = ['crests.football-data.org', 'media.api-sports.io', 'upload.wikimedia.org'];

export const handler = async (event: { httpMethod: string; queryStringParameters?: Record<string, string> }) => {
  if (event.httpMethod !== 'GET') {
    return { statusCode: 405, body: 'Method not allowed' };
  }

  const url = event.queryStringParameters?.url;
  if (!url) return { statusCode: 400, body: 'Missing url parameter' };

  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch (err) {
    return { statusCode: 400, body: 'Invalid url' };
  }

  if (!['http:', 'https:'].includes(parsed.protocol)) {
    return { statusCode: 400, body: 'Invalid protocol' };
  }

  if (!ALLOWED_HOSTS.includes(parsed.hostname)) {
    return { statusCode: 403, body: 'Host not allowed' };
  }

  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(10000) });
    if (!res.ok) return { statusCode: res.status, body: `Upstream error ${res.status}` };

    const contentType = res.headers.get('content-type') || 'application/octet-stream';
    const buffer = Buffer.from(await res.arrayBuffer());

    return {
      statusCode: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=86400',
      },
      isBase64Encoded: true,
      body: buffer.toString('base64'),
    };
  } catch (err: any) {
    return { statusCode: 500, body: `Fetch error: ${String(err)}` };
  }
};
