export function proxiedImage(url?: string | null): string | undefined {
  if (!url) return undefined;
  try {
    const parsed = new URL(url);
    // Only proxy absolute http(s) URLs
    if (parsed.protocol === 'http:' || parsed.protocol === 'https:') {
      return `/.netlify/functions/image-proxy?url=${encodeURIComponent(url)}`;
    }
  } catch (err) {
    // Not a valid URL, return original
  }
  return url;
}
