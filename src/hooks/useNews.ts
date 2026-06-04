// src/hooks/useNews.ts
import { useQuery } from '@tanstack/react-query';
import { fetchMundialNews } from '../lib/rssService';

export function useNews(sourceIds?: string[]) {
  return useQuery({
    queryKey: ['mundial-news', sourceIds?.join(',') ?? 'all'],
    queryFn: () => fetchMundialNews(sourceIds),
    staleTime: 10 * 60 * 1000,   // 10 min — alineado con caché de la function
    gcTime: 15 * 60 * 1000,
    retry: 2,
    refetchOnWindowFocus: false,
  });
}