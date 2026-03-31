import { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, ZoomControl } from 'react-leaflet';
import L from 'leaflet';
import { Search, Map as MapIcon, Navigation, Flame, ChevronRight } from 'lucide-react';
import { SEO } from '../components/shared/SEO';
import { STADIUMS, Stadium } from '../data/stadiums';
import { useTheme } from '../hooks/useTheme';
import { cn } from '../lib/utils';
import 'leaflet/dist/leaflet.css';

const createDivIcon = (color: string) => L.divIcon({
  className: 'custom-pin',
  html: `<div class="w-8 h-8 rounded-full border-4 border-white shadow-lg flex items-center justify-center" style="background-color: ${color}">
          <div class="w-2 h-2 bg-white rounded-full animate-pulse"></div>
         </div>`,
  iconSize: [32, 32],
  iconAnchor: [16, 32]
});

const ICONS: Record<Stadium['country'], L.DivIcon> = {
  USA: createDivIcon('#0033A0'),
  Mexico: createDivIcon('#006341'),
  Canada: createDivIcon('#EB0000'),
};

type LayerType = 'SEDES' | 'RUTAS' | 'CALOR';

export default function WorldMap() {
  const { theme } = useTheme();
  const [search, setSearch] = useState('');
  const [activeLayer, setActiveLayer] = useState<LayerType>('SEDES');

  const filteredStadiums = STADIUMS.filter((s: Stadium) =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.city.toLowerCase().includes(search.toLowerCase())
  );

  const mapTile = theme === 'dark'
    ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
    : "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png";

  return (
    <div className="h-[calc(100vh-80px)] flex flex-col md:flex-row overflow-hidden">
      <SEO
        title="Mapa Interactivo"
        description="Mapa en tiempo real de las sedes del Mundial 2026. Rutas de viaje y calor de goles por ciudad."
        keywords="mapa mundial 2026, sedes interactivas, ciudades anfitrionas fifa"
      />

      {/* MAP AREA (70%) */}
      <div className="relative flex-1 h-1/2 md:h-full">
        <MapContainer
          center={[38, -98]}
          zoom={4}
          zoomControl={false}
          className="h-full w-full z-0"
        >
          <TileLayer url={mapTile} />
          <ZoomControl position="topleft" />

          {filteredStadiums.map((stadium: Stadium) => (
            <Marker
              key={stadium.id}
              position={stadium.coordinates}
              icon={ICONS[stadium.country]}
            >
              <Popup className="stadium-popup">
                <div className="w-48 overflow-hidden rounded-lg">
                  <img src={stadium.imageUrl} alt={stadium.name} className="h-24 w-full object-cover" />
                  <div className="p-3">
                    <h4 className="font-bold text-xs uppercase">{stadium.name}</h4>
                    <p className="text-[10px] text-slate-500">{stadium.city}, {stadium.country}</p>
                    <button className="mt-2 text-[10px] font-black text-fifa-blue uppercase">Ver detalles</button>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>

        {/* Floating Layer Toggle */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl p-1.5 rounded-full shadow-2xl border border-white/20">
          {([
            { id: 'SEDES', icon: MapIcon, label: 'Sedes' },
            { id: 'RUTAS', icon: Navigation, label: 'Rutas' },
            { id: 'CALOR', icon: Flame, label: 'Calor' }
          ] as const).map(layer => (
            <button
              key={layer.id}
              onClick={() => setActiveLayer(layer.id)}
              className={cn(
                "flex items-center gap-2 px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all",
                activeLayer === layer.id ? "bg-fifa-blue text-white shadow-lg" : "text-slate-500"
              )}
            >
              <layer.icon size={14} /> {layer.label}
            </button>
          ))}
        </div>
      </div>

      {/* SIDEBAR (30%) */}
      <aside className="w-full md:w-[400px] bg-white dark:bg-slate-900 border-l border-slate-100 dark:border-slate-800 flex flex-col">
        <div className="p-6 border-b border-slate-100 dark:border-slate-800">
          <div className="flex justify-between items-end mb-6">
            <div>
              <span className="label-caps text-fifa-blue">Norteamérica 2026</span>
              <h2 className="headline-lg leading-none">16 SEDES</h2>
            </div>
            <span className="font-mono text-slate-300 text-sm">#01-16</span>
          </div>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl pl-12 pr-4 py-3 text-sm focus:ring-2 ring-fifa-blue transition-all"
              placeholder="Buscar ciudad o estadio..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {filteredStadiums.map((stadium: Stadium) => (
            <div
              key={stadium.id}
              className="group p-4 flex gap-4 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer transition-colors border-b border-slate-50 dark:border-slate-800/50"
            >
              <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                <img src={stadium.imageUrl} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt={stadium.name} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start">
                  <h4 className="font-bold text-sm uppercase truncate">{stadium.city}</h4>
                  <span className={cn(
                    "text-[8px] font-black px-1.5 py-0.5 rounded uppercase flex-shrink-0 ml-1",
                    stadium.country === 'Mexico' ? "bg-green-100 text-green-700" :
                    stadium.country === 'USA' ? "bg-blue-100 text-blue-700" : "bg-red-100 text-red-700"
                  )}>{stadium.country.slice(0, 3)}</span>
                </div>
                <p className="text-xs text-slate-500 mt-1">{stadium.name}</p>
                <div className="flex items-center gap-4 mt-3 text-[10px] font-bold text-slate-400 uppercase">
                  <span>Cap: {(stadium.capacity / 1000).toFixed(0)}k</span>
                  <span>{stadium.matchesAssigned} Partidos</span>
                </div>
              </div>
              <ChevronRight className="self-center text-slate-300 group-hover:text-fifa-blue transition-colors" size={16} />
            </div>
          ))}
        </div>
      </aside>
    </div>
  );
}
