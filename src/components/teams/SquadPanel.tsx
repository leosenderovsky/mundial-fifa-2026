import { useState } from 'react';
import type { Player } from '../../types/api';
import { normalizePosition } from '../../lib/playerUtils';

const POS_LABEL: Record<string, string> = {
  Goalkeeper: 'POR',
  Defence:    'DEF',
  Midfield:   'MED',
  Offence:    'DEL',
};

const FILTERS = [
  { key: 'ALL', label: 'TODOS' },
  { key: 'POR', label: 'POR' },
  { key: 'DEF', label: 'DEF' },
  { key: 'MED', label: 'MED' },
  { key: 'DEL', label: 'DEL' },
];

// Primer jugador por posición = "titular" (sin asterisco de la API, usamos orden)
function isStarter(player: Player, index: number, groupSize: number): boolean {
  // Consideramos titular si está entre los primeros de su grupo
  // (la API suele listar titulares primero en algunas selecciones)
  return index < Math.ceil(groupSize * 0.45);
}

interface SquadPanelProps {
  squad: Player[];
  coachName: string;
  coachBirth?: string;
  coachNationality?: string;
  activeFilter: string;
  onFilterChange: (pos: string) => void;
}

export function SquadPanel({
  squad,
  coachName,
  coachBirth,
  coachNationality,
  activeFilter,
  onFilterChange,
}: SquadPanelProps) {
  // Agrupar por posición para saber el tamaño de cada grupo (para isStarter)
  const byPos: Record<string, Player[]> = { POR: [], DEF: [], MED: [], DEL: [] };
  for (const p of squad) {
    const pos = POS_LABEL[normalizePosition(p.position)] ?? 'MED';
    byPos[pos]?.push(p);
  }

  const filteredSquad =
    activeFilter === 'ALL'
      ? squad
      : squad.filter(
          (p) => (POS_LABEL[normalizePosition(p.position)] ?? 'MED') === activeFilter
        );

  const formatDate = (value?: string) => {
    if (!value) return null;
    return new Date(value).toLocaleDateString('es-AR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <div className="flex flex-col gap-5 h-full">

      {/* Título + badge filtro activo */}
      <div className="flex items-end justify-between">
        <h2 className="font-headline font-black text-3xl text-white uppercase tracking-tighter">
          Plantel
        </h2>
        <span className="text-[10px] font-black bg-white/10 px-3 py-1 rounded-full text-white/60 uppercase tracking-widest">
          {activeFilter === 'ALL' ? 'TODOS' : activeFilter}
        </span>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            onClick={() => onFilterChange(f.key)}
            className={[
              'whitespace-nowrap px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all',
              activeFilter === f.key
                ? 'bg-[#0033A0] text-white shadow-lg'
                : 'bg-white/5 text-white/50 hover:bg-white/10 hover:text-white',
            ].join(' ')}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Coach card — siempre visible */}
      <div className="flex items-center gap-4 px-4 py-3 rounded-xl bg-[#F5A800]/10 border border-[#F5A800]/20">
        <div className="w-10 h-10 rounded-full flex items-center justify-center font-mono font-bold text-sm bg-[#F5A800] text-slate-900 flex-shrink-0">
          DT
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-headline font-bold text-sm text-white uppercase tracking-tight truncate">
            {coachName}
          </p>
          <p className="text-[10px] text-white/40 uppercase font-label">
            {coachNationality ?? 'Director Técnico'}
            {coachBirth && ` · ${formatDate(coachBirth)}`}
          </p>
        </div>
        <span className="material-symbols-outlined text-[#F5A800] text-base" style={{ fontVariationSettings: "'FILL' 1" }}>
          sports
        </span>
      </div>

      {/* Lista de jugadores */}
      <div className="space-y-2 overflow-y-auto flex-1" style={{ maxHeight: '520px' }}>
        {filteredSquad.length === 0 && (
          <p className="text-white/30 text-sm py-8 text-center">Sin jugadores para este filtro.</p>
        )}
        {filteredSquad.map((player, idx) => {
          const posKey = POS_LABEL[normalizePosition(player.position)] ?? 'MED';
          const groupSize = byPos[posKey]?.length ?? 1;
          const posIdxInGroup = byPos[posKey]?.indexOf(player) ?? idx;
          const starter = isStarter(player, posIdxInGroup, groupSize);

          return (
            <div
              key={player.id}
              className={[
                'group flex items-center justify-between px-4 py-3 rounded-xl border transition-all duration-200',
                starter
                  ? 'bg-white/8 border-white/10 shadow-sm'
                  : 'bg-white/3 border-transparent hover:bg-white/8 hover:border-white/10',
              ].join(' ')}
            >
              <div className="flex items-center gap-3">
                {/* Círculo con número */}
                <div
                  className={[
                    'w-10 h-10 rounded-full flex items-center justify-center font-mono font-bold text-xs flex-shrink-0',
                    starter
                      ? 'bg-[#0033A0] text-white'
                      : 'bg-white/10 text-white/60',
                  ].join(' ')}
                >
                  {player.shirtNumber ?? posKey.slice(0, 1)}
                </div>
                <div>
                  <p className="font-headline font-bold text-sm text-white uppercase tracking-tight leading-none">
                    {player.name}
                  </p>
                  <p className="text-[10px] text-white/40 font-label uppercase mt-0.5">
                    {player.nationality ?? ''}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[9px] font-black py-0.5 px-2 rounded-full border border-white/10 text-white/40 uppercase tracking-widest">
                  {posKey}
                </span>
                {starter && (
                  <span
                    className="material-symbols-outlined text-[#0033A0] text-base"
                    style={{ fontVariationSettings: "'FILL' 1", fontSize: '16px' }}
                  >
                    star
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
