import { cn } from '../../lib/utils';

interface MatchNodeProps {
  teams: string[];
  scores: (number | null)[];
  active?: boolean;
  isLive?: boolean;
}

const flagByTeamName: Record<string, string> = {
  'MÃ©xico': 'mx',
  'Mexico': 'mx',
  'Argentina': 'ar',
  'Francia': 'fr',
  'P. Bajos': 'nl',
  'PaÃ­ses Bajos': 'nl',
  'USA': 'us',
  'CanadÃ¡': 'ca',
  'Canada': 'ca',
};

const getFlagCode = (teamName: string) => flagByTeamName[teamName] ?? null;

export const KnockoutBracket = () => {
  return (
    <div className="relative min-w-[1200px] py-20 px-10">
      <div className="text-center mb-16">
        <span className="label-caps">Camino a la Final</span>
        <h2 className="display-md text-fifa-blue dark:text-white">Fase Eliminatoria</h2>
        <div className="w-20 h-1.5 bg-fifa-red mx-auto mt-4 rounded-full" />
      </div>

      <div className="grid grid-cols-4 gap-20 items-center">
        {/* Octavos */}
        <div className="space-y-12">
          <MatchNode teams={['México', 'P. Bajos']} scores={[2, 1]} active />
          <MatchNode teams={['Argentina', 'Francia']} scores={[3, 2]} active />
        </div>

        {/* Cuartos */}
        <div className="space-y-24 relative">
          <MatchNode teams={['México', 'Argentina']} scores={[null, null]} isLive />
          <svg className="absolute -left-20 top-1/2 -translate-y-1/2 w-20 h-full pointer-events-none opacity-20">
            <path d="M 0 50 L 40 50 L 40 150 L 80 150" fill="none" stroke="currentColor" strokeWidth="2" className="text-fifa-blue" />
          </svg>
        </div>

        {/* Semis */}
        <div>
          <MatchNode teams={['TBD', 'TBD']} scores={[null, null]} />
        </div>

        {/* Final */}
        <div className="flex flex-col items-center">
          <div className="w-48 h-48 rounded-full border-4 border-fifa-gold flex flex-col items-center justify-center bg-white dark:bg-slate-800 shadow-2xl relative">
            <div className="absolute inset-0 bg-fifa-gold/5 animate-pulse rounded-full" />
            <span className="text-4xl mb-2">🏆</span>
            <span className="font-headline font-black text-xl uppercase italic">Final</span>
            <span className="text-[10px] font-mono font-bold mt-1 text-slate-500">19 JUL 2026</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const MatchNode = ({ teams, scores, active, isLive }: MatchNodeProps) => (
  <div className={cn(
    "stadium-card p-4 w-64 border-l-4 transition-all relative",
    active ? "border-fifa-blue" : "border-slate-200 dark:border-slate-700 opacity-60",
    isLive && "border-fifa-red ring-2 ring-fifa-red/20 scale-105"
  )}>
    {teams.map((team, i) => (
      <div key={team} className="flex justify-between items-center py-2 first:border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-3">
          {getFlagCode(team) ? (
            <span className={`fi fi-${getFlagCode(team)} w-4 h-3 rounded-sm`} />
          ) : (
            <div className="w-4 h-3 bg-slate-200 rounded-sm" />
          )}
          <span className="font-bold text-xs uppercase">{team}</span>
        </div>
        <span className="font-mono font-bold text-sm">{scores[i] ?? '-'}</span>
      </div>
    ))}
    {isLive && (
      <div className="absolute -top-3 right-4 bg-fifa-red text-white text-[8px] font-bold px-2 py-1 rounded-sm flex items-center gap-1 animate-bounce">
        <span className="w-1 h-1 bg-white rounded-full" /> PARTIDAZO
      </div>
    )}
  </div>
);
