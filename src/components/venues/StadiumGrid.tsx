import React from 'react';
import { Stadium } from '../../data/stadiums';
import { MapPin, Maximize2 } from 'lucide-react';
import { cn } from '../../lib/utils';

interface StadiumGridProps {
  stadiums: Stadium[];
  onSelectStadium: (stadium: Stadium) => void;
}

export function StadiumGrid({ stadiums, onSelectStadium }: StadiumGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {stadiums.map((stadium: Stadium) => (
        <div
          key={stadium.id}
          onClick={() => onSelectStadium(stadium)}
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
              <div className="flex flex-col">
                <span className="text-[8px] font-black uppercase text-slate-400">Superficie</span>
                <span className="text-[10px] font-bold">Híbrida</span>
              </div>
              <button className="flex items-center gap-2 text-fifa-blue dark:text-fifa-gold font-black text-[10px] uppercase tracking-widest hover:translate-x-1 transition-transform">
                Ver Detalles <Maximize2 size={12} />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
