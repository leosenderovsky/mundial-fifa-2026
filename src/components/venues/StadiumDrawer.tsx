import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, Users, CloudRain, Thermometer, Info, MapPin, Ticket } from 'lucide-react';
import { Stadium } from '../../data/stadiums';
import { StadiumMiniMap } from './StadiumMiniMap';

interface Props {
  stadium: Stadium | null;
  onClose: () => void;
}

export const StadiumDrawer = ({ stadium, onClose }: Props) => {
  if (!stadium) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex justify-end">
        {/* Backdrop */}
        <motion.div 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
        />
        
        {/* Drawer Content */}
        <motion.div
          initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="relative w-full max-w-[520px] h-full bg-surface-card shadow-2xl overflow-y-auto"
        >
          <button onClick={onClose} className="absolute top-6 left-6 z-10 p-2 bg-white/20 hover:bg-white/40 rounded-full backdrop-blur-md transition-colors">
            <X className="text-white" />
          </button>

          <div className="h-80 w-full relative">
            <img src={stadium.imageUrl} alt={stadium.name} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent" />
            <div className="absolute bottom-8 left-8 right-8">
              <span className="label-caps text-fifa-gold mb-2 block">Sede Histórica</span>
              <h2 className="display-md text-white">{stadium.name}</h2>
              <div className="flex gap-4 mt-4">
                <div className="bg-white/10 backdrop-blur-md p-2 rounded-lg flex items-center gap-2">
                  <Thermometer size={14} className="text-white" />
                  <span className="text-[10px] font-bold text-white uppercase">{stadium.avgTemp}</span>
                </div>
                <div className="bg-white/10 backdrop-blur-md p-2 rounded-lg flex items-center gap-2">
                  <CloudRain size={14} className="text-white" />
                  <span className="text-[10px] font-bold text-white uppercase">45% Humedad</span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-8 space-y-10">
            {/* Ficha Técnica */}
            <section>
              <h4 className="label-caps mb-6 text-slate-400">Ficha Técnica</h4>
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <p className="text-[10px] uppercase font-bold text-slate-500 mb-1">Inauguración</p>
                  <p className="font-headline font-bold">1966 <span className="text-slate-400 font-normal">(Renovado 2024)</span></p>
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-slate-500 mb-1">Capacidad FIFA</p>
                  <p className="font-headline font-bold">{stadium.capacity.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-slate-500 mb-1">Tipo de Techo</p>
                  <p className="font-headline font-bold">Fijo Parcial</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-slate-500 mb-1">Altitud</p>
                  <p className="font-headline font-bold">2,200 m</p>
                </div>
              </div>
            </section>

            {/* Ubicación */}
            <section>
              <h4 className="label-caps mb-4 text-slate-400">Ubicación y Entorno</h4>
              <StadiumMiniMap coords={stadium.coordinates} />
            </section>

            {/* Partidos */}
            <section>
              <h4 className="label-caps mb-4 text-slate-400">Partidos Asignados</h4>
              <div className="space-y-3">
                {stadium.phases.map((phase, idx) => (
                  <div key={idx} className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-3">
                      <Calendar size={18} className="text-fifa-blue" />
                      <div>
                        <p className="text-[10px] uppercase font-black text-fifa-red">11 Jun 2026</p>
                        <p className="text-sm font-bold uppercase tracking-tight">{phase}</p>
                      </div>
                    </div>
                    <Info size={16} className="text-slate-400" />
                  </div>
                ))}
              </div>
            </section>

            <button className="w-full py-5 bg-fifa-red text-white font-black uppercase tracking-widest text-sm rounded-xl hover:bg-red-700 transition-all shadow-xl shadow-red-500/20 flex items-center justify-center gap-3">
              <Ticket size={20} />
              Comprar Entradas
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};