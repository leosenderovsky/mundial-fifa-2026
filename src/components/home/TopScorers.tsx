import { motion } from 'framer-motion';
import { useApiData } from '../../hooks/useApiData';
import { api } from '../../lib/api';
import { SkeletonLoader } from '../shared/SkeletonLoader';

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

  if (isLoading) return <SkeletonLoader variant="match" />;
  if (error || !data?.scorers?.length) return null;

  const top = data.scorers.slice(0, 3);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {top.map((s, i) => (
        <motion.div
          key={i}
          whileHover={{ y: -10 }}
          className="stadium-card aspect-[4/5] relative group"
        >
          <div className="absolute inset-0 bg-slate-200 dark:bg-slate-900" />
          {s.team.crest && (
            <img
              src={s.team.crest}
              alt={s.team.name}
              className="absolute inset-0 w-full h-full object-cover opacity-10 group-hover:opacity-15 transition-opacity"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent" />

          <div className="absolute bottom-0 left-0 right-0 p-8 space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-12 h-10 bg-fifa-gold flex items-center justify-center font-mono font-bold text-xl rounded">
                {s.goals}
              </div>
              <span className="text-[10px] font-black uppercase text-white/60 tracking-widest">Goles</span>
              {s.assists != null && s.assists > 0 && (
                <span className="text-[10px] font-black text-white/40 tracking-widest ml-2">{s.assists} asist.</span>
              )}
            </div>
            <h3 className="headline-md text-white text-3xl uppercase leading-none">{s.player.name}</h3>
            <p className="text-fifa-gold font-bold uppercase text-xs tracking-[0.3em]">
              {s.team.shortName ?? s.team.name}
            </p>
          </div>
        </motion.div>
      ))}
    </div>
  );
};