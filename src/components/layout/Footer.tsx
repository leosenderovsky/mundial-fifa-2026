import { Link } from 'react-router-dom';
import { Globe, Share2, Mail } from 'lucide-react';
import { AdBanner } from '../shared/AdBanner';
import { useStatsVisibility } from '../../hooks/useStatsVisibility';

export const Footer = () => {
  const currentYear = new Date().getFullYear();
  const { isVisible: showStats } = useStatsVisibility();

  return (
    <footer className="bg-slate-100 dark:bg-slate-950 pt-16 pb-8 px-4 md:px-8">
      <div className="container mx-auto">
        {/* AdSense Banner — above footer content (desktop only) */}
        <div className="hidden md:block mb-6">
          <AdBanner slot="3333333333" format="horizontal" className="w-full" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 mb-16">
          
          {/* Brand Col */}
          <div className="space-y-6">
            <h3 className="headline-md text-fifa-blue dark:text-white">MUNDIAL FIFA 2026</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 max-w-xs leading-relaxed">
              La Copa Mundial de la FIFA 2026™ marcará la 23ª edición del certamen, por primera vez con 48 equipos y tres países anfitriones.
            </p>
            <div className="flex space-x-4">
              <button className="p-2 bg-white dark:bg-slate-800 rounded-full shadow-sm hover:text-fifa-blue transition-colors">
                <Globe size={18} />
              </button>
              <button className="p-2 bg-white dark:bg-slate-800 rounded-full shadow-sm hover:text-fifa-blue transition-colors">
                <Share2 size={18} />
              </button>
              <button className="p-2 bg-white dark:bg-slate-800 rounded-full shadow-sm hover:text-fifa-blue transition-colors">
                <Mail size={18} />
              </button>
            </div>
          </div>

          {/* Navegación interna */}
          <div>
            <h4 className="label-caps mb-6">Sitio</h4>
            <ul className="space-y-4 text-sm font-medium">
              <li>
                <Link to="/" className="hover:text-fifa-blue dark:hover:text-fifa-gold transition-colors">Inicio</Link>
              </li>
              <li>
                <Link to="/fixture" className="hover:text-fifa-blue dark:hover:text-fifa-gold transition-colors">Fixture</Link>
              </li>
              <li>
                <Link to="/sedes" className="hover:text-fifa-blue dark:hover:text-fifa-gold transition-colors">Sedes</Link>
              </li>
              <li>
                <Link to="/selecciones" className="hover:text-fifa-blue dark:hover:text-fifa-gold transition-colors">Selecciones</Link>
              </li>
              {showStats && (
                <li>
                  <Link to="/stats" className="hover:text-fifa-blue dark:hover:text-fifa-gold transition-colors">Estadísticas</Link>
                </li>
              )}
              <li>
                <Link to="/mapa" className="hover:text-fifa-blue dark:hover:text-fifa-gold transition-colors">Mapa</Link>
              </li>
              <li>
                <Link to="/noticias" className="hover:text-fifa-blue dark:hover:text-fifa-gold transition-colors">Noticias</Link>
              </li>
            </ul>
          </div>

          {/* (App links removed) */}
        </div>

        {/* Copyright */}
          <div className="pt-8 border-t border-slate-200 dark:border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] uppercase tracking-widest font-bold text-slate-500">
          <p>© {currentYear} FIFA. Todos los derechos reservados.</p>
          <p>Desarrollado por <a href="https://leosenderovsky.com.ar/ia/" target="_blank" rel="noopener noreferrer" className="text-fifa-blue dark:text-fifa-gold">sender.ia</a></p>
        </div>
      </div>
    </footer>
  );
};