import { useApiData } from './useApiData';
import { api } from '../lib/api';

export function useSquadPhotos(names: string[], coachName?: string, teamName?: string) {
  const allNames = [...names, ...(coachName ? [coachName] : [])].filter(Boolean);
  const key = allNames.sort().join('|');

  const { data, isLoading } = useApiData<{ photos: Record<string, string | null> }>(
    ['squad-photos', key],
    () => api.getPlayerPhotos(allNames, teamName),
    { enabled: allNames.length > 0, staleTime: 1000 * 60 * 60 * 24 }
  );

  return {
    photos: data?.photos ?? {},
    isLoadingPhotos: isLoading,
  };
}
