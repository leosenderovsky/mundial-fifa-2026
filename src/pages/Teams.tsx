import { motion, AnimatePresence } from 'framer-motion'; // Asegurá esta línea arriba
import React, { useState } from 'react';
import { Search, Trophy, TrendingUp, Zap } from 'lucide-react';
import { TacticalPitch } from '../components/teams/TacticalPitch';
import { cn } from '../lib/utils';

const ARG_PLAYERS = [
  { id: 10, name: 'L. MESSI', number: 10, pos: { x: 50, y: 30 }, isCaptain: true },
  { id: 9, name: 'J. ALVAREZ', number: 9, pos: { x: 20, y: 25 } },
  { id: 11, name: 'N. GONZALEZ', number: 11, pos: { x: 80, y: 25 } },
  { id: 7, name: 'R. DE PAUL', number: 7, pos: { x: 70, y: 55 } },
  { id: 24, name: 'E. FERNANDEZ', number: 24, pos: { x: 50, y: 60 } },
  { id: 20, name: 'A. MAC ALLISTER', number: 20, pos: { x: 30, y: 55 } },
  { id: 26, name: 'N. MOLINA', number: 26, pos: { x: 85, y: 75 } },
  { id: 13, name: 'C. ROMERO', number: 13, pos: { x: 65, y: 80 } },
  { id: 19, name: 'N. OTAMENDI', number: 19, pos: { x: 35, y: 80 } },
  { id: 3, name: 'N. TAGLIAFICO', number: 3, pos: { x: 15, y: 75 } },
  { id: 23, name: 'E. MARTINEZ', number: 23, pos: { x: 50, y: 92 } },
];

export default function Teams() {
  const [activeTab, setActiveTab] = useState('PLANTEL');

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Hero Argentina */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full opacity-20 pointer-events-none">
            <img src="https://crests.football-data.org/ARG.svg" className="w-full h-full scale-150" alt="Argentina" />
        </div>
        
        <div className="container mx-auto px-4 md:px-8 relative z-10">
          <div className="flex flex-col md:flex-row items-end gap-8 mb-12">
            <div className="w-32 h-32 lg:w-48 lg:h-48 bg-white/10 backdrop-blur-xl p-4 rounded-2xl border border-white/20">
              <img src="https://crests.football-data.org/ARG.svg" className="w-full h-full object-contain" alt="Argentina" />
            </div>
            <div className="flex-1">
              <div className="flex flex-wrap gap-3 mb-4">
                <span className="bg-fifa-red text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest flex items-center gap-2">
                  <Trophy size={12} /> Campeón Actual
                </span>
                <span className="bg-fifa-blue text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest flex items-center gap-2">
                  <TrendingUp size={12} /> Ranking #1
                </span>
              </div>
              <h1 className="display-lg leading-none mb-4">ARGENTINA</h1>
              <p className="font-mono text-fifa-gold uppercase tracking-[0.3em] font-bold">DT: Lionel Scaloni • 3 Copas del Mundo</p>
            </div>
          </div>

          <div className="flex border-b border-white/10 mb-12 overflow-x-auto whitespace-nowrap">
            {['PLANTEL', 'PARTIDOS', 'ESTADÍSTICAS', 'ACERCA DE'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "px-8 py-4 text-xs font-black uppercase tracking-widest transition-all relative",
                  activeTab === tab ? "text-fifa-gold" : "text-white/40 hover:text-white"
                )}
              >
                {tab}
                {activeTab === tab && (
                  <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-1 bg-fifa-gold" />
                )}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
              <h3 className="label-caps text-white mb-6">Formación Táctica</h3>
              <TacticalPitch formation="4-3-3" players={ARG_PLAYERS} />
            </div>
            
            <div className="space-y-8">
              <div>
                <h3 className="label-caps text-white mb-6">Líderes de Equipo</h3>
                <div className="space-y-4">
                  {[
                    { name: 'Lionel Messi', stat: '9.8', label: 'Rating Promedio' },
                    { name: 'Julián Álvarez', stat: '8.4', label: 'Goles/Partido' },
                    { name: 'Enzo Fernández', stat: '7.9', label: 'Eficacia Pase' },
                  ].map((leader, i) => (
                    <div key={i} className="bg-white/5 border border-white/10 p-4 rounded-xl flex justify-between items-center">
                      <div>
                        <p className="text-[10px] text-white/40 font-bold uppercase">{leader.label}</p>
                        <p className="font-bold">{leader.name}</p>
                      </div>
                      <span className="stat-lg text-2xl text-fifa-gold">{leader.stat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-fifa-gold/10 border border-fifa-gold/20 p-6 rounded-xl relative overflow-hidden group">
                <Zap className="absolute -right-4 -bottom-4 w-24 h-24 text-fifa-gold opacity-10 group-hover:scale-110 transition-transform" />
                <h4 className="label-caps text-fifa-gold mb-2 flex items-center gap-2">Dato Clave <Zap size={14} /></h4>
                <p className="text-sm text-white/80 leading-relaxed font-medium">
                  Argentina no ha perdido ningún partido oficial cuando Messi marca el primer gol desde 2019.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Explorador de Selecciones */}
      <section className="bg-slate-900 py-24 px-4 md:px-8">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-12">
            <div>
              <span className="label-caps text-fifa-gold mb-2 block">Explorador</span>
              <h2 className="headline-lg uppercase">Todas las Selecciones</h2>
            </div>
            <div className="flex flex-wrap gap-4">
               <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={18} />
                  <input 
                    className="bg-white/5 border border-white/10 rounded-full pl-12 pr-6 py-3 text-sm focus:ring-2 ring-fifa-blue transition-all"
                    placeholder="Buscar selección..."
                  />
               </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {['BRASIL', 'FRANCIA', 'ITALIA', 'MÉXICO'].map((name) => (
              <div key={name} className="stadium-card group bg-slate-800 border-white/5 hover:border-fifa-blue/50 transition-all overflow-hidden cursor-pointer">
                <div className="h-48 overflow-hidden relative">
                   <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent" />
                   <div className="absolute top-4 left-4 flex gap-2">
                      <span className="bg-fifa-red text-white text-[8px] font-black px-2 py-1 rounded-sm uppercase tracking-tighter">En Competencia</span>
                   </div>
                   <div className="w-full h-full flex items-center justify-center p-12">
                      <div className="w-20 h-20 group-hover:scale-110 transition-transform duration-500">
                         <img src={`https://crests.football-data.org/${name === 'MÉXICO' ? 'MEX' : name.slice(0,3)}.svg`} alt={name} className="w-full h-full object-contain" />
                      </div>
                   </div>
                </div>
                <div className="p-6">
                   <h3 className="headline-md mb-1 uppercase tracking-tight">{name}</h3>
                   <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest">Grupo A • CONCACAF</p>
                   <button className="w-full mt-6 py-3 border border-white/10 rounded-lg text-[10px] font-black uppercase hover:bg-white/5 transition-colors">Ver Perfil</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}