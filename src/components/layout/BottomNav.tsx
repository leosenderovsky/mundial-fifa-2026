import { NavLink } from 'react-router-dom';
import { Home, MapPin, Calendar, BarChart3, Map } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useStatsVisibility } from '../../hooks/useStatsVisibility';
import { AdBanner } from '../shared/AdBanner';

export const BottomNav = () => {
  const { isVisible: showStats } = useStatsVisibility();

  const items = [
    { icon: Home, label: 'Inicio', path: '/' },
    { icon: MapPin, label: 'Sedes', path: '/sedes' },
    { icon: Calendar, label: 'Fixture', path: '/fixture' },
    ...(showStats ? [{ icon: BarChart3, label: 'Stats', path: '/stats' }] : []),
    { icon: Map, label: 'Mapa', path: '/mapa' },
  ];

  return (
    <>
      {/* AdSense Banner — above bottom nav (mobile only) */}
      <div className="md:hidden fixed left-0 right-0 bottom-20 z-40">
        <AdBanner slot="4444444444" format="horizontal" className="w-full" />
      </div>
      <nav className="fixed bottom-0 left-0 right-0 h-20 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex md:hidden items-center justify-around px-4 z-50">
      {items.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          className={({ isActive }) => cn(
            "flex flex-col items-center gap-1 transition-colors",
            isActive ? "text-fifa-blue dark:text-fifa-gold" : "text-slate-400"
          )}
        >
          <item.icon size={20} />
          <span className="text-[10px] font-bold uppercase tracking-tighter">{item.label}</span>
        </NavLink>
      ))}
    </nav>
    </>
  );
};
