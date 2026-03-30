import { useApiData } from '../../hooks/useApiData';
import { api } from '../../lib/api';
import { SkeletonLoader } from '../shared/SkeletonLoader';

export const LiveMatchSection = () => {
  const { data: matches, isLoading } = useApiData(['live-matches'], () => api.getLiveMatches(), {
    refetchInterval: 30000 // Polling cada 30s
  });

  if (isLoading) return <SkeletonLoader variant="match" />;

  const match = matches?.[0] || null; // Simulación de partido destacado si no hay vivos

  return (
    <div className="stadium-card flex flex-col border-t-4 border-fifa-red">
      <div className="bg-fifa-red text-white px-6 py-2 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 bg-white rounded-full animate-ping" />
          <span className="text-xs font-bold uppercase tracking-widest">Partido en Vivo</span>
        </div>
        <span className="font-mono font-bold text-sm">74'</span>
      </div>
      
      <div className="p-8 md:p-12 flex items-center justify-around gap-4">
        <div className="flex flex-col items-center gap-4 group cursor-pointer">
          <img src="https://crests.football-data.org/MEX.svg" className="w-20 h-20 md:w-32 md:h-32 drop-shadow-xl group-hover:scale-110 transition-transform" alt="Mexico" />
          <span className="headline-md uppercase">México</span>
        </div>

        <div className="flex flex-col items-center">
          <div className="flex items-center gap-8 mb-2">
            <span className="display-md text-fifa-blue dark:text-white">2</span>
            <span className="text-slate-300 text-4xl">—</span>
            <span className="display-md text-fifa-blue dark:text-white">1</span>
          </div>
          <div className="text-center space-y-1">
            <p className="text-[10px] font-bold uppercase text-slate-400">Jiménez 22' ⚽</p>
            <p className="text-[10px] font-bold uppercase text-slate-400">Lozano 56' ⚽</p>
          </div>
        </div>

        <div className="flex flex-col items-center gap-4 group cursor-pointer">
          <img src="https://crests.football-data.org/ITA.svg" className="w-20 h-20 md:w-32 md:h-32 drop-shadow-xl group-hover:scale-110 transition-transform" alt="Italy" />
          <span className="headline-md uppercase">Italia</span>
        </div>
      </div>

      <div className="bg-slate-50 dark:bg-slate-900/50 p-4 flex justify-center gap-8 border-t border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
          <span className="opacity-50">🏟️</span> Estadio Azteca, CDMX
        </div>
        <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
          <span className="opacity-50">👥</span> 87,523 Espectadores
        </div>
      </div>
    </div>
  );
};