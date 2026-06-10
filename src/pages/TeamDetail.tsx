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
import { SEO } from '../components/shared/SEO';
import { ErrorBoundary } from '../components/shared/ErrorBoundary';
import { GeminiPlayerBio } from '../components/teams/GeminiPlayerBio';
import { AdBanner } from '../components/shared/AdBanner';
import { proxiedImage } from '../lib/imageProxy';
import { COACHES } from '../data/coachData';
import { normalizePosition } from '../lib/playerUtils';
import { useSquadPhotos } from '../hooks/useSquadPhotos';

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
    const pos = normalizePosition(player.position);
    switch (pos) {
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
  const { teamId, teamSlug } = useParams();
  const rawId = teamSlug ?? teamId ?? '';
  const parsedId = Number(rawId.split('-')[0]);
  const [activeTab, setActiveTab] = useState<TabKey>('PLANTEL');
  const [openPlayerBio, setOpenPlayerBio] = useState<number | null>(null);
  const [failedImages, setFailedImages] = useState<Record<string | number, boolean>>({});

  const { data: team, isLoading, error } = useApiData<Team>(
    ['team', String(parsedId)],
    () => api.getTeamById(parsedId)
  );

  const squad = team?.squad ?? [];
  const needsFallback = Boolean(team && (!team.coach || squad.length === 0));

  const { data: fallbackTeamData } = useApiData<any>(
    ['fallback-team', team?.name ?? ''],
    () => api.getFallbackTeamByName(team?.name ?? ''),
    { enabled: needsFallback && Boolean(team?.name) }
  );
  const fallbackTeam = fallbackTeamData?.teams?.[0] ?? null;

  const { data: fallbackPlayersData } = useApiData<any>(
    ['fallback-players', String(fallbackTeam?.idTeam)],
    () => api.getFallbackPlayersByTeamId(fallbackTeam?.idTeam ?? ''),
    { enabled: needsFallback && Boolean(fallbackTeam?.idTeam) }
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

  const playerNames = useMemo(() => mergedSquad.map((p) => p.name), [mergedSquad]);
  const { photos: photoMap, isLoadingPhotos } = useSquadPhotos(playerNames, coachName, team?.name);

  const squadWithPhotos = useMemo(
    () =>
      mergedSquad.map((player) => ({
        ...player,
        photo: player.photo ?? photoMap[player.name] ?? undefined,
      })),
    [mergedSquad, photoMap]
  );

  const coachPhoto =
    team?.coach?.photo ??
    fallbackTeam?.strTeamManagerThumb ??
    fallbackTeam?.strCoachThumb ??
    photoMap[coachName] ??
    undefined;

  const groupedSquad = useMemo(() => groupPlayersByPosition(squadWithPhotos), [squadWithPhotos]);

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
              {/* AdSense Banner — before GeminiPlayerBio components */}
              <div className="w-full">
                <AdBanner slot="2222222222" format="horizontal" className="w-full" />
              </div>
              <div className="mb-8">
                <h3 className="label-caps text-white mb-6">Cuerpo técnico</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
                  <div className="stadium-card overflow-hidden bg-gradient-to-br from-fifa-gold/10 to-fifa-red/10 border-2 border-fifa-gold/30 relative group">
                    <div className="absolute inset-0 bg-gradient-to-br from-fifa-gold/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div className="w-full aspect-[4/5] overflow-hidden rounded-t-none bg-slate-950">
                      {coachPhoto && !failedImages['coach'] ? (
                        <img
                          src={proxiedImage(coachPhoto)}
                          alt={coachName}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          loading="lazy"
                          referrerPolicy="no-referrer"
                          onError={() => setFailedImages(prev => ({ ...prev, coach: true }))}
                        />
                      ) : isLoadingPhotos ? (
                        <div className="w-full h-full bg-white/10 animate-pulse" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-white/5">
                          <User size={40} className="text-fifa-gold" />
                        </div>
                      )}
                    </div>
                    <div className="px-5 py-6">
                      <p className="text-[10px] text-fifa-gold font-bold uppercase tracking-[0.25em] mb-2">Director técnico</p>
                      <h4 className="font-bold text-lg mb-3 text-white">{coachName}</h4>
                      <div className="space-y-2 text-xs text-white/60">
                        {coachBirth && (
                          <div className="flex justify-between">
                            <span>Nac.</span>
                            <span>{formatDate(coachBirth)}</span>
                          </div>
                        )}
                        {coachNationality && (
                          <div className="flex justify-between">
                            <span>Nacionalidad</span>
                            <span>{coachNationality}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {Object.entries(groupedSquad).map(([label, players]) => (
                players.length > 0 && (
                  <div key={label}>
                    <h3 className="label-caps text-white mb-6">{label}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                      {players.map((player) => (
                        <div
                          key={player.id}
                          className="stadium-card overflow-hidden bg-white/5 border border-white/10 relative cursor-pointer group"
                          onClick={() => setOpenPlayerBio(openPlayerBio === player.id ? null : player.id)}
                        >
                          <ErrorBoundary>
                            <GeminiPlayerBio playerName={player.name} isOpen={openPlayerBio === player.id} />
                          </ErrorBoundary>

                          <div className="w-full aspect-[4/5] overflow-hidden bg-slate-950">
                            {player.photo && !failedImages[player.id] ? (
                              <img
                                src={proxiedImage(player.photo)}
                                alt={player.name}
                                className="w-full h-full object-cover"
                                loading="lazy"
                                referrerPolicy="no-referrer"
                                onError={() => setFailedImages(prev => ({ ...prev, [player.id]: true }))}
                              />
                            ) : isLoadingPhotos ? (
                              <div className="w-full h-full bg-white/10 animate-pulse" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-white/5">
                                <User size={48} className="text-fifa-gold" />
                              </div>
                            )}
                          </div>

                          <div className="px-5 py-5">
                            <div className="flex items-center justify-between mb-3">
                              <span className="text-[10px] uppercase tracking-[0.25em] text-white/40">{player.position}</span>
                              {player.shirtNumber && (
                                <span className="text-[10px] font-black uppercase tracking-[0.25em] text-white/80">#{player.shirtNumber}</span>
                              )}
                            </div>
                            <h4 className="font-bold text-lg text-white mb-3">{player.name}</h4>
                            <div className="space-y-3 text-sm text-white/60">
                              <div className="flex justify-between">
                                <span>Nac.</span>
                                <span>{formatDate(player.dateOfBirth) ?? 'N/D'}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Nacionalidad</span>
                                <span>{player.nationality ?? 'N/D'}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              ))}
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
