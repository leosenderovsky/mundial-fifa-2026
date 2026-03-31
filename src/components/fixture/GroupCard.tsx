import { cn } from '../../lib/utils';
import type { Match, StandingEntry } from '../../types/api';
import { getFlagCode } from '../../lib/flags';

interface GroupCardProps {
  groupName: string;
  entries: StandingEntry[];
  nextMatch?: Match | null;
}

const formatGroupLabel = (group: string) =>
  group.replace('GROUP_', 'Grupo ');

const formatKickoff = (utcDate?: string) => {
  if (!utcDate) return { time: '--:--', date: '-- ---' };
  const date = new Date(utcDate);
  const time = date.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' });
  const day = date.toLocaleDateString('es-AR', { day: '2-digit', month: 'short' }).toUpperCase();
  return { time, date: day };
};

export const GroupCard = ({ groupName, entries, nextMatch }: GroupCardProps) => {
  const kickoff = formatKickoff(nextMatch?.utcDate);

  return (
    <div className="stadium-card flex flex-col h-full border border-transparent hover:border-fifa-blue/20 transition-all">
      <div className="bg-gradient-to-r from-fifa-blue to-blue-900 p-5 flex justify-between items-center">
        <h3 className="font-headline font-bold text-white uppercase tracking-tight">
          {formatGroupLabel(groupName)}
        </h3>
        <span className="text-[10px] font-mono text-white/60 bg-white/10 px-2 py-1 rounded">
          {entries[0]?.team?.venue ?? 'Sede por confirmar'}
        </span>
      </div>

      <div className="p-5 flex-1">
        <table className="w-full text-sm mb-6">
          <thead>
            <tr className="text-[10px] uppercase text-slate-400 font-bold border-b border-slate-100 dark:border-slate-800">
              <th className="text-left pb-2">POS</th>
              <th className="text-left pb-2">SELECCIÓN</th>
              <th className="text-center pb-2">PJ</th>
              <th className="text-center pb-2">PTS</th>
            </tr>
          </thead>
          <tbody className="font-medium">
            {entries.length === 0 && (
              <tr>
                <td colSpan={4} className="py-6 text-center text-xs text-slate-500">
                  Posiciones aún no disponibles.
                </td>
              </tr>
            )}
            {entries.map((entry) => (
              <tr key={entry.team.id} className="border-b border-slate-50 dark:border-slate-800/50 group">
                <td className="py-3">
                  <span className={cn(
                    "w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold",
                    entry.position <= 2 ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-500"
                  )}>
                    {entry.position}
                  </span>
                </td>
                <td className="py-3 flex items-center gap-3">
                  {getFlagCode(entry.team) ? (
                    <span className={`fi fi-${getFlagCode(entry.team)} w-6 h-4 rounded-sm`} title={entry.team.name} />
                  ) : entry.team.crest ? (
                    <img src={entry.team.crest} alt={entry.team.name} className="w-6 h-4 object-contain" />
                  ) : (
                    <div className="w-6 h-4 bg-slate-200 rounded-sm" />
                  )}
                  <span className="font-bold uppercase tracking-tight text-xs">{entry.team.name}</span>
                </td>
                <td className="py-3 text-center font-mono text-xs">{entry.playedGames}</td>
                <td className="py-3 text-center font-mono font-bold text-fifa-blue dark:text-fifa-gold">{entry.points}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="space-y-3">
          <p className="text-[10px] font-bold uppercase text-slate-400 tracking-widest">Próximo Partido</p>
          {nextMatch ? (
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-900/50 group cursor-pointer hover:bg-slate-100 transition-colors">
              <span className="font-bold text-xs">{nextMatch.homeTeam.tla ?? nextMatch.homeTeam.name}</span>
              <div className="flex flex-col items-center">
                <span className="font-mono font-bold text-xs">{kickoff.time}</span>
                <span className="text-[8px] text-slate-400">{kickoff.date}</span>
              </div>
              <span className="font-bold text-xs">{nextMatch.awayTeam.tla ?? nextMatch.awayTeam.name}</span>
            </div>
          ) : (
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/50 text-xs text-slate-500 text-center">
              El fixture aún no fue publicado por la API.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
