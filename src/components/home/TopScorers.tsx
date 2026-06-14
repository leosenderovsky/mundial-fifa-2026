import { motion } from 'framer-motion';
import { User } from 'lucide-react';
import { useApiData } from '../../hooks/useApiData';
import { api } from '../../lib/api';
import { SkeletonLoader } from '../shared/SkeletonLoader';
import { proxiedImage } from '../../lib/imageProxy';

interface Scorer {
  player: { name: string; nationality: string };
  team: { name: string; shortName?: string; crest?: string };
  goals: number;
  assists?: number;
  penalties?: number;
}

interface ScorersResponse {
  scorers: Scorer[];
}

export const TopScorers = () => {
  const { data, isLoading, error } = useApiData<ScorersResponse>(
    ['top-scorers'],
    () => api.getTopScorers(5),
    { staleTime: 5 * 60_000, refetchInterval: 5 * 60_000 }
  );

  const top = data?.scorers?.slice(0, 3) ?? [];
  const playerNames = top.map((s) => s.player.name);

  const { data: photoData, isLoading: isLoadingPhotos } = useApiData<{
    photos: Record<string, string | null>;
  }>(
    ['scorers-photos', ...playerNames],
    () => api.getPlayerPhotos(playerNames),
    { enabled: playerNames.length > 0, staleTime: 1000 * 60 * 60 * 24 }
  );
  const photoMap = photoData?.photos ?? {};

  if (isLoading) return <SkeletonLoader variant="match" />;
  if (error || top.length === 0) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {top.map((s, i) => {
        const photo = photoMap[s.player.name];
        return (
          <motion.div
            key={i}
            whileHover={{ y: -10 }}
            className="stadium-card aspect-[4/5] relative group overflow-hidden"
          >
            {/* Fondo base */}
            <div className="absolute inset-0 bg-slate-900 dark:bg-slate-950" />

            {/* Foto del jugador */}
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
            ) : (
              /* Fallback: escudo del equipo como fondo suave */
              s.team.crest && (
                <img
                  src={s.team.crest}
                  alt={s.team.name}
                  className="absolute inset-0 w-full h-full object-contain opacity-10"
                />
              )
            )}

            {/* Gradiente oscurecedor inferior */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

            {/* Datos del goleador */}
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
              <p className="text-fifa-gold font-bold uppercase text-xs tracking-[0.3em]">
                {s.team.shortName ?? s.team.name}
              </p>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};