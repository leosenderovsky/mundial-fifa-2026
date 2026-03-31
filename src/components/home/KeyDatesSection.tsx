import { Link } from 'react-router-dom';
import { CalendarCheck, MapPin, Star, ArrowRight } from 'lucide-react';

const KEY_DATES = [
  {
    title: '11 junio 2026',
    subtitle: 'Partido inaugural',
    detail: 'Estadio Azteca, Ciudad de México',
    icon: MapPin,
  },
  {
    title: '12 junio 2026',
    subtitle: 'Debut Canadá',
    detail: 'Toronto',
    icon: CalendarCheck,
  },
  {
    title: '12 junio 2026',
    subtitle: 'Debut Estados Unidos',
    detail: 'Los Ángeles',
    icon: CalendarCheck,
  },
  {
    title: '19 julio 2026',
    subtitle: 'Final del torneo',
    detail: 'Nueva York / Nueva Jersey',
    icon: Star,
  },
];

export const KeyDatesSection = () => (
  <section>
    <div className="flex items-center justify-between gap-6 mb-8">
      <div>
        <span className="label-caps mb-2 block">Calendario base</span>
        <h2 className="headline-lg text-fifa-blue dark:text-white uppercase">Fechas clave</h2>
      </div>
      <Link
        to="/fixture"
        className="text-sm font-bold uppercase tracking-widest flex items-center gap-2 hover:text-fifa-blue transition-colors"
      >
        Ver calendario <ArrowRight size={14} />
      </Link>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {KEY_DATES.map((date) => (
        <div key={date.title + date.subtitle} className="stadium-card p-6 space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-fifa-gold/15 text-fifa-gold flex items-center justify-center">
            <date.icon size={22} />
          </div>
          <div>
            <p className="text-xs font-black uppercase tracking-widest text-slate-400">{date.subtitle}</p>
            <h3 className="font-black text-lg uppercase text-slate-900 dark:text-white">{date.title}</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">{date.detail}</p>
          </div>
        </div>
      ))}
    </div>
  </section>
);
