import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, MapPin } from 'lucide-react';
import { SEO } from '../components/shared/SEO';
import { useApiData } from '../hooks/useApiData';
import { api } from '../lib/api';
import { getFlagCode } from '../lib/flags';
import type { Team } from '../types/api';
import { SkeletonLoader } from '../components/shared/SkeletonLoader';

export default function Teams() {
  const [query, setQuery] = useState('');
  const { data, isLoading, error } = useApiData<{ teams: Team[] }>(
    ['teams'],
    () => api.getCompetitionTeams()
  );

  const teams = data?.teams ?? [];

  const filteredTeams = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return teams;
    return teams.filter((team) =>
      team.name.toLowerCase().includes(normalized) ||
      team.tla?.toLowerCase().includes(normalized)
    );
  }, [teams, query]);

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <SEO
        title="Selecciones"
        description="Todas las selecciones clasificadas y su información oficial del Mundial 2026."
        keywords="selecciones, equipos mundial, fifa 2026, planteles, estadisticas"
      />

      <section className="pt-20 pb-16 px-4 md:px-8">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-12">
            <div>
              <span className="label-caps text-fifa-gold mb-2 block">Explorador</span>
              <h1 className="display-lg uppercase leading-none">Selecciones 2026</h1>
              <p className="text-sm text-white/60 mt-4 max-w-xl">
                Información oficial de cada selección participante, con escudos y detalles del equipo.
              </p>
            </div>
            <div className="relative w-full md:w-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={18} />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                className="bg-white/5 border border-white/10 rounded-full pl-12 pr-6 py-3 text-sm focus:ring-2 ring-fifa-blue transition-all w-full md:w-80"
                placeholder="Buscar selección..."
              />
            </div>
          </div>

          {isLoading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, index) => (
                <SkeletonLoader key={index} variant="card" />
              ))}
            </div>
          )}

          {error && (
            <div className="stadium-card p-6 text-center text-sm text-slate-400">
              No pudimos cargar las selecciones desde la API.
            </div>
          )}

          {!isLoading && !error && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredTeams.map((team) => (
                <Link
                  key={team.id}
                  to={`/selecciones/${team.id}`}
                  className="stadium-card group bg-slate-900/70 border-white/5 hover:border-fifa-blue/50 transition-all overflow-hidden"
                >
                  <div className="h-40 overflow-hidden relative flex items-center justify-center bg-white/5">
                    {team.crest ? (
                      <img src={team.crest} alt={team.name} className="w-24 h-24 object-contain" />
                    ) : getFlagCode(team) ? (
                      <span
                        className={`fi fi-${getFlagCode(team)} w-16 h-10 rounded-sm`}
                        title={team.name}
                        aria-label={team.name}
                      />
                    ) : (
                      <div className="w-20 h-12 bg-slate-700 rounded-sm" />
                    )}
                  </div>
                  <div className="p-6 space-y-2">
                    <h3 className="headline-md uppercase tracking-tight">{team.name}</h3>
                    <div className="flex items-center gap-2 text-xs text-white/60">
                      <MapPin size={14} />
                      <span>{team.tla ?? 'Selección nacional'}</span>
                    </div>
                    <span className="text-[10px] text-white/40 font-bold uppercase tracking-widest">
                      Ver perfil
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
