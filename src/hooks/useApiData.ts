import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { useState, useEffect } from 'react';

export function useApiData<T>(
  key: string[],
  fetchFn: () => Promise<T>,
  options?: Partial<UseQueryOptions<T>>
) {
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  const query = useQuery({
    queryKey: key,
    queryFn: async () => {
      const result = await fetchFn();
      setLastUpdated(new Date());
      return result;
    },
    staleTime: 1000 * 60 * 5, // 5 minutos por defecto
    ...options,
  });

  return {
    ...query,
    lastUpdated,
  };
}