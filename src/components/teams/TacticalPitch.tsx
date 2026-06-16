import { useMemo } from "react";
import type { Player } from "../../types/api";
import { normalizePosition } from "../../lib/playerUtils";

// ── Mapeo posición → abreviación en español ───────────────────────────────
const POS_LABEL: Record<string, string> = {
  Goalkeeper: "POR",
  Defence: "DEF",
  Midfield: "MED",
  Offence: "DEL",
};

// Colores de nodo por posición (sobre fondo de cancha oscuro)
const NODE_STYLE: Record<string, string> = {
  POR: "bg-[#F5A800] text-slate-900 border-[#0033A0]", // gold — arquero
  DEF: "bg-white text-[#0033A0] border-[#0033A0]", // blanco — defensa
  MED: "bg-white text-[#0033A0] border-[#0033A0]", // blanco — medio
  DEL: "bg-[#EB0000] text-white border-[#0033A0]", // rojo — delantero
};

interface PitchPlayer {
  id: number;
  name: string;
  shirtNumber?: number;
  posLabel: string;
  x: number; // 0–100 (%)
  y: number; // 0–100 (%) — 0 = arriba del campo, 100 = abajo (arco propio)
}

/**
 * Distribuye los jugadores en el campo según su posición.
 * Calcula X e Y automáticamente basándose en cuántos hay en cada línea.
 */
function layoutPlayers(squad: Player[]): PitchPlayer[] {
  const groups: Record<string, Player[]> = {
    POR: [],
    DEF: [],
    MED: [],
    DEL: [],
  };

  for (const p of squad) {
    const pos = POS_LABEL[normalizePosition(p.position)] ?? "MED";
    groups[pos]?.push(p);
  }

  const result: PitchPlayer[] = [];

  // Posiciones Y fijas por línea (de ataque arriba a defensa abajo)
  const yByLine: Record<string, number> = {
    DEL: 12,
    MED: 40,
    DEF: 68,
    POR: 88,
  };

  for (const [pos, players] of Object.entries(groups)) {
    const count = players.length;
    if (!count) continue;
    players.forEach((p, i) => {
      // Distribuir equitativamente en X: margen 10%–90%
      const x = count === 1 ? 50 : 10 + (80 / (count - 1)) * i;
      result.push({
        id: p.id,
        name: p.name.split(" ").slice(-1)[0] ?? p.name, // apellido
        shirtNumber: p.shirtNumber,
        posLabel: pos,
        x,
        y: yByLine[pos] ?? 50,
      });
    });
  }

  return result;
}

interface TacticalPitchProps {
  squad: Player[];
  activeFilter: string;
  onFilterChange: (pos: string) => void;
}

export function TacticalPitch({
  squad,
  activeFilter,
  onFilterChange,
}: TacticalPitchProps) {
  const nodes = useMemo(() => layoutPlayers(squad), [squad]);

  return (
    <div
      className="relative bg-[#0a3d1f] rounded-[1.5rem] overflow-hidden shadow-2xl"
      style={{ aspectRatio: "3 / 4" }}
    >
      {/* Grid de cancha */}
      <div className="absolute inset-0 pitch-grid opacity-60" />

      {/* Líneas de cancha SVG */}
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 100 133"
        preserveAspectRatio="none"
      >
        {/* Borde de cancha */}
        <rect
          x="4"
          y="3"
          width="92"
          height="127"
          rx="1"
          fill="none"
          stroke="rgba(255,255,255,0.18)"
          strokeWidth="0.6"
        />
        {/* Línea de medio */}
        <line
          x1="4"
          y1="66.5"
          x2="96"
          y2="66.5"
          stroke="rgba(255,255,255,0.18)"
          strokeWidth="0.5"
        />
        {/* Círculo central */}
        <circle
          cx="50"
          cy="66.5"
          r="12"
          fill="none"
          stroke="rgba(255,255,255,0.18)"
          strokeWidth="0.5"
        />
        <circle cx="50" cy="66.5" r="0.8" fill="rgba(255,255,255,0.4)" />
        {/* Área grande superior */}
        <rect
          x="22"
          y="3"
          width="56"
          height="16"
          fill="none"
          stroke="rgba(255,255,255,0.18)"
          strokeWidth="0.5"
        />
        {/* Área chica superior */}
        <rect
          x="36"
          y="3"
          width="28"
          height="6"
          fill="none"
          stroke="rgba(255,255,255,0.18)"
          strokeWidth="0.5"
        />
        {/* Área grande inferior */}
        <rect
          x="22"
          y="114"
          width="56"
          height="16"
          fill="none"
          stroke="rgba(255,255,255,0.18)"
          strokeWidth="0.5"
        />
        {/* Área chica inferior */}
        <rect
          x="36"
          y="124"
          width="28"
          height="6"
          fill="none"
          stroke="rgba(255,255,255,0.18)"
          strokeWidth="0.5"
        />
      </svg>

      {/* Nodos de jugadores */}
      {nodes.map((node) => {
        const isActive =
          activeFilter === "ALL" || activeFilter === node.posLabel;
        const style = NODE_STYLE[node.posLabel] ?? NODE_STYLE.MED;
        return (
          <button
            key={node.id}
            onClick={() =>
              onFilterChange(
                activeFilter === node.posLabel ? "ALL" : node.posLabel,
              )
            }
            className="absolute -translate-x-1/2 -translate-y-1/2 group flex flex-col items-center"
            style={{ left: `${node.x}%`, top: `${node.y}%` }}
          >
            <div
              className={[
                "w-9 h-9 rounded-full flex items-center justify-center font-mono font-bold text-xs border-2 shadow-lg transition-all duration-200",
                style,
                isActive
                  ? "opacity-100 scale-100 group-hover:scale-110"
                  : "opacity-30 scale-90",
              ].join(" ")}
            >
              {node.shirtNumber ?? "·"}
            </div>
            <span
              className={[
                "mt-1 text-[9px] font-bold uppercase text-white whitespace-nowrap tracking-tight transition-opacity",
                isActive ? "opacity-80" : "opacity-20",
              ].join(" ")}
            >
              {node.name}
            </span>
          </button>
        );
      })}
    </div>
  );
}
