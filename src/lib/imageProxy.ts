export function proxiedImage(url?: string | null): string | undefined {
  if (!url) return undefined;
  try {
    const parsed = new URL(url);
    // Only proxy absolute http(s) URLs
    if (parsed.protocol === 'http:' || parsed.protocol === 'https:') {
      // Bypass proxy in development to avoid ECONNREFUSED when Netlify Dev isn't running.
      // You can force bypass by setting VITE_DISABLE_IMAGE_PROXY=true in .env
      const disableProxy = import.meta.env.DEV || import.meta.env.VITE_DISABLE_IMAGE_PROXY === 'true';
      if (disableProxy) return url;
      return `/.netlify/functions/image-proxy?url=${encodeURIComponent(url)}`;
    }
  } catch (err) {
    // Not a valid URL, return original
  }
  return url;
}
