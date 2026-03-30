import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

interface PlayerPos {
  id: number;
  name: string;
  number: number;
  pos: { x: number; y: number };
  isCaptain?: boolean;
}

interface Props {
  formation: string;
  players: PlayerPos[];
}

export const TacticalPitch = ({ formation, players }: Props) => {
  return (
    <div className="relative w-full aspect-[3/4] bg-[#1a2e1a] rounded-xl overflow-hidden border-4 border-white/10 shadow-2xl">
      {/* SVG Grass Pattern & Lines */}
      <svg className="absolute inset-0 w-full h-full opacity-20" viewBox="0 0 300 400">
        <rect width="300" height="400" fill="none" stroke="white" strokeWidth="2" />
        <line x1="0" y1="200" x2="300" y2="200" stroke="white" strokeWidth="2" />
        <circle cx="150" cy="200" r="40" fill="none" stroke="white" strokeWidth="2" />
        <rect x="75" y="0" width="150" height="60" fill="none" stroke="white" strokeWidth="2" />
        <rect x="75" y="340" width="150" height="60" fill="none" stroke="white" strokeWidth="2" />
      </svg>

      <div className="absolute top-4 right-4 bg-black/40 backdrop-blur px-3 py-1 rounded text-[10px] font-mono text-white">
        FORMACIÓN: {formation}
      </div>

      {/* Players Rendering */}
      {players.map((player) => (
        <motion.div
          key={player.id}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-1 group cursor-pointer"
          style={{ left: `${player.pos.x}%`, top: `${player.pos.y}%` }}
        >
          <div className={cn(
            "w-10 h-10 lg:w-12 lg:h-12 rounded-full border-2 flex items-center justify-center relative transition-transform group-hover:scale-110",
            player.isCaptain 
              ? "border-fifa-gold bg-fifa-blue shadow-[0_0_15px_rgba(245,168,0,0.5)]" 
              : "border-white bg-slate-800"
          )}>
            <span className="text-white font-mono font-bold text-xs">{player.number}</span>
            {player.isCaptain && (
              <span className="absolute -top-1 -right-1 bg-fifa-gold text-[8px] font-black px-1 rounded-sm text-black">C</span>
            )}
          </div>
          <span className="bg-black/80 text-white text-[8px] lg:text-[10px] font-bold px-2 py-0.5 rounded uppercase whitespace-nowrap">
            {player.name}
          </span>
        </motion.div>
      ))}
    </div>
  );
};