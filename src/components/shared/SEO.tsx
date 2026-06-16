import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const BASE_URL = 'https://mundial-fifa-2026.netlify.app';
const DEFAULT_OG = `${BASE_URL}/og-image.jpg`;

interface SEOProps {
  title: string;
  description?: string;
  keywords?: string;
  jsonLd?: object | object[];
  ogImage?: string;
}

export const SEO = ({ title, description, keywords, jsonLd, ogImage }: SEOProps) => {
  const { pathname } = useLocation();
  const canonical = `${BASE_URL}${pathname}`;
  const fullTitle = `${title} | Copa Mundial FIFA 2026`;
  const img = ogImage ?? DEFAULT_OG;

  useEffect(() => {
    // Title
    document.title = fullTitle;

    // Helpers para set/create meta
    const setMeta = (selector: string, attr: string, value: string) => {
      let el = document.querySelector(selector) as HTMLMetaElement | null;
      if (!el) {
        el = document.createElement('meta');
        // Parse the selector to extract attribute name and value
        // e.g. 'meta[name="description"]' → name="description"
        const match = selector.match(/\[([^\]=]+)="([^"]+)"\]/);
        if (match) {
          el.setAttribute(match[1], match[2]);
        }
        document.head.appendChild(el);
      }
      el.setAttribute(attr, value);
    };

    const setLink = (rel: string, href: string) => {
      let el = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement | null;
      if (!el) {
        el = document.createElement('link');
        el.rel = rel;
        document.head.appendChild(el);
      }
      el.href = href;
    };

    // Primary SEO
    if (description) setMeta('meta[name="description"]', 'content', description);
    if (keywords) setMeta('meta[name="keywords"]', 'content', keywords);
    setLink('canonical', canonical);

    // Open Graph
    setMeta('meta[property="og:title"]', 'content', fullTitle);
    if (description) setMeta('meta[property="og:description"]', 'content', description);
    setMeta('meta[property="og:url"]', 'content', canonical);
    setMeta('meta[property="og:image"]', 'content', img);

    // Twitter
    setMeta('meta[name="twitter:title"]', 'content', fullTitle);
    if (description) setMeta('meta[name="twitter:description"]', 'content', description);
    setMeta('meta[name="twitter:image"]', 'content', img);

    // JSON-LD per-page
    const existing = document.getElementById('page-jsonld');
    if (existing) existing.remove();
    if (jsonLd) {
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.id = 'page-jsonld';
      const schemas = Array.isArray(jsonLd) ? jsonLd : [jsonLd];
      script.textContent = JSON.stringify(schemas.length === 1 ? schemas[0] : schemas);
      document.head.appendChild(script);
    }
  }, [fullTitle, description, keywords, canonical, img, jsonLd]);

  return null;
};