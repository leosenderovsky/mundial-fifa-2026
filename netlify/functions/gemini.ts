/**
 * Netlify Function: gemini
 *
 * Proxy seguro para la API de Google Gemini.
 * La clave GEMINI_API_KEY se configura en Netlify como variable de entorno
 * del servidor (sin el prefijo VITE_), así nunca llega al bundle del cliente.
 *
 * Configurar en Netlify → Site settings → Environment variables:
 *   GEMINI_API_KEY = <tu clave de Google AI Studio>
 */

const GEMINI_URL =
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

export const handler = async (event: {
  httpMethod: string;
  body: string | null;
}) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'GEMINI_API_KEY no configurada en el servidor' }),
    };
  }

  let prompt: string;
  try {
    const parsed = JSON.parse(event.body ?? '{}');
    prompt = parsed.prompt;
    if (!prompt || typeof prompt !== 'string') throw new Error('prompt requerido');
  } catch {
    return { statusCode: 400, body: JSON.stringify({ error: 'Body inválido. Se requiere { prompt: string }' }) };
  }

  try {
    const res = await fetch(`${GEMINI_URL}?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { maxOutputTokens: 1024 },
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      return { statusCode: res.status, body: JSON.stringify({ error: err }) };
    }

    const data = await res.json();
    const text: string = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? '';

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Error al contactar Gemini', detail: String(err) }),
    };
  }
};
