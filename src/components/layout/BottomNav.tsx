import { NavLink } from 'react-router-dom';
import { Home, MapPin, Calendar, BarChart3, Map } from 'lucide-react';
import { cn } from '../../lib/utils';

export const BottomNav = () => {
  const items = [
    { icon: Home, label: 'Inicio', path: '/' },
    { icon: MapPin, label: 'Sedes', path: '/sedes' },
    { icon: Calendar, label: 'Fixture', path: '/fixture' },
    { icon: BarChart3, label: 'Stats', path: '/stats' },
    { icon: Map, label: 'Mapa', path: '/mapa' },
  ];

  return (
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
  );
};