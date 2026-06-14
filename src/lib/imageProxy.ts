const BYPASS_DOMAINS = [
  'cdn.thesportsdb.com',
  'www.thesportsdb.com',
  'media.api-sports.io',
  'upload.wikimedia.org',
];

export function proxiedImage(url?: string | null): string | undefined {
  if (!url) return undefined;
  try {
    const parsed = new URL(url);
    if (BYPASS_DOMAINS.some((d) => parsed.hostname.endsWith(d))) return url;
    // Only proxy absolute http(s) URLs
    if (parsed.protocol === 'http:' || parsed.protocol === 'https:') {
      // Keep direct image URLs as the default path. The production CSP allows
      // the known media hosts, and this avoids broken images when Netlify
      // Functions are unavailable or a static preview is being used.
      const enableProxy = import.meta.env.VITE_ENABLE_IMAGE_PROXY === 'true';
      if (!enableProxy) return url;
      return `/.netlify/functions/image-proxy?url=${encodeURIComponent(url)}`;
    }
  } catch (err) {
    // Not a valid URL, return original
  }
  return url;
}
