// CommonJS Netlify Function fallback (use .cjs to avoid ESM "type": "module" warnings)
const ALLOWED_HOSTS = ['crests.football-data.org', 'media.api-sports.io', 'upload.wikimedia.org', 'www.thesportsdb.com', 'thesportsdb.com', 'images.thesportsdb.com'];

module.exports.handler = async function (event) {
  if (event.httpMethod !== 'GET') {
    return { statusCode: 405, body: 'Method not allowed' };
  }

  const url = event.queryStringParameters && event.queryStringParameters.url;
  if (!url) return { statusCode: 400, body: 'Missing url parameter' };

  let parsed;
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
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);
    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timeout);

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
  } catch (err) {
    return { statusCode: 500, body: `Fetch error: ${String(err)}` };
  }
};
