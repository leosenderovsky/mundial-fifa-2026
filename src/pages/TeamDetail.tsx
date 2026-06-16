import { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Trophy, TrendingUp, Zap } from 'lucide-react';
import { useApiData } from '../hooks/useApiData';
import { api } from '../lib/api';
import { SkeletonLoader } from '../components/shared/SkeletonLoader';
import { cn } from '../lib/utils';
import { getFlagCode } from '../lib/flags';
import type { Player, Team } from '../types/api';
import { SEO } from '../components/shared/SEO';
import { AdBanner } from '../components/shared/AdBanner';
import { proxiedImage } from '../lib/imageProxy';
import { COACHES } from '../data/coachData';
import { normalizePosition } from '../lib/playerUtils';
import { TacticalPitch } from '../components/teams/TacticalPitch';
import { SquadPanel } from '../components/teams/SquadPanel';

type TabKey = 'PLANTEL' | 'PARTIDOS' | 'ESTADÍSTICAS' | 'ACERCA DE';

const formatDate = (value?: string) => {
  if (!value) return null;
  const date = new Date(value);
  return date.toLocaleDateString('es-AR', { day: '2-digit', month: 'long', year: 'numeric' });
};

export default function TeamDetail() {
  const { teamId, teamSlug } = useParams();
  const rawId = teamSlug ?? teamId ?? '';
  const parsedId = Number(rawId.split('-')[0]);
  const [activeTab, setActiveTab] = useState<TabKey>('PLANTEL');
  const [pitchFilter, setPitchFilter] = useState<string>('ALL');

  const { data: team, isLoading, error } = useApiData<Team>(
    ['team', String(parsedId)],
    () => api.getTeamById(parsedId)
  );

  const squad = team?.squad ?? [];
  const needsFallback = Boolean(team && (!team.coach || squad.length === 0));

  const teamSearchName = team?.name ?? '';
  const teamSearchAlt = team?.shortName ?? team?.tla ?? '';

  const { data: fallbackTeamData } = useApiData<any>(
    ['fallback-team', teamSearchName],
    async () => {
      // Intento 1: nombre completo
      const r1 = await api.getFallbackTeamByName(teamSearchName);
      if (r1?.teams?.length) return r1;
      // Intento 2: nombre corto / TLA
      if (teamSearchAlt) return api.getFallbackTeamByName(teamSearchAlt);
      return r1;
    },
    { enabled: Boolean(team?.name), staleTime: 1000 * 60 * 60 * 24 }
  );
  const fallbackTeam = fallbackTeamData?.teams?.[0] ?? null;

  const { data: fallbackPlayersData } = useApiData<any>(
    ['fallback-players', String(fallbackTeam?.idTeam)],
    () => api.getFallbackPlayersByTeamId(fallbackTeam?.idTeam ?? ''),
    { enabled: Boolean(fallbackTeam?.idTeam), staleTime: 1000 * 60 * 60 * 24 }
  );
  const fallbackPlayers = fallbackPlayersData?.player ?? [];

  const mergedSquad: Player[] = squad.length > 0
    ? squad
    : fallbackPlayers.map((player: any, index: number) => ({
        id: Number(player.idPlayer ?? index),
        name: player.strPlayer ?? 'Jugador',
        position: normalizePosition(player.strPosition ?? 'N/D'),
        dateOfBirth: player.dateBorn ?? '',
        nationality: player.strNationality ?? '',
        shirtNumber: player.strNumber ? Number(player.strNumber) : undefined,
        photo: player.strThumb || player.strCutout || undefined,
      }));

  const coachName = team?.coach?.name ?? fallbackTeam?.strManager ?? COACHES[team?.name ?? ''] ?? 'Por confirmar';
  const coachBirth = team?.coach?.dateOfBirth;
  const coachNationality = team?.coach?.nationality;

  const { data: matchesData } = useApiData<{ matches: any[] }>(
    ['team-matches', String(parsedId)],
    () => api.getMatches({ dateFrom: '2026-06-01', dateTo: '2026-07-31' }),
    { staleTime: 1000 * 60 * 10 }
  );
  const teamMatches = (matchesData?.matches ?? []).filter(
    (match: any) => match.homeTeam?.id === parsedId || match.awayTeam?.id === parsedId
  );

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
      <SEO
        title={`${team.name} | Selecciones`}
        description={`Información oficial, plantel y datos de ${team.name} en el Mundial 2026.`}
        keywords={`${team.name}, selección, mundial 2026, fifa`}
      />
      <section className="relative pt-20 pb-32 overflow-hidden">
        <div className="container mx-auto px-4 md:px-8 relative z-10">
          <div className="flex flex-col md:flex-row items-end gap-8 mb-12">
            <div className="w-32 h-32 lg:w-48 lg:h-48 bg-white/10 backdrop-blur-xl p-4 rounded-2xl border border-white/20 flex items-center justify-center">
              {team.crest ? (
                <img src={proxiedImage(team.crest)} className="w-full h-full object-contain" alt={team.name} />
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
                DT: {coachName}
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

              {/* AdSense Banner */}
              <div className="w-full">
                <AdBanner slot="2222222222" format="horizontal" className="w-full" />
              </div>

              {/* ── Layout principal: Cancha + Panel ───────────────────────────── */}
              <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start">

                {/* Cancha táctica — sticky en desktop */}
                <div className="w-full lg:w-[45%] lg:sticky lg:top-28">
                  <TacticalPitch
                    squad={mergedSquad}
                    activeFilter={pitchFilter}
                    onFilterChange={setPitchFilter}
                  />
                  <p className="mt-4 text-xs text-white/30 italic flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-base" style={{ fontSize: '14px' }}>info</span>
                    Tocá una posición en la cancha para filtrar el plantel
                  </p>
                </div>

                {/* Panel de plantel */}
                <div className="flex-1 min-w-0">
                  <SquadPanel
                    squad={mergedSquad}
                    coachName={coachName}
                    coachBirth={coachBirth}
                    coachNationality={coachNationality}
                    activeFilter={pitchFilter}
                    onFilterChange={setPitchFilter}
                  />
                </div>
              </div>

              {/* ── Franja de estadísticas del equipo ────────────────────────── */}
              <TeamStatsStrip teamId={parsedId} teamName={team.name} />
            </div>
          )}

          {activeTab === 'PARTIDOS' && (
            <div className="space-y-4">
              {teamMatches.length === 0 ? (
                <div className="stadium-card p-8 text-sm text-white/60">
                  No hay partidos disponibles para esta selección en el fixture actual.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {teamMatches.map((match: any) => {
                    const isHome = match.homeTeam.id === parsedId;
                    const opponent = isHome ? match.awayTeam : match.homeTeam;
                    const dateLabel = new Date(match.utcDate).toLocaleDateString('es-AR', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                    });

                    return (
                      <div key={match.id} className="stadium-card p-6 bg-white/5 border border-white/10">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] uppercase tracking-widest text-white/40">
                            {match.group ?? match.stage}
                          </span>
                          <span className="text-[10px] uppercase tracking-widest text-white/40">{dateLabel}</span>
                        </div>
                        <div className="mt-4 flex items-center gap-4">
                          {getFlagCode(opponent) ? (
                            <span
                              className={`fi fi-${getFlagCode(opponent)} w-10 h-7 rounded-sm`}
                              title={opponent.name}
                              aria-label={opponent.name}
                            />
                          ) : opponent.crest ? (
                            <img src={proxiedImage(opponent.crest)} alt={opponent.name} className="w-10 h-10 object-contain" />
                          ) : (
                            <div className="w-10 h-7 bg-white/10 rounded-sm" />
                          )}
                          <div>
                            <p className="text-xs text-white/40 uppercase tracking-widest">
                              {isHome ? 'Local' : 'Visitante'}
                            </p>
                            <h4 className="font-bold">{opponent.name}</h4>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
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
                    Información oficial proporcionada por la API y fuentes complementarias.
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

function TeamStatsStrip({ teamId, teamName }: { teamId: number; teamName: string }) {
  const { data: standingsData } = useApiData<{ standings: any[] }>(
    ['standings'],
    () => api.getStandings(),
    { staleTime: 5 * 60_000 }
  );

  // Buscar el equipo en la tabla de posiciones
  let teamEntry: any = null;
  for (const group of standingsData?.standings ?? []) {
    const found = group.table?.find((e: any) => e.team?.id === teamId);
    if (found) { teamEntry = found; break; }
  }

  // Si no hay datos de standings, no mostrar la franja
  if (!teamEntry) return null;

  const stats = [
    { label: 'Puntos',     value: teamEntry.points       ?? 0 },
    { label: 'Goles',      value: teamEntry.goalsFor     ?? 0 },
    { label: 'Victorias',  value: teamEntry.won          ?? 0 },
  ];

  return (
    <div className="bg-[#0033A0] rounded-2xl overflow-hidden">
      <div className="grid grid-cols-3 divide-x divide-white/10">
        {stats.map((s) => (
          <div key={s.label} className="px-8 py-10">
            <p className="font-label text-[10px] tracking-widest text-white/50 uppercase mb-3">
              {s.label}
            </p>
            <p className="text-6xl font-mono font-bold text-white leading-none">
              {s.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
