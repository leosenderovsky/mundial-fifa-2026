import { Link } from 'react-router-dom';
import { MapPin, Users, Navigation, Flag } from 'lucide-react';
import { STADIUMS } from '../../data/stadiums';

export const VenuesPreview = () => {
  const hostCities = Array.from(new Set(STADIUMS.map((stadium) => stadium.city))).sort((a, b) =>
    a.localeCompare(b)
  );

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
              <span className="font-bold uppercase tracking-tight">Estados Unidos, México y Canadá</span>
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

      <div className="relative group overflow-hidden rounded-[32px] shadow-2xl">
        <img 
          src="https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&q=80&w=1200" 
          className="w-full aspect-square object-cover group-hover:scale-105 transition-transform duration-1000 opacity-80" 
          alt="Mapa Mundial" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-fifa-blue to-transparent" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-8">
           <div className="flex gap-4 mb-4">
              <div className="w-3 h-3 bg-fifa-red rounded-full animate-pulse" />
              <div className="w-3 h-3 bg-fifa-gold rounded-full animate-pulse delay-75" />
              <div className="w-3 h-3 bg-white rounded-full animate-pulse delay-150" />
           </div>
           <Link to="/mapa" className="bg-white text-fifa-blue px-8 py-4 font-black uppercase tracking-widest text-xs rounded-full flex items-center gap-3 shadow-2xl transform group-hover:scale-110 transition-all">
             Explorar Mapa Interactivo <Navigation size={16} />
           </Link>
        </div>
      </div>
    </section>
  );
};
