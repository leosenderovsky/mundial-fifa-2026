import { useApiData } from './useApiData';
import { api } from '../lib/api';
import type { Scorer } from '../types/api';

const TOURNAMENT_START = new Date('2026-06-11T00:00:00');

export function useStatsVisibility() {
  const isTournamentStarted = new Date() >= TOURNAMENT_START;

  const { data, isLoading } = useApiData<{ scorers: Scorer[] }>(
    ['top-scorers', 'visibility'],
    () => api.getTopScorers(5),
    { enabled: isTournamentStarted, staleTime: 1000 * 60 * 10 }
  );

  const scorers = data?.scorers ?? [];
  const isVisible = isTournamentStarted && scorers.length > 0;

  return { isVisible, isTournamentStarted, isLoading, scorers };
}
