import { Link } from 'react-router-dom';
import { Trophy, Users, Layers, Flag, ArrowRight } from 'lucide-react';

const GUIDE_ITEMS = [
  {
    title: '48 selecciones',
    description: 'Edición más grande de la historia, con un total de 48 equipos.',
    icon: Users,
  },
  {
    title: '12 grupos de 4',
    description: 'Cada selección juega 3 partidos en la fase de grupos.',
    icon: Layers,
  },
  {
    title: '104 partidos',
    description: 'El calendario oficial contempla 104 encuentros en total.',
    icon: Trophy,
  },
  {
    title: 'Ronda de 32',
    description: 'Clasifican los 2 primeros de cada grupo + 8 mejores terceros.',
    icon: Flag,
  },
];

export const TournamentGuideSection = () => (
  <section>
    <div className="flex items-center justify-between gap-6 mb-8">
      <div>
        <span className="label-caps mb-2 block">Guía del torneo</span>
        <h2 className="headline-lg text-fifa-blue dark:text-white uppercase">Formato Mundial 2026</h2>
      </div>
      <Link
        to="/fixture"
        className="text-sm font-bold uppercase tracking-widest flex items-center gap-2 hover:text-fifa-blue transition-colors"
      >
        Ver fixture <ArrowRight size={14} />
      </Link>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {GUIDE_ITEMS.map((item) => (
        <div key={item.title} className="stadium-card p-6 flex flex-col gap-4">
          <div className="w-12 h-12 rounded-2xl bg-fifa-blue/10 text-fifa-blue flex items-center justify-center">
            <item.icon size={22} />
          </div>
          <div>
            <h3 className="font-black uppercase tracking-tight mb-2">{item.title}</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">{item.description}</p>
          </div>
        </div>
      ))}
    </div>
  </section>
);
