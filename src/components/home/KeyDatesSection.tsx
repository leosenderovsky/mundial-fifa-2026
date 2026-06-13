import { Link } from 'react-router-dom';
import { CalendarCheck, MapPin, Star, ArrowRight } from 'lucide-react';
import { cn } from '../../lib/utils';

const KEY_DATES = [
  {
    title: '11 jun. 2026',
    subtitle: 'Partido inaugural',
    detail: 'Estadio Azteca, Ciudad de México',
    icon: MapPin,
    past: true,
  },
  {
    title: 'Fase de Grupos',
    subtitle: 'En disputa',
    detail: '48 selecciones en 12 grupos',
    icon: CalendarCheck,
    past: false,
  },
  {
    title: 'Ronda de 32',
    subtitle: 'Eliminatorias directas',
    detail: 'Los 32 mejores clasificados',
    icon: CalendarCheck,
    past: false,
  },
  {
    title: '19 jul. 2026',
    subtitle: 'Gran Final',
    detail: 'MetLife Stadium, Nueva York / Nueva Jersey',
    icon: Star,
    past: false,
  },
];

export const KeyDatesSection = () => (
  <section>
    <div className="flex items-center justify-between gap-6 mb-8">
      <div>
        <span className="label-caps mb-2 block">Calendario del torneo</span>
        <h2 className="headline-lg text-fifa-blue dark:text-white uppercase">Hitos del Mundial</h2>
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
        <div
          key={date.title + date.subtitle}
          className={cn(
            "stadium-card p-6 space-y-4",
            date.past && "opacity-60"
          )}
        >
          <div className={cn(
            "w-12 h-12 rounded-2xl flex items-center justify-center",
            date.past
              ? "bg-slate-100 dark:bg-slate-800 text-slate-400"
              : "bg-fifa-gold/15 text-fifa-gold"
          )}>
            <date.icon size={22} />
          </div>
          <div>
            <p className="text-xs font-black uppercase tracking-widest text-slate-400">{date.subtitle}</p>
            <h3 className={cn(
              "font-black text-lg uppercase",
              date.past ? "text-slate-400" : "text-slate-900 dark:text-white"
            )}>{date.title}</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">{date.detail}</p>
            {date.past && (
              <span className="inline-block mt-2 text-[9px] font-black uppercase tracking-widest text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">
                Jugado
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  </section>
);