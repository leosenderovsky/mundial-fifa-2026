import { Link } from 'react-router-dom';
import { Route, Globe2, Compass, ArrowRight } from 'lucide-react';

const ROUTE_ITEMS = [
  {
    title: '3 países anfitriones',
    detail: 'Estados Unidos, México y Canadá comparten la sede del torneo.',
    icon: Globe2,
  },
  {
    title: '16 ciudades sede',
    detail: 'El calendario está distribuido en 16 ciudades anfitrionas.',
    icon: Compass,
  },
  {
    title: 'Viajes optimizados',
    detail: 'El cronograma fue diseñado para reducir desplazamientos.',
    icon: Route,
  },
];

export const FanRouteSection = () => (
  <section className="stadium-card p-8 md:p-12 bg-white/80 dark:bg-slate-900/60">
    <div className="flex flex-col lg:flex-row gap-10 items-start lg:items-center">
      <div className="flex-1">
        <span className="label-caps mb-2 block">Ruta del hincha</span>
        <h2 className="headline-lg text-fifa-blue dark:text-white uppercase mb-4">
          Itinerarios más simples, más cerca del juego
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xl">
          La organización definió un reparto regional de sedes para facilitar la logística y evitar
          traslados excesivos entre partidos.
        </p>
        <Link
          to="/mapa"
          className="mt-6 inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-fifa-blue dark:text-fifa-gold hover:translate-x-1 transition-transform"
        >
          Ver mapa de sedes <ArrowRight size={14} />
        </Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full lg:w-auto">
        {ROUTE_ITEMS.map((item) => (
          <div key={item.title} className="bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl space-y-3">
            <div className="w-10 h-10 rounded-xl bg-fifa-blue/10 text-fifa-blue flex items-center justify-center">
              <item.icon size={18} />
            </div>
            <div>
              <p className="text-xs font-black uppercase tracking-widest text-slate-400">{item.title}</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">{item.detail}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);
