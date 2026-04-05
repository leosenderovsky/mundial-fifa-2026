import React, { useState } from 'react';
import { STADIUMS, Stadium } from '../data/stadiums';
import { StadiumDrawer } from '../components/venues/StadiumDrawer';
import { StadiumGrid } from '../components/venues/StadiumGrid';
import { cn } from '../lib/utils';

export default function VenuesStadiums() {
  const [filter, setFilter] = useState<'All' | 'USA' | 'Mexico' | 'Canada'>('All');
  const [selectedStadium, setSelectedStadium] = useState<Stadium | null>(null);

  const filteredStadiums = STADIUMS.filter((s: Stadium) =>
    filter === 'All' || s.country === filter
  );

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

        <div className="flex flex-wrap items-center justify-between gap-6 mb-12 border-b border-slate-200 dark:border-slate-800 pb-8">
          <div className="flex bg-white dark:bg-slate-800 p-1.5 rounded-full shadow-sm">
            {(['All', 'USA', 'Mexico', 'Canada'] as const).map((country) => (
              <button
                key={country}
                onClick={() => setFilter(country)}
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
        </div>

        <StadiumGrid 
          stadiums={filteredStadiums} 
          onSelectStadium={setSelectedStadium} 
        />
      </div>

      <StadiumDrawer
        stadium={selectedStadium}
        onClose={() => setSelectedStadium(null)}
      />
    </div>
  );
}
