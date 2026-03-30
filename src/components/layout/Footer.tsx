import { Globe, Share2, Mail } from 'lucide-react';

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-100 dark:bg-slate-950 pt-16 pb-8 px-4 md:px-8">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* Brand Col */}
          <div className="space-y-6">
            <h3 className="headline-md text-fifa-blue dark:text-white">FIFA 2026</h3>
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

          {/* Enlaces Col */}
          <div>
            <h4 className="label-caps mb-6">Enlaces</h4>
            <ul className="space-y-4 text-sm font-medium">
              <li><a href="#" className="hover:text-fifa-blue dark:hover:text-fifa-gold transition-colors">Privacidad</a></li>
              <li><a href="#" className="hover:text-fifa-blue dark:hover:text-fifa-gold transition-colors">Términos de Servicio</a></li>
              <li><a href="#" className="hover:text-fifa-blue dark:hover:text-fifa-gold transition-colors">Contacto</a></li>
              <li><a href="#" className="hover:text-fifa-blue dark:hover:text-fifa-gold transition-colors">Prensa</a></li>
              <li><a href="#" className="hover:text-fifa-blue dark:hover:text-fifa-gold transition-colors">Sostenibilidad</a></li>
            </ul>
          </div>

          {/* Oficial Col */}
          <div>
            <h4 className="label-caps mb-6">Oficial</h4>
            <ul className="space-y-4 text-sm font-medium">
              <li><a href="#" className="hover:text-fifa-blue dark:hover:text-fifa-gold transition-colors">FIFA.com</a></li>
              <li><a href="#" className="hover:text-fifa-blue dark:hover:text-fifa-gold transition-colors">Entradas</a></li>
              <li><a href="#" className="hover:text-fifa-blue dark:hover:text-fifa-gold transition-colors">Hospitalidad</a></li>
              <li><a href="#" className="hover:text-fifa-blue dark:hover:text-fifa-gold transition-colors">Tienda Oficial</a></li>
            </ul>
          </div>

          {/* App Col */}
          <div className="space-y-6">
            <h4 className="label-caps">Descarga la App</h4>
            <p className="text-xs text-slate-500">Recibí alertas de goles y noticias en tiempo real directamente en tu dispositivo.</p>
            <div className="flex flex-col space-y-3">
              <div className="h-10 w-32 bg-slate-900 dark:bg-slate-800 rounded-md flex items-center justify-center border border-white/10">
                <span className="text-[10px] text-white font-mono uppercase">App Store</span>
              </div>
              <div className="h-10 w-32 bg-slate-900 dark:bg-slate-800 rounded-md flex items-center justify-center border border-white/10">
                <span className="text-[10px] text-white font-mono uppercase">Google Play</span>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-8 border-t border-slate-200 dark:border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] uppercase tracking-widest font-bold text-slate-500">
          <p>© {currentYear} FIFA. Todos los derechos reservados.</p>
          <p>Desarrollado por <span className="text-fifa-blue dark:text-fifa-gold">sender.ia</span></p>
        </div>
      </div>
    </footer>
  );
};