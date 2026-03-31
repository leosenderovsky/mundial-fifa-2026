import { useApiData } from '../hooks/useApiData';
import { api } from '../lib/api';
import { StatBar } from '../components/shared/StatBar';
import { Trophy, ShieldAlert, Goal, Zap, Activity } from 'lucide-react';

export default function GlobalStats() {
  const { data: scorers } = useApiData(['top-scorers'], () => api.getTopScorers(5));

  return (
    <div className="min-h-screen bg-surface-canvas pt-12 pb-24 px-4 md:px-8">
      <div className="container mx-auto space-y-8">
        
        <header className="flex flex-col md:flex-row justify-between items-end gap-6 mb-12">
          <div>
            <span className="label-caps flex items-center gap-2 mb-2">
               <span className="w-2 h-2 bg-fifa-red rounded-full animate-pulse" />
               Actualizado en Tiempo Real
            </span>
            <h1 className="display-md text-fifa-blue dark:text-white leading-none">Estadísticas <br /> Globales</h1>
          </div>
          <div className="flex gap-4">
            <KPI card label="Partidos" value="64" />
            <KPI card label="Goles" value="172" />
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Top Scorers Table */}
          <div className="lg:col-span-2 stadium-card p-8">
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
                  {scorers?.map((s: any, i: number) => ( // Agregar tipos explícitos para evitar TS7006
                    <tr key={i} className="group hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors">
                      <td className="py-4 flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-slate-100 overflow-hidden">
                           <img src={s.team.crest} className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <p className="font-bold text-sm">{s.player.name}</p>
                          <p className="text-[10px] text-slate-500 uppercase">{s.team.name}</p>
                        </div>
                      </td>
                      <td className="py-4 text-center font-mono font-bold text-xl">{s.goals}</td>
                      <td className="py-4 text-center font-mono text-slate-500">{s.assists || 0}</td>
                      <td className="py-4 text-center font-mono text-xs text-slate-400">480'</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Side Panels */}
          <div className="space-y-8">
            {/* Dominant Teams */}
            <div className="bg-fifa-blue text-white rounded-2xl p-8 shadow-stadium">
              <h3 className="label-caps text-white/60 mb-6">Equipos Dominantes</h3>
              <div className="space-y-6">
                <StatBar label="Posesión (Media)" homeValue={64} awayValue={36} unit="%" />
                <StatBar label="Goles Anotados" homeValue={14} awayValue={4} />
                <StatBar label="Distancia (KM/P)" homeValue={118} awayValue={102} />
              </div>
            </div>

            {/* Golden Glove */}
            <div className="stadium-card p-6 border-l-4 border-fifa-gold">
              <h3 className="label-caps mb-4 flex justify-between">Malla de Oro <span className="text-fifa-gold">🧤</span></h3>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-slate-900 rounded-lg overflow-hidden">
                   <img src="https://crests.football-data.org/ARG.svg" className="w-full h-full scale-125" />
                </div>
                <div>
                  <p className="font-bold text-sm">E. Martínez</p>
                  <div className="flex gap-2 mt-1">
                    <span className="text-[8px] bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded font-bold uppercase tracking-tighter text-slate-500">4 Vallas Inv.</span>
                    <span className="text-[8px] bg-fifa-blue/10 text-fifa-blue px-1.5 py-0.5 rounded font-bold uppercase tracking-tighter">22 Paradas</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Heatmap Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 stadium-card overflow-hidden">
             <div className="p-8">
                <h3 className="headline-md uppercase mb-2">Mapa de Calor: Goles por Sede</h3>
                <p className="text-xs text-slate-500 mb-8">Distribución de tantos anotados por cada instancia del torneo.</p>
                <div className="relative aspect-[21/9] bg-slate-100 dark:bg-slate-800 rounded-xl overflow-hidden">
                   <div className="absolute inset-0 bg-[url('/map-gray.png')] bg-cover opacity-50 grayscale" />
                   {/* Heatmap Dots (CSS) */}
                   <div className="absolute top-[30%] left-[20%] w-12 h-12 bg-fifa-red/40 rounded-full blur-xl animate-pulse" />
                   <div className="absolute top-[50%] left-[45%] w-24 h-24 bg-fifa-blue/40 rounded-full blur-2xl" />
                </div>
                <div className="mt-6 flex justify-between items-center bg-slate-50 dark:bg-slate-900 p-4 rounded-lg">
                   <div>
                      <p className="label-caps text-[8px] mb-1">Sede Destacada</p>
                      <p className="font-bold text-sm uppercase">Estadio Azteca, CDMX</p>
                   </div>
                   <div className="text-right">
                      <p className="stat-lg text-fifa-red text-3xl">24 GOLES</p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase">6 Partidos Jugados</p>
                   </div>
                </div>
             </div>
          </div>

          <div className="stadium-card p-8">
             <h3 className="headline-md uppercase mb-8">Disciplina</h3>
             <div className="space-y-8">
                <div className="flex items-center gap-6">
                   <div className="w-12 h-16 bg-yellow-400 rounded-sm shadow-lg flex items-center justify-center font-black text-2xl">186</div>
                   <div>
                      <p className="font-bold text-sm uppercase">Tarjetas Amarillas</p>
                      <p className="text-xs text-slate-500">Promedio de 2.9 por partido</p>
                   </div>
                </div>
                <div className="flex items-center gap-6">
                   <div className="w-12 h-16 bg-red-600 rounded-sm shadow-lg flex items-center justify-center font-black text-2xl text-white">12</div>
                   <div>
                      <p className="font-bold text-sm uppercase">Tarjetas Rojas</p>
                      <p className="text-xs text-slate-500">4 Rojas directas, 8 Doble amarilla</p>
                   </div>
                </div>
                <div className="pt-8 border-t border-slate-100 dark:border-slate-800">
                   <p className="label-caps text-[8px] mb-4">Equipos más amonestados</p>
                   <ol className="space-y-3">
                      <li className="flex justify-between text-xs font-bold">
                         <span>1. Uruguay</span>
                         <span className="font-mono">14 Am. | 2 Ro.</span>
                      </li>
                      <li className="flex justify-between text-xs font-bold">
                         <span>2. Serbia</span>
                         <span className="font-mono">12 Am. | 1 Ro.</span>
                      </li>
                   </ol>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const KPI = ({ label, value, card }: any) => (
  <div className={cn(
    "flex flex-col items-center justify-center px-8 py-4",
    card && "bg-white dark:bg-slate-800 rounded-xl shadow-stadium"
  )}>
    <span className="stat-lg text-fifa-blue dark:text-white leading-none mb-1">{value}</span>
    <span className="label-caps text-[10px] text-slate-400">{label}</span>
  </div>
);