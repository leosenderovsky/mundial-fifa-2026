import { motion } from 'framer-motion';
import { useApiData } from '../../hooks/useApiData';
import { api } from '../../lib/api';
import { SkeletonLoader } from '../shared/SkeletonLoader';
import { STATIC_TOP_SCORERS, type StaticScorer } from '../../data/worldCupResults';
import { getFlagCode } from '../../lib/flags';

interface Scorer {
  player: { name: string; nationality: string };
  team: { name: string; shortName?: string; crest?: string };
  goals: number;
  assists?: number | null;
}

interface ScorersResponse {
  scorers: Scorer[];
}

const staticToApiScorers = (list: StaticScorer[]): Scorer[] =>
  list.slice(0, 3).map((s) => ({
    player: { name: s.playerName, nationality: s.teamName },
    team:   { name: s.teamName, shortName: s.teamShortName, crest: undefined },
    goals:  s.goals,
    assists: s.assists,
  }));

export const TopScorers = () => {
  const { data, isLoading } = useApiData<ScorersResponse>(
    ['top-scorers'],
    () => api.getTopScorers(5),
    { staleTime: 5 * 60_000, refetchInterval: 5 * 60_000, retry: 1 }
  );

  const apiTop = data?.scorers?.slice(0, 3) ?? [];
  const top: Scorer[] = apiTop.length > 0 ? apiTop : staticToApiScorers(STATIC_TOP_SCORERS);
  const isStaticFallback = apiTop.length === 0;

  if (isLoading) return <SkeletonLoader variant="match" />;
  if (top.length === 0) return null;

  return (
    <div className="space-y-4">
      {isStaticFallback && (
        <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold text-center">
          Datos al último partido disputado · Se actualizan automáticamente
        </p>
      )}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {top.map((s, i) => {
          const staticEntry = STATIC_TOP_SCORERS.find(
            (st) => st.playerName === s.player.name
          );
          // Primero usa la lista estática (tiene los flag codes ya mapeados).
          // Si no está en la lista (ej. goleador nuevo detectado por la API),
          // intenta derivar el código usando el shortName del equipo como tla.
          const flagCode =
            staticEntry?.teamFlag ??
            getFlagCode({ tla: s.team.shortName ?? '' } as any) ??
            undefined;
          const rank = i + 1;

          return (
            <motion.div
              key={i}
              whileHover={{ y: -6 }}
              className="stadium-card relative overflow-hidden group"
            >
              {/* Fondo: bandera gigante con baja opacidad */}
              {flagCode && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
                  <span
                    className={`fi fi-${flagCode}`}
                    style={{ fontSize: '11rem', opacity: 0.07, filter: 'blur(1px)' }}
                  />
                </div>
              )}

              {/* Gradiente oscuro de cobertura */}
              <div className="absolute inset-0 bg-gradient-to-br from-slate-900/80 via-slate-900/60 to-slate-900/80" />

              {/* Contenido */}
              <div className="relative z-10 p-8 flex flex-col gap-5">
                {/* Ranking */}
                <div className="flex items-start justify-between">
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">
                    #{rank} Goleador
                  </span>
                  {flagCode && (
                    <span className={`fi fi-${flagCode} w-8 h-6 rounded-sm shadow-lg`} />
                  )}
                </div>

                {/* Nombre */}
                <div>
                  <h3 className="font-headline font-black uppercase text-white text-2xl leading-none mb-1 group-hover:text-fifa-gold transition-colors">
                    {s.player.name}
                  </h3>
                  <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-fifa-gold">
                    {s.team.shortName ?? s.team.name}
                  </p>
                </div>

                {/* Stats */}
                <div className="flex items-end gap-6 pt-2 border-t border-white/10">
                  <div className="flex flex-col">
                    <span className="text-5xl font-black font-mono text-white leading-none">
                      {s.goals}
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mt-1">
                      Goles
                    </span>
                  </div>
                  {s.assists != null && s.assists > 0 && (
                    <div className="flex flex-col">
                      <span className="text-2xl font-black font-mono text-slate-300 leading-none">
                        {s.assists}
                      </span>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mt-1">
                        Asist.
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
