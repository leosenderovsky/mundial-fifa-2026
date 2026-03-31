import { Link } from 'react-router-dom';
import { Star, History, MapPin, ArrowRight } from 'lucide-react';

const STORIES = [
  {
    title: 'Apertura en el Azteca',
    detail: 'La Copa del Mundo 2026 inicia en Ciudad de México.',
    icon: History,
  },
  {
    title: 'Final en Nueva York/Nueva Jersey',
    detail: 'La definición del torneo se jugará en esa sede.',
    icon: Star,
  },
  {
    title: 'Debut local de Canadá y USA',
    detail: 'Toronto y Los Ángeles reciben sus partidos inaugurales.',
    icon: MapPin,
  },
];

export const VenueStoriesSection = () => (
  <section>
    <div className="flex items-center justify-between gap-6 mb-8">
      <div>
        <span className="label-caps mb-2 block">Historias de sedes</span>
        <h2 className="headline-lg text-fifa-blue dark:text-white uppercase">Escenarios que hacen historia</h2>
      </div>
      <Link
        to="/sedes"
        className="text-sm font-bold uppercase tracking-widest flex items-center gap-2 hover:text-fifa-blue transition-colors"
      >
        Ver sedes <ArrowRight size={14} />
      </Link>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {STORIES.map((story) => (
        <div key={story.title} className="stadium-card p-6 space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-fifa-red/10 text-fifa-red flex items-center justify-center">
            <story.icon size={20} />
          </div>
          <div>
            <h3 className="font-black uppercase tracking-tight mb-2">{story.title}</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">{story.detail}</p>
          </div>
        </div>
      ))}
    </div>
  </section>
);
