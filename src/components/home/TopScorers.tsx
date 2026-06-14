import { motion } from 'framer-motion';
import { useApiData } from '../../hooks/useApiData';
import { api } from '../../lib/api';
import { SkeletonLoader } from '../shared/SkeletonLoader';
import { proxiedImage } from '../../lib/imageProxy';
import { STATIC_TOP_SCORERS, type StaticScorer } from '../../data/worldCupResults';

interface Scorer {
  player: { name: string; nationality: string };
  team: { name: string; shortName?: string; crest?: string };
  goals: number;
  assists?: number | null;
}

interface ScorersResponse {
  scorers: Scorer[];
}

// Convierte los scorers estáticos al formato del API
const staticToApiScorers = (list: StaticScorer[]): Scorer[] =>
  list.slice(0, 3).map((s) => ({
    player: { name: s.playerName, nationality: s.teamName },
    team:   { name: s.teamName, shortName: s.teamShortName, crest: undefined },
    goals:  s.goals,
    assists: s.assists,
  }));

export const TopScorers = () => {
  const { data, isLoading, error } = useApiData<ScorersResponse>(
    ['top-scorers'],
    () => api.getTopScorers(5),
    { staleTime: 5 * 60_000, refetchInterval: 5 * 60_000, retry: 1 }
  );

  const apiTop = data?.scorers?.slice(0, 3) ?? [];
  // Usar API si respondió; fallback estático si falló o vino vacía
  const top: Scorer[] = apiTop.length > 0 ? apiTop : staticToApiScorers(STATIC_TOP_SCORERS);
  const isStaticFallback = apiTop.length === 0;

  const playerNames = top.map((s) => s.player.name);

  const { data: photoData, isLoading: isLoadingPhotos } = useApiData<{
    photos: Record<string, string | null>;
  }>(
    ['scorers-photos', ...playerNames],
    () => api.getPlayerPhotos(playerNames),
    { enabled: playerNames.length > 0, staleTime: 1000 * 60 * 60 * 24, retry: 1 }
  );
  const photoMap = photoData?.photos ?? {};

  if (isLoading) return <SkeletonLoader variant="match" />;
  if (top.length === 0) return null;   // solo null si ni el fallback tiene datos

  return (
    <div className="space-y-4">
      {isStaticFallback && (
        <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold text-center">
          Datos al último partido disputado · Se actualizan automáticamente
        </p>
      )}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {top.map((s, i) => {
          const photo = photoMap[s.player.name];
          const flagCode = STATIC_TOP_SCORERS.find(
            (st) => st.playerName === s.player.name
          )?.teamFlag;

          return (
            <motion.div
              key={i}
              whileHover={{ y: -10 }}
              className="stadium-card aspect-[4/5] relative group overflow-hidden"
            >
              <div className="absolute inset-0 bg-slate-900 dark:bg-slate-950" />

              {photo && !isLoadingPhotos ? (
                <img
                  src={proxiedImage(photo)}
                  alt={s.player.name}
                  className="absolute inset-0 w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                />
              ) : isLoadingPhotos ? (
                <div className="absolute inset-0 bg-slate-800 animate-pulse" />
              ) : flagCode ? (
                // Fallback: bandera del país si no hay foto
                <div className="absolute inset-0 flex items-center justify-center">
                  <span
                    className={`fi fi-${flagCode}`}
                    style={{ fontSize: '8rem', opacity: 0.15 }}
                  />
                </div>
              ) : null}

              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

              <div className="absolute bottom-0 left-0 right-0 p-8 space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-12 h-10 bg-fifa-gold flex items-center justify-center font-mono font-bold text-xl rounded">
                    {s.goals}
                  </div>
                  <span className="text-[10px] font-black uppercase text-white/60 tracking-widest">
                    Goles
                  </span>
                  {s.assists != null && s.assists > 0 && (
                    <span className="text-[10px] font-black text-white/40 tracking-widest ml-2">
                      {s.assists} asist.
                    </span>
                  )}
                </div>
                <h3 className="headline-md text-white text-3xl uppercase leading-none">
                  {s.player.name}
                </h3>
                <div className="flex items-center gap-2">
                  {flagCode && <span className={`fi fi-${flagCode} w-4 h-3 rounded-sm`} />}
                  <p className="text-fifa-gold font-bold uppercase text-xs tracking-[0.3em]">
                    {s.team.shortName ?? s.team.name}
                  </p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};