import { Link } from 'react-router-dom';
import { MapPin, Users, Navigation, Flag } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { STADIUMS } from '../../data/stadiums';
import { useTheme } from '../../hooks/useTheme';

const getCountryColor = (country: string) => {
  switch (country) {
    case 'USA': return '#0033A0';
    case 'Mexico': return '#006341';
    case 'Canada': return '#EB0000';
    default: return '#F5A800';
  }
};

const createCustomIcon = (color: string) => {
  return L.divIcon({
    className: 'custom-marker',
    html: `<div style="background-color: ${color}; width: 12px; height: 12px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 10px rgba(0,0,0,0.3);"></div>`,
    iconSize: [12, 12],
    iconAnchor: [6, 6],
  });
};

export const VenuesPreview = () => {
  const { theme } = useTheme();
  const hostCities = Array.from(new Set(STADIUMS.map((stadium) => stadium.city))).sort((a, b) =>
    a.localeCompare(b)
  );

  const tileUrl = theme === 'dark' 
    ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
    : 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png';

  return (
    <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center bg-slate-50 dark:bg-slate-900/50 p-8 lg:p-16 rounded-[40px]">
      <div className="space-y-8">
        <div>
          <span className="label-caps text-fifa-red mb-4 block">Anfitriones</span>
          <h2 className="display-md text-fifa-blue dark:text-white leading-none mb-6">
            Norteamérica: <br /> El Escenario <br /> del Mañana
          </h2>
          <p className="body-lg text-slate-600 dark:text-slate-400 max-w-md">
            16 ciudades sede, 3 países, 1 sueño compartido. Explorá los estadios que harán historia en 2026.
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex items-center gap-4 bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-sm">
            <div className="w-10 h-10 bg-fifa-blue/10 flex items-center justify-center rounded-full text-fifa-blue">
              <MapPin size={20} />
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-widest text-slate-400">Sedes</p>
              <span className="font-bold uppercase tracking-tight">16 ciudades confirmadas</span>
            </div>
          </div>
          <div className="flex items-center gap-4 bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-sm">
            <div className="w-10 h-10 bg-fifa-red/10 flex items-center justify-center rounded-full text-fifa-red">
              <Users size={20} />
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-widest text-slate-400">Formato</p>
              <span className="font-bold uppercase tracking-tight">48 selecciones, 104 partidos</span>
            </div>
          </div>
          <div className="flex items-center gap-4 bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-sm">
            <div className="w-10 h-10 bg-fifa-gold/15 flex items-center justify-center rounded-full text-fifa-gold">
              <Flag size={20} />
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-widest text-slate-400">Anfitriones</p>
              <span className="font-bold uppercase tracking-tight">USA, México y Canadá</span>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Ciudades sede</p>
          <div className="flex flex-wrap gap-2">
            {hostCities.map((city) => (
              <span key={city} className="px-3 py-1 rounded-full text-[10px] font-bold uppercase bg-white dark:bg-slate-800 text-slate-500">
                {city}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="relative group overflow-hidden rounded-[32px] shadow-2xl h-[420px] lg:h-full min-h-[420px]">
        <MapContainer 
          center={[37, -95]} 
          zoom={3} 
          scrollWheelZoom={false}
          zoomControl={false}
          className="w-full h-full z-0"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
            url={tileUrl}
          />
          {STADIUMS.map((stadium) => (
            <Marker 
              key={stadium.id} 
              position={stadium.coordinates}
              icon={createCustomIcon(getCountryColor(stadium.country))}
            >
              <Popup>
                <div className="text-xs">
                  <p className="font-bold">{stadium.name}</p>
                  <p className="text-slate-500">{stadium.city}</p>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
        
        <div className="absolute inset-0 bg-gradient-to-t from-fifa-blue/40 to-transparent pointer-events-none z-10" />
        <div className="absolute inset-x-0 bottom-8 flex flex-col items-center justify-center text-white p-4 z-20">
           <Link to="/mapa" className="bg-white text-fifa-blue px-6 py-3 font-black uppercase tracking-widest text-[10px] rounded-full flex items-center gap-3 shadow-2xl transform group-hover:scale-105 transition-all">
             Explorar Mapa Completo <Navigation size={14} />
           </Link>
        </div>
      </div>
    </section>
  );
};

