import { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Trophy, TrendingUp, Zap, User } from 'lucide-react';
import { useApiData } from '../hooks/useApiData';
import { api } from '../lib/api';
import { SkeletonLoader } from '../components/shared/SkeletonLoader';
import { cn } from '../lib/utils';
import { getFlagCode } from '../lib/flags';
import type { Player, Team } from '../types/api';

type TabKey = 'PLANTEL' | 'PARTIDOS' | 'ESTADÍSTICAS' | 'ACERCA DE';

const groupPlayersByPosition = (squad: Player[]) => {
  const groups: Record<string, Player[]> = {
    Arqueros: [],
    Defensores: [],
    Mediocampistas: [],
    Delanteros: [],
    Otros: [],
  };

  squad.forEach((player) => {
    switch (player.position) {
      case 'Goalkeeper':
        groups.Arqueros.push(player);
        break;
      case 'Defence':
        groups.Defensores.push(player);
        break;
      case 'Midfield':
        groups.Mediocampistas.push(player);
        break;
      case 'Offence':
        groups.Delanteros.push(player);
        break;
      default:
        groups.Otros.push(player);
    }
  });

  return groups;
};

const formatDate = (value?: string) => {
  if (!value) return null;
  const date = new Date(value);
  return date.toLocaleDateString('es-AR', { day: '2-digit', month: 'long', year: 'numeric' });
};

export default function TeamDetail() {
  const { teamId } = useParams();
  const [activeTab, setActiveTab] = useState<TabKey>('PLANTEL');

  const { data: team, isLoading, error } = useApiData<Team>(
    ['team', teamId!],
    () => api.getTeamById(Number(teamId))
  );

  const squad = team?.squad ?? [];
  const groupedSquad = useMemo(() => groupPlayersByPosition(squad), [squad]);

  if (isLoading) return <SkeletonLoader variant="player" />;

  if (error || !team) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <div className="stadium-card p-6 text-center text-sm text-white/70">
          No pudimos cargar la información de esta selección.
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <section className="relative pt-20 pb-32 overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full opacity-20 pointer-events-none">
          {team.crest ? (
            <img src={team.crest} className="w-full h-full object-contain scale-125" alt={team.name} />
          ) : getFlagCode(team) ? (
            <span className={`fi fi-${getFlagCode(team)} w-full h-full block scale-[2] opacity-40`} />
          ) : null}
        </div>
        
        <div className="container mx-auto px-4 md:px-8 relative z-10">
          <div className="flex flex-col md:flex-row items-end gap-8 mb-12">
            <div className="w-32 h-32 lg:w-48 lg:h-48 bg-white/10 backdrop-blur-xl p-4 rounded-2xl border border-white/20 flex items-center justify-center">
              {team.crest ? (
                <img src={team.crest} className="w-full h-full object-contain" alt={team.name} />
              ) : getFlagCode(team) ? (
                <span className={`fi fi-${getFlagCode(team)} w-full h-16 rounded-sm`} />
              ) : (
                <div className="w-full h-full bg-white/10 rounded" />
              )}
            </div>
            <div className="flex-1">
              <div className="flex flex-wrap gap-3 mb-4">
                <span className="bg-fifa-red text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest flex items-center gap-2">
                  <Trophy size={12} /> Selección Nacional
                </span>
                {team.tla && (
                  <span className="bg-fifa-blue text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest flex items-center gap-2">
                    <TrendingUp size={12} /> {team.tla}
                  </span>
                )}
              </div>
              <h1 className="display-lg leading-none mb-4">{team.name.toUpperCase()}</h1>
              <p className="font-mono text-fifa-gold uppercase tracking-[0.3em] font-bold">
                DT: {team.coach?.name ?? 'Por confirmar'}
              </p>
            </div>
          </div>

          <div className="flex border-b border-white/10 mb-12 overflow-x-auto whitespace-nowrap">
            {(['PLANTEL', 'PARTIDOS', 'ESTADÍSTICAS', 'ACERCA DE'] as TabKey[]).map((tab) => (
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

          {activeTab === 'PLANTEL' && (
            <div className="space-y-10">
              {Object.entries(groupedSquad).map(([label, players]) => (
                players.length > 0 && (
                  <div key={label}>
                    <h3 className="label-caps text-white mb-6">{label}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {players.map((player) => (
                        <div key={player.id} className="stadium-card p-5 bg-white/5 border border-white/10">
                          <div className="flex items-center gap-4 mb-4">
                            <div className="w-12 h-12 rounded-xl bg-fifa-gold/10 flex items-center justify-center text-fifa-gold">
                              <User size={18} />
                            </div>
                            <div>
                              <p className="text-[10px] text-white/40 font-bold uppercase">{player.position}</p>
                              <h4 className="font-bold">{player.name}</h4>
                            </div>
                          </div>
                          <div className="flex items-center justify-between text-xs text-white/60">
                            <span>Nacimiento</span>
                            <span>{formatDate(player.dateOfBirth) ?? 'N/D'}</span>
                          </div>
                          <div className="flex items-center justify-between text-xs text-white/60 mt-2">
                            <span>Nacionalidad</span>
                            <span>{player.nationality ?? 'N/D'}</span>
                          </div>
                          {player.shirtNumber && (
                            <div className="mt-4 inline-flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full text-[10px] font-black uppercase">
                              #{player.shirtNumber}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )
              ))}
            </div>
          )}

          {activeTab === 'PARTIDOS' && (
            <div className="stadium-card p-8 text-sm text-white/60">
              Los partidos de la selección se mostrarán cuando el fixture esté confirmado por la API.
            </div>
          )}

          {activeTab === 'ESTADÍSTICAS' && (
            <div className="stadium-card p-8 text-sm text-white/60">
              Las estadísticas oficiales estarán disponibles cuando comience el torneo.
            </div>
          )}

          {activeTab === 'ACERCA DE' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <div className="stadium-card p-6 bg-white/5 border border-white/10">
                  <h3 className="label-caps text-white mb-4">Datos oficiales</h3>
                  <div className="space-y-3 text-sm text-white/70">
                    <div className="flex items-center justify-between">
                      <span>Fundación</span>
                      <span>{team.founded ?? 'N/D'}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Sede</span>
                      <span>{team.venue ?? 'N/D'}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Colores</span>
                      <span>{team.clubColors ?? 'N/D'}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Sitio web</span>
                      <span>{team.website ?? 'N/D'}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-fifa-gold/10 border border-fifa-gold/20 p-6 rounded-xl relative overflow-hidden group">
                  <Zap className="absolute -right-4 -bottom-4 w-24 h-24 text-fifa-gold opacity-10 group-hover:scale-110 transition-transform" />
                  <h4 className="label-caps text-fifa-gold mb-2 flex items-center gap-2">Selección</h4>
                  <p className="text-sm text-white/80 leading-relaxed font-medium">
                    Información oficial proporcionada por la API de FIFA.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
