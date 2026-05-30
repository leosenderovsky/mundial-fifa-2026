import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

export function useAdRefresh() {
  const { pathname } = useLocation();

  useEffect(() => {
    const id = window.setTimeout(() => {
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (e) {
        // silent
      }
    }, 150);

    return () => clearTimeout(id);
  }, [pathname]);
}
