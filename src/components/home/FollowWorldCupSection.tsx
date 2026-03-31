import { Link } from 'react-router-dom';
import { MonitorPlay, CalendarClock, Bell, ArrowRight } from 'lucide-react';

const FOLLOW_ITEMS = [
  {
    title: 'Fixture oficial',
    detail: 'Disponible en FIFA.com y FIFA+.',
    icon: MonitorPlay,
  },
  {
    title: 'Sorteo final',
    detail: 'Define el calendario completo de grupos.',
    icon: CalendarClock,
  },
  {
    title: 'Horarios confirmados',
    detail: 'Se publican luego del sorteo final.',
    icon: Bell,
  },
];

export const FollowWorldCupSection = () => (
  <section className="stadium-card p-8 md:p-12 bg-fifa-blue text-white">
    <div className="flex flex-col lg:flex-row gap-10 items-start lg:items-center">
      <div className="flex-1">
        <span className="label-caps mb-2 block text-white/70">Cómo seguir el Mundial</span>
        <h2 className="headline-lg uppercase mb-4">Todo el torneo, en un solo lugar</h2>
        <p className="text-sm text-white/70 max-w-xl">
          El calendario oficial y las novedades del torneo se publican en las plataformas de FIFA.
        </p>
        <Link
          to="/fixture"
          className="mt-6 inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-white hover:translate-x-1 transition-transform"
        >
          Abrir fixture <ArrowRight size={14} />
        </Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full lg:w-auto">
        {FOLLOW_ITEMS.map((item) => (
          <div key={item.title} className="bg-white/10 border border-white/10 p-4 rounded-2xl space-y-3">
            <div className="w-10 h-10 rounded-xl bg-white/15 text-white flex items-center justify-center">
              <item.icon size={18} />
            </div>
            <div>
              <p className="text-xs font-black uppercase tracking-widest text-white/60">{item.title}</p>
              <p className="text-sm text-white/80">{item.detail}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);
