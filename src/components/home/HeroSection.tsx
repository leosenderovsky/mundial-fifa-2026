import { motion } from 'framer-motion';
import { CountdownTimer } from '../shared/CountdownTimer';

export const HeroSection = () => (
  <section className="relative h-[90vh] min-h-[700px] w-full overflow-hidden bg-gradient-to-br from-[#0033A0] to-[#00216E] flex items-center">
    <div className="absolute inset-0 bg-noise pointer-events-none" />
    
    {/* Video Overlay Placeholder */}
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
        
        <CountdownTimer />

        <div className="flex flex-wrap gap-4 mt-12">
          <button className="bg-white text-fifa-blue px-8 py-4 font-black uppercase tracking-tighter hover:bg-fifa-gold hover:text-white transition-all transform hover:-translate-y-1">
            Ver Fixture Completo
          </button>
          <button className="border-2 border-white text-white px-8 py-4 font-black uppercase tracking-tighter backdrop-blur-sm hover:bg-white/10 transition-all">
            Explorar Estadios
          </button>
        </div>
      </motion.div>
    </div>

    <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/30 text-[10px] font-bold uppercase tracking-[0.5em] animate-bounce">
      Deslizar
    </div>
  </section>
);