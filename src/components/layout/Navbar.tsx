import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, Moon, Sun, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../lib/utils';
import { useTheme } from '../../hooks/useTheme';

interface NavLinkProps {
  to: string;
  children: React.ReactNode;
  onClick?: () => void;
}

const NavLink = ({ to, children, onClick }: NavLinkProps) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link
      to={to}
      onClick={onClick}
      className={cn(
        "text-sm font-bold uppercase tracking-wider transition-colors hover:text-fifa-blue dark:hover:text-fifa-gold",
        isActive ? "text-fifa-blue dark:text-fifa-gold" : "text-slate-600 dark:text-slate-400"
      )}
    >
      {children}
    </Link>
  );
};

export const Navbar = ({ showLive = true }: { showLive?: boolean }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  const navItems = [
    { label: 'Inicio', path: '/' },
    { label: 'Sedes & Estadios', path: '/sedes' },
    { label: 'Fixture & Grupos', path: '/fixture' },
    { label: 'Selecciones', path: '/selecciones' },
    { label: 'Estadísticas', path: '/stats' },
    { label: 'Mapa', path: '/mapa' },
  ];

  return (
    <nav className="glass-nav sticky top-0 z-50 h-20 w-full flex items-center">
      <div className="container mx-auto px-4 md:px-8 flex items-center justify-between">
        
        {/* LOGO */}
        <Link to="/" className="flex flex-col">
          <span className="font-headline font-black italic uppercase tracking-tighter text-2xl lg:text-3xl text-fifa-blue dark:text-white leading-none">
            FIFA 2026
          </span>
        </Link>

        {/* DESKTOP NAV */}
        <div className="hidden lg:flex items-center space-x-8">
          {navItems.map((item) => (
            <NavLink key={item.path} to={item.path}>{item.label}</NavLink>
          ))}
        </div>

        {/* ACTIONS */}
        <div className="flex items-center space-x-4 lg:space-x-6">
          {showLive && (
            <div className="hidden md:flex items-center bg-fifa-red text-white px-4 py-1.5 rounded-sm gap-2 animate-pulse">
              <span className="w-2 h-2 bg-white rounded-full" />
              <span className="text-xs font-bold uppercase tracking-widest">En Vivo</span>
            </div>
          )}

          <button className="p-2 text-slate-600 dark:text-slate-400 hover:text-fifa-blue dark:hover:text-fifa-gold transition-colors">
            <Search size={20} />
          </button>

          <button 
            onClick={toggleTheme}
            className="p-2 text-slate-600 dark:text-slate-400 hover:text-fifa-blue dark:hover:text-fifa-gold transition-colors"
          >
            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
          </button>

          <button 
            className="lg:hidden p-2 text-slate-900 dark:text-white"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <Menu size={24} />
          </button>
        </div>
      </div>

      {/* MOBILE DRAWER */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-[60] bg-surface-card flex flex-col p-8"
          >
            <div className="flex justify-between items-center mb-12">
              <span className="font-headline font-black italic text-2xl text-fifa-blue dark:text-white uppercase">FIFA 2026</span>
              <button onClick={() => setIsMobileMenuOpen(false)}>
                <X size={32} className="text-slate-900 dark:text-white" />
              </button>
            </div>
            <div className="flex flex-col space-y-8">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="headline-md uppercase tracking-tight"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};