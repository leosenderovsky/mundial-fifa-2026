import { useApiData } from '../hooks/useApiData';
import { api } from '../lib/api';
import { SEO } from '../components/shared/SEO';
import { Goal, Activity } from 'lucide-react';

export default function GlobalStats() {
  const { data: scorers, error: scorersError, isLoading } = useApiData(
    ['top-scorers'],
    () => api.getTopScorers(5)
  );
  const hasScorers = Boolean(scorers && scorers.length > 0);

  return (
    <div className="min-h-screen bg-surface-canvas pt-12 pb-24 px-4 md:px-8">
      <SEO
        title="Estadísticas Globales"
        description="Goleadores, estadísticas por equipo y resumen del torneo del Mundial FIFA 2026."
        keywords="estadisticas mundial, goleadores mundial 2026, tabla goleadores fifa"
      />
      <div className="container mx-auto space-y-8">
        <header className="flex flex-col md:flex-row justify-between items-end gap-6 mb-12">
          <div>
            <span className="label-caps flex items-center gap-2 mb-2">
              <span className="w-2 h-2 bg-fifa-red rounded-full animate-pulse" />
              Actualizado en Tiempo Real
            </span>
            <h1 className="display-md text-fifa-blue dark:text-white leading-none">Estadísticas <br /> Globales</h1>
          </div>
        </header>

        {(isLoading || scorersError || !hasScorers) && (
          <div className="stadium-card p-10 text-center text-sm text-slate-500">
            Las estadísticas oficiales estarán disponibles cuando la API publique datos del Mundial 2026.
          </div>
        )}

        {hasScorers && !scorersError && (
          <div className="grid grid-cols-1 gap-8">
            <div className="stadium-card p-8">
              <div className="flex justify-between items-center mb-8">
                <h3 className="headline-md uppercase flex items-center gap-3">
                  <Goal className="text-fifa-blue" /> Máximos Goleadores
                </h3>
                <Activity className="text-slate-200" size={24} />
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 dark:border-slate-800">
                    <tr>
                      <th className="text-left pb-4">Jugador</th>
                      <th className="text-center pb-4">Goles</th>
                      <th className="text-center pb-4">Asist.</th>
                      <th className="text-center pb-4">Minutos</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                    {scorers?.map((s: {
                      player: { name: string };
                      team: { name: string; crest: string };
                      goals: number;
                      assists: number | null;
                    }, i: number) => (
                      <tr key={i} className="group hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors">
                        <td className="py-4 flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-slate-100 overflow-hidden">
                            <img src={s.team.crest} className="w-full h-full object-cover" alt={s.team.name} />
                          </div>
                          <div>
                            <p className="font-bold text-sm">{s.player.name}</p>
                            <p className="text-[10px] text-slate-500 uppercase">{s.team.name}</p>
                          </div>
                        </td>
                        <td className="py-4 text-center font-mono font-bold text-xl">{s.goals}</td>
                        <td className="py-4 text-center font-mono text-slate-500">{s.assists ?? 0}</td>
                        <td className="py-4 text-center font-mono text-xs text-slate-400">-</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
