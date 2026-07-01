// src/components/home/HomeKnockoutSection.tsx
import { Link } from 'react-router-dom';
import { GitMerge, Zap, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useApiData } from '../../hooks/useApiData';
import { api } from '../../lib/api';
import { getFlagCode } from '../../lib/flags';
import { proxiedImage } from '../../lib/imageProxy';
import { cn } from '../../lib/utils';
import { STATIC_KNOCKOUT_MATCHES } from '../../data/fixtureData';
import {
  normalizeStage,
  STAGE_LABELS,
  STAGE_PROGRESSION,
} from '../../lib/knockoutUtils';
import type { Match } from '../../types/api';

// ── Helpers ──────────────────────────────────────────────────────────────────

const formatKickoff = (utcDate: string) =>
  new Date(utcDate).toLocaleDateString('es-AR', {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  }).toUpperCase();

const TeamChip = ({ team }: { team: Match['homeTeam'] }) => {
  const flag = getFlagCode(team);
  return (
    <div className="flex items-center gap-2 min-w-0">
      {flag ? (
        <span className={`fi fi-${flag} w-6 h-4 rounded-sm shrink-0`} title={team.name} />
      ) : team.crest ? (
        <img
          src={proxiedImage(team.crest)}
          alt={team.name}
          className="w-6 h-6 object-contain shrink-0"
        />
      ) : (
        <div className="w-6 h-4 bg-slate-200 dark:bg-slate-700 rounded-sm shrink-0" />
      )}
      <span className={cn(
        'font-bold text-sm truncate',
        !flag && !team.crest && 'text-slate-400 dark:text-slate-500 italic text-xs'
      )}>
        {team.shortName ?? team.name}
      </span>
    </div>
  );
};

// ── Tarjeta de partido individual ────────────────────────────────────────────

const KnockoutMatchCard = ({ match }: { match: Match }) => {
  const isFinished  = match.status === 'FINISHED';
  const isLive      = match.status === 'IN_PLAY' || match.status === 'PAUSED';
  const isScheduled = match.status === 'SCHEDULED' || match.status === 'TIMED';

  return (
    <div className={cn(
      'rounded-xl border p-4 flex flex-col gap-3 transition-all',
      isLive
        ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-700'
        : isFinished
          ? 'bg-slate-50 dark:bg-slate-800/60 border-slate-100 dark:border-slate-700'
          : 'bg-white dark:bg-slate-800/40 border-slate-100 dark:border-slate-700/50'
    )}>
      {/* Equipo local */}
      <div className="flex items-center justify-between gap-2">
        <TeamChip team={match.homeTeam} />
        {(isFinished || isLive) && (
          <span className={cn(
            'font-mono font-black text-lg shrink-0',
            isLive ? 'text-fifa-red animate-pulse' : 'text-slate-800 dark:text-white'
          )}>
            {match.score.fullTime.home ?? '-'}
          </span>
        )}
      </div>

      {/* Separador central: marcador o fecha */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-px bg-slate-100 dark:bg-slate-700" />
        {isLive ? (
          <span className="text-[10px] font-black text-fifa-red uppercase tracking-widest flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-fifa-red animate-ping" />
            En vivo
          </span>
        ) : isFinished ? (
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Final</span>
        ) : isScheduled ? (
          <span className="text-[10px] font-mono font-bold text-slate-500 dark:text-slate-400 text-center">
            {formatKickoff(match.utcDate)}
          </span>
        ) : (
          <span className="text-[10px] text-slate-300">vs</span>
        )}
        <div className="flex-1 h-px bg-slate-100 dark:bg-slate-700" />
      </div>

      {/* Equipo visitante */}
      <div className="flex items-center justify-between gap-2">
        <TeamChip team={match.awayTeam} />
        {(isFinished || isLive) && (
          <span className={cn(
            'font-mono font-black text-lg shrink-0',
            isLive ? 'text-fifa-red animate-pulse' : 'text-slate-800 dark:text-white'
          )}>
            {match.score.fullTime.away ?? '-'}
          </span>
        )}
      </div>
    </div>
  );
};

// ── Sección de una ronda eliminatoria ────────────────────────────────────────

const KnockoutRoundSection = ({
  stage,
  matches,
  isCurrentStage,
}: {
  stage: string;
  matches: Match[];
  isCurrentStage: boolean;
}) => {
  const label = STAGE_LABELS[stage] ?? stage;
  const sorted = [...matches].sort((a, b) => a.utcDate.localeCompare(b.utcDate));

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
    >
      {/* Header de la ronda */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <span className={cn(
            'w-2 h-2 rounded-full shrink-0',
            isCurrentStage ? 'bg-fifa-red animate-pulse' : 'bg-slate-300 dark:bg-slate-600'
          )} />
          <h3 className="headline-md text-fifa-blue dark:text-white uppercase text-xl">
            {label}
          </h3>
          {isCurrentStage && (
            <span className="bg-fifa-red text-white text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest">
              En curso
            </span>
          )}
        </div>
        <Link
          to="/fixture"
          className="text-[11px] font-bold uppercase tracking-widest text-slate-400 hover:text-fifa-blue dark:hover:text-fifa-gold transition-colors flex items-center gap-1"
        >
          Ver todo <ArrowRight size={12} />
        </Link>
      </div>

      {/* Grid de partidos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {sorted.map((match) => (
          <KnockoutMatchCard key={match.id} match={match} />
        ))}
      </div>
    </motion.div>
  );
};

// ── Componente principal ─────────────────────────────────────────────────────

export const HomeKnockoutSection = () => {
  // Usa la misma query key que FixtureGroups.tsx → TanStack Query deduplica
  const { data: matchesData, isLoading } = useApiData<{ matches: Match[] }>(
    ['wc-matches-all'],
    () => api.getAllMatches(),
    {
      staleTime: 5 * 60_000,
      refetchInterval: 120_000, // polling cada 2 min (respeta el rate limit de 10 req/min)
    }
  );

  const apiMatches = matchesData?.matches ?? [];
  const hasApiMatches = apiMatches.length > 0;

  // Partidos de fase eliminatoria: API first, luego fallback estático
  const rawKnockout = hasApiMatches
    ? apiMatches.filter((m) => m.stage !== 'GROUP_STAGE')
    : [];

  // Si la API no tiene datos de knockout, usar el fallback estático SOLO si hay
  // partidos que ya deberían haberse jugado (fecha pasada)
  const now = Date.now();
  const staticKnockoutStarted = STATIC_KNOCKOUT_MATCHES.filter(
    (m) => new Date(m.utcDate).getTime() <= now
  );
  const knockout = rawKnockout.length > 0 ? rawKnockout : staticKnockoutStarted;

  // Normalizar stage names y agrupar
  const grouped = knockout.reduce<Record<string, Match[]>>((acc, match) => {
    const stage = normalizeStage(match.stage);
    acc[stage] = acc[stage] ? [...acc[stage], match] : [match];
    return acc;
  }, {});

  // Solo mostrar rondas que tienen al menos un partido FINISHED, IN_PLAY o PAUSED
  // (las rondas futuras con matches SCHEDULED se omiten para no adelantar información)
  const activeStages = STAGE_PROGRESSION.filter((stage) =>
    (grouped[stage] ?? []).some(
      (m) => m.status === 'FINISHED' || m.status === 'IN_PLAY' || m.status === 'PAUSED'
    )
  );

  // Si no hay ninguna ronda activa, no renderizar nada
  if (isLoading || activeStages.length === 0) return null;

  // La fase "actual" es la más avanzada con al menos un partido en juego o recién terminada
  const currentStage = [...activeStages].reverse()[0];

  // Mostrar en orden inverso: la fase más avanzada primero
  const displayStages = [...activeStages].reverse();

  return (
    <section>
      {/* Encabezado de la sección */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <span className="label-caps mb-2 block">Copa Mundial FIFA 2026</span>
          <h2 className="headline-lg text-fifa-blue dark:text-white uppercase flex items-center gap-3">
            <GitMerge size={24} className="text-fifa-red" />
            Fase Eliminatoria
            <Zap size={18} className="text-fifa-gold fill-fifa-gold" />
          </h2>
        </div>
        <Link
          to="/fixture"
          className="hidden md:flex items-center gap-2 px-6 py-3 border-2 border-slate-200 dark:border-slate-700 rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
        >
          Ver cuadro completo <ArrowRight size={14} />
        </Link>
      </div>

      {/* Rondas apiladas (más reciente arriba, más antigua abajo) */}
      <div className="space-y-12">
        {displayStages.map((stage) => (
          <KnockoutRoundSection
            key={stage}
            stage={stage}
            matches={grouped[stage]}
            isCurrentStage={stage === currentStage}
          />
        ))}
      </div>

      {/* Link mobile */}
      <div className="mt-8 flex justify-center md:hidden">
        <Link
          to="/fixture"
          className="flex items-center gap-2 px-6 py-3 border-2 border-slate-200 dark:border-slate-700 rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
        >
          Ver cuadro completo <ArrowRight size={14} />
        </Link>
      </div>
    </section>
  );
};
