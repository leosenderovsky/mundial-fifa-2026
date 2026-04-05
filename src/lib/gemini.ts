/**
 * Cliente Gemini — llama al proxy serverless en lugar de la API directamente.
 * Esto mantiene GEMINI_API_KEY fuera del bundle del cliente.
 *
 * El endpoint /.netlify/functions/gemini está disponible tanto en producción
 * (Netlify) como en desarrollo local con `netlify dev`.
 */

const FUNCTION_URL = '/.netlify/functions/gemini-proxy';

export async function getGeminiContent(prompt: string, cacheKey: string): Promise<string> {
  // Verificar caché primero (evita llamadas repetidas en la misma sesión)
  const cached = sessionStorage.getItem(cacheKey);
  if (cached) {
    try {
      const parsed = JSON.parse(cached) as { value: string; expiry: number };
      if (Date.now() < parsed.expiry) return parsed.value;
      sessionStorage.removeItem(cacheKey);
    } catch {
      sessionStorage.removeItem(cacheKey);
    }
  }

  const res = await fetch(FUNCTION_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(`Gemini function error: ${err.error ?? res.statusText}`);
  }

  const data = await res.json() as { text: string };
  const text = data.text ?? '';

  // Cachear por 1 hora
  sessionStorage.setItem(
    cacheKey,
    JSON.stringify({ value: text, expiry: Date.now() + 3_600_000 })
  );

  return text;
}
