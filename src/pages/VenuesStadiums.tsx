import React, { useState } from 'react';
import { STADIUMS, Stadium } from '../data/stadiums';
import { StadiumDrawer } from '../components/venues/StadiumDrawer';
import { MapPin, Users, Maximize2 } from 'lucide-react';
import { cn } from '../lib/utils';

export default function VenuesStadiums() {
  const [filter, setFilter] = useState<'All' | 'USA' | 'Mexico' | 'Canada'>('All');
  const [selectedStadium, setSelectedStadium] = useState<Stadium | null>(null);

  const filteredStadiums = STADIUMS.filter(s => filter === 'All' || s.country === filter);

  return (
    <div className="min-h-screen bg-surface-canvas pt-16 pb-24">
      <div className="container mx-auto px-4 md:px-8">
        
        <header className="mb-16">
          <span className="label-caps mb-4 block">16 Ciudades Anfitrionas</span>
          <h1 className="display-lg text-fifa-blue dark:text-white leading-[0.85] -ml-1">
            Las Sedes del <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-fifa-blue to-fifa-red">Mundial 2026</span>
          </h1>
        </header>

        {/* Filtros */}
        <div className="flex flex-wrap items-center justify-between gap-6 mb-12 border-b border-slate-200 dark:border-slate-800 pb-8">
          <div className="flex bg-white dark:bg-slate-800 p-1.5 rounded-full shadow-sm">
            {['All', 'USA', 'Mexico', 'Canada'].map((country) => (
              <button
                key={country}
                onClick={() => setFilter(country as any)}
                className={cn(
                  "px-8 py-2.5 rounded-full text-xs font-black uppercase tracking-widest transition-all",
                  filter === country 
                    ? "bg-fifa-blue text-white shadow-lg" 
                    : "text-slate-400 hover:text-slate-900 dark:hover:text-white"
                )}
              >
                {country === 'All' ? 'Todas' : country}
              </button>
            ))}
          </div>
          <select className="bg-transparent font-bold text-sm uppercase tracking-widest border-none focus:ring-0 cursor-pointer">
            <option>Ordenar por Capacidad</option>
            <option>Ordenar por Nombre</option>
          </select>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredStadiums.map((stadium) => (
            <div
              key={stadium.id}
              onClick={() => setSelectedStadium(stadium)}
              className={cn(
                "stadium-card group cursor-pointer relative",
                stadium.id === 'azteca' && "lg:col-span-2"
              )}
            >
              <div className="aspect-[16/9] overflow-hidden relative">
                <img 
                  src={stadium.imageUrl} 
                  alt={stadium.name} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute top-4 left-4 flex gap-2">
                  <span className="bg-white/90 dark:bg-slate-900/90 backdrop-blur px-3 py-1 rounded-full text-[10px] font-black uppercase">
                    {stadium.country}
                  </span>
                  <span className="bg-fifa-blue text-white px-3 py-1 rounded-full text-[10px] font-black uppercase">
                    {stadium.matchesAssigned} Partidos
                  </span>
                </div>
              </div>

              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="headline-md mb-1">{stadium.name}</h3>
                    <div className="flex items-center gap-1.5 text-slate-500">
                      <MapPin size={14} />
                      <span className="text-xs font-bold uppercase tracking-tight">{stadium.city}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Capacidad</p>
                    <p className="stat-lg text-2xl">{stadium.capacity.toLocaleString()}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-6 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex gap-4">
                    <div className="flex flex-col">
                      <span className="text-[8px] font-black uppercase text-slate-400">Superficie</span>
                      <span className="text-[10px] font-bold">Híbrida</span>
                    </div>
                  </div>
                  <button className="flex items-center gap-2 text-fifa-blue dark:text-fifa-gold font-black text-[10px] uppercase tracking-widest hover:translate-x-1 transition-transform">
                    Ver Detalles <Maximize2 size={12} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <StadiumDrawer 
        stadium={selectedStadium} 
        onClose={() => setSelectedStadium(null)} 
      />
    </div>
  );
}