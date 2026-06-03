import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { Link, useLocation } from 'react-router-dom';
import { Moon, Sun, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../lib/utils';
import { useTheme } from '../../hooks/useTheme';
import { useStatsVisibility } from '../../hooks/useStatsVisibility';

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

export const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { isVisible: showStats } = useStatsVisibility();

  const navItems = [
    { label: 'Inicio', path: '/' },
    { label: 'Sedes & Estadios', path: '/sedes' },
    { label: 'Fixture & Grupos', path: '/fixture' },
    { label: 'Selecciones', path: '/selecciones' },
    ...(showStats ? [{ label: 'Estadísticas', path: '/stats' }] : []),
    { label: 'Mapa', path: '/mapa' },
    { label: 'Noticias', path: '/noticias' },
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
          <button 
            onClick={toggleTheme}
            className="p-2 text-slate-600 dark:text-slate-400 hover:text-fifa-blue dark:hover:text-fifa-gold transition-colors"
            title="Cambiar tema"
          >
            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
          </button>

          <button 
            className="lg:hidden p-2 text-slate-900 dark:text-white bg-white dark:bg-slate-800 rounded-full shadow-sm hover:bg-white dark:hover:bg-slate-700 transition-colors"
            onClick={() => setIsMobileMenuOpen(true)}
            aria-label="Abrir menú"
          >
            <Menu size={24} />
          </button>
        </div>
      </div>

      {/* MOBILE DRAWER (rendered in portal so fixed covers viewport) */}
      {typeof document !== 'undefined' && createPortal(
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-0 z-[60] bg-white dark:bg-slate-900 backdrop-blur-sm flex flex-col p-6 sm:p-8"
            >
              <div className="flex justify-between items-center mb-12">
                <span className="font-headline font-black italic text-2xl text-fifa-blue dark:text-white uppercase">FIFA 2026</span>
                <button onClick={() => setIsMobileMenuOpen(false)} aria-label="Cerrar menú" className="p-2 rounded-full bg-slate-100 dark:bg-slate-700 shadow-md hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors">
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
        </AnimatePresence>,
        document.body
      )}
    </nav>
  );
};