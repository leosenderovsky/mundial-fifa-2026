import React, { useState } from 'react';
import { STADIUMS, Stadium } from '../data/stadiums';
import { StadiumDrawer } from '../components/venues/StadiumDrawer';
import { StadiumGrid } from '../components/venues/StadiumGrid';
import { SEO } from '../components/shared/SEO';
import { cn } from '../lib/utils';

export default function VenuesStadiums() {
  const [filter, setFilter] = useState<'All' | 'USA' | 'Mexico' | 'Canada'>('All');
  const [selectedStadium, setSelectedStadium] = useState<Stadium | null>(null);

  const filteredStadiums = STADIUMS.filter((s: Stadium) =>
    filter === 'All' || s.country === filter
  );

  return (
    <div className="min-h-screen bg-surface-canvas pt-16 pb-24">
      <SEO
        title="Sedes y Estadios"
        description="Las 16 sedes oficiales del Mundial FIFA 2026 en Estados Unidos, México y Canadá. Capacidades, ciudades anfitrionas, y todo sobre los estadios del World Cup 2026."
        keywords="sedes mundial 2026, estadios fifa 2026, metlife stadium, estadio azteca, bc place, ciudades anfitrionas"
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "ItemList",
          "name": "Sedes del Mundial FIFA 2026",
          "description": "Los 16 estadios oficiales de la Copa Mundial de la FIFA 2026",
          "numberOfItems": 16,
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "MetLife Stadium", "item": { "@type": "Place", "name": "MetLife Stadium", "address": { "@type": "PostalAddress", "addressLocality": "East Rutherford", "addressRegion": "NJ", "addressCountry": "US" }, "geo": { "@type": "GeoCoordinates", "latitude": 40.8135, "longitude": -74.0744 } } },
            { "@type": "ListItem", "position": 2, "name": "Estadio Azteca", "item": { "@type": "Place", "name": "Estadio Azteca", "address": { "@type": "PostalAddress", "addressLocality": "Ciudad de México", "addressCountry": "MX" }, "geo": { "@type": "GeoCoordinates", "latitude": 19.3029, "longitude": -99.1505 } } },
            { "@type": "ListItem", "position": 3, "name": "AT&T Stadium", "item": { "@type": "Place", "name": "AT&T Stadium", "address": { "@type": "PostalAddress", "addressLocality": "Arlington", "addressRegion": "TX", "addressCountry": "US" }, "geo": { "@type": "GeoCoordinates", "latitude": 32.7473, "longitude": -97.0945 } } },
            { "@type": "ListItem", "position": 4, "name": "BC Place", "item": { "@type": "Place", "name": "BC Place", "address": { "@type": "PostalAddress", "addressLocality": "Vancouver", "addressCountry": "CA" } } },
            { "@type": "ListItem", "position": 5, "name": "Mercedes-Benz Stadium", "item": { "@type": "Place", "name": "Mercedes-Benz Stadium", "address": { "@type": "PostalAddress", "addressLocality": "Atlanta", "addressRegion": "GA", "addressCountry": "US" } } },
            { "@type": "ListItem", "position": 6, "name": "Levi's Stadium", "item": { "@type": "Place", "name": "Levi's Stadium", "address": { "@type": "PostalAddress", "addressLocality": "Santa Clara", "addressRegion": "CA", "addressCountry": "US" } } },
            { "@type": "ListItem", "position": 7, "name": "Rose Bowl Stadium", "item": { "@type": "Place", "name": "Rose Bowl Stadium", "address": { "@type": "PostalAddress", "addressLocality": "Pasadena", "addressRegion": "CA", "addressCountry": "US" } } },
            { "@type": "ListItem", "position": 8, "name": "SoFi Stadium", "item": { "@type": "Place", "name": "SoFi Stadium", "address": { "@type": "PostalAddress", "addressLocality": "Inglewood", "addressRegion": "CA", "addressCountry": "US" } } },
            { "@type": "ListItem", "position": 9, "name": "Allegiant Stadium", "item": { "@type": "Place", "name": "Allegiant Stadium", "address": { "@type": "PostalAddress", "addressLocality": "Las Vegas", "addressRegion": "NV", "addressCountry": "US" } } },
            { "@type": "ListItem", "position": 10, "name": "Arrowhead Stadium", "item": { "@type": "Place", "name": "Arrowhead Stadium", "address": { "@type": "PostalAddress", "addressLocality": "Kansas City", "addressRegion": "MO", "addressCountry": "US" } } },
            { "@type": "ListItem", "position": 11, "name": "NRG Stadium", "item": { "@type": "Place", "name": "NRG Stadium", "address": { "@type": "PostalAddress", "addressLocality": "Houston", "addressRegion": "TX", "addressCountry": "US" } } },
            { "@type": "ListItem", "position": 12, "name": "Estadio BBVA", "item": { "@type": "Place", "name": "Estadio BBVA", "address": { "@type": "PostalAddress", "addressLocality": "Monterrey", "addressCountry": "MX" } } },
            { "@type": "ListItem", "position": 13, "name": "Estadio Akron", "item": { "@type": "Place", "name": "Estadio Akron", "address": { "@type": "PostalAddress", "addressLocality": "Guadalajara", "addressCountry": "MX" } } },
            { "@type": "ListItem", "position": 14, "name": "BMO Field", "item": { "@type": "Place", "name": "BMO Field", "address": { "@type": "PostalAddress", "addressLocality": "Toronto", "addressCountry": "CA" } } },
            { "@type": "ListItem", "position": 15, "name": "Lincoln Financial Field", "item": { "@type": "Place", "name": "Lincoln Financial Field", "address": { "@type": "PostalAddress", "addressLocality": "Philadelphia", "addressRegion": "PA", "addressCountry": "US" } } },
            { "@type": "ListItem", "position": 16, "name": "Gillette Stadium", "item": { "@type": "Place", "name": "Gillette Stadium", "address": { "@type": "PostalAddress", "addressLocality": "Foxborough", "addressRegion": "MA", "addressCountry": "US" } } }
          ]
        }}
      />
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
