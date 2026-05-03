import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { getDaysToTournament } from '../shared/CountdownTimer';

export const HeroSection = () => {
  const daysLeft = getDaysToTournament();

  return (
    <section className="relative h-[90vh] min-h-[700px] w-full overflow-hidden bg-gradient-to-br from-[#0033A0] to-[#00216E] flex items-center">
      <div className="absolute inset-0 bg-noise pointer-events-none opacity-20" />
      
      {/* Decorative elements */}
      <div className="absolute top-1/4 -right-20 w-96 h-96 bg-blue-500/20 rounded-full blur-[120px]" />
      <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-fifa-gold/10 rounded-full blur-[100px]" />

      <div className="absolute inset-0 bg-black/20" />

      <div className="container mx-auto px-4 md:px-8 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl"
        >
          <h1 className="display-lg text-white mb-6">
            El mundo se <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-white/50">une. 2026.</span>
          </h1>
          <p className="headline-md text-fifa-gold uppercase tracking-widest mb-12">
            48 Selecciones. 3 Países. 1 Campeón.
          </p>
          
          <div className="flex flex-wrap items-center gap-x-8 gap-y-4 text-white/90 font-bold mb-12">
            <div className="flex items-center gap-2">
              <span className="text-fifa-gold text-2xl">104</span>
              <span className="text-xs uppercase tracking-wider opacity-70">Partidos</span>
            </div>
            <div className="w-1 h-1 bg-white/30 rounded-full" />
            <div className="flex items-center gap-2">
              <span className="text-fifa-gold text-2xl">16</span>
              <span className="text-xs uppercase tracking-wider opacity-70">Sedes</span>
            </div>
            <div className="w-1 h-1 bg-white/30 rounded-full" />
            <div className="flex items-center gap-2">
              <span className="text-fifa-gold text-2xl">48</span>
              <span className="text-xs uppercase tracking-wider opacity-70">Selecciones</span>
            </div>
            <div className="w-1 h-1 bg-white/30 rounded-full" />
            <div className="flex items-center gap-2">
              <span className="text-fifa-gold text-2xl">{daysLeft}</span>
              <span className="text-xs uppercase tracking-wider opacity-70">Días</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-4">
            <Link 
              to="/fixture"
              className="bg-white text-fifa-blue px-8 py-4 font-black uppercase tracking-tighter hover:bg-fifa-gold hover:text-white transition-all transform hover:-translate-y-1 inline-block"
            >
              Ver Fixture Completo
            </Link>
            <Link 
              to="/sedes"
              className="border-2 border-white text-white px-8 py-4 font-black uppercase tracking-tighter backdrop-blur-sm hover:bg-white/10 transition-all inline-block"
            >
              Explorar Estadios
            </Link>
          </div>
        </motion.div>
      </div>

      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/30 text-[10px] font-bold uppercase tracking-[0.5em] animate-bounce">
        Deslizar
      </div>
    </section>
  );
};