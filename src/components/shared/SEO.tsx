import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export const SEO = ({ title, description, keywords }: { title: string, description?: string, keywords?: string }) => {
  const location = useLocation();
  useEffect(() => {
    document.title = `${title} | Mundial FIFA 2026`;
    document.querySelector('meta[name="description"]')?.setAttribute('content', description || '');
    document.querySelector('meta[name="keywords"]')?.setAttribute('content', keywords || '');
  }, [title, description, keywords, location]);
  return null;
};