import { cn } from '../../lib/utils';
import type { Match, StandingEntry } from '../../types/api';
import type { StaticTeam } from '../../data/fixtureData';
import { getFlagCode } from '../../lib/flags';
import { Link } from 'react-router-dom';
import { getTeamLink } from '../../lib/teamLinks';
import { proxiedImage } from '../../lib/imageProxy';

const GROUP_VENUES: Record<string, string> = {
  GROUP_A:  'Los Ángeles · Guadalajara · SFO',
  GROUP_B:  'Toronto · Kansas City · Seattle',
  GROUP_C:  'Dallas · Houston · Boston',
  GROUP_D:  'Nueva York · Filadelfia · Miami',
  GROUP_E:  'Los Ángeles · San Francisco · Guadalajara',
  GROUP_F:  'Vancouver · Seattle · Kansas City',
  GROUP_G:  'Atlanta · Dallas · Miami',
  GROUP_H:  'Nueva York · Boston · Filadelfia',
  GROUP_I:  'Houston · Atlanta · Toronto',
  GROUP_J:  'Monterrey · Ciudad de México · Guadalajara',
  GROUP_K:  'San Francisco · Los Ángeles · Vancouver',
  GROUP_L:  'Monterrey · Ciudad de México · Kansas City',
};

interface ComputedEntry {
  name: string;
  nameEs?: string;
  flag: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  points: number;
}

function computeStandingsFromMatches(
  staticTeams: StaticTeam[],
  matches: Match[]
): ComputedEntry[] {
  const map = new Map<string, ComputedEntry>();

  staticTeams.forEach((t) => {
    map.set(t.name.toLowerCase(), {
      name: t.name,
      nameEs: t.nameEs,
      flag: t.flag,
      played: 0, won: 0, drawn: 0, lost: 0,
      goalsFor: 0, goalsAgainst: 0, points: 0,
    });
  });

  matches
    .filter((m) => m.status === 'FINISHED')
    .forEach((m) => {
      const hg = m.score.fullTime.home ?? 0;
      const ag = m.score.fullTime.away ?? 0;
      const hKey = (m.homeTeam.shortName ?? m.homeTeam.name).toLowerCase();
      const aKey = (m.awayTeam.shortName ?? m.awayTeam.name).toLowerCase();

      // Buscar coincidencia flexible (nombre parcial)
      const findEntry = (key: string): ComputedEntry | undefined => {
        if (map.has(key)) return map.get(key);
        for (const [k, v] of map) {
          if (k.includes(key) || key.includes(k)) return v;
        }
        return undefined;
      };

      const home = findEntry(hKey);
      const away = findEntry(aKey);

      if (home) {
        home.played++;
        home.goalsFor += hg;
        home.goalsAgainst += ag;
        if (hg > ag) { home.won++; home.points += 3; }
        else if (hg === ag) { home.drawn++; home.points += 1; }
        else { home.lost++; }
      }
      if (away) {
        away.played++;
        away.goalsFor += ag;
        away.goalsAgainst += hg;
        if (ag > hg) { away.won++; away.points += 3; }
        else if (ag === hg) { away.drawn++; away.points += 1; }
        else { away.lost++; }
      }
    });

  return [...map.values()].sort(
    (a, b) => b.points - a.points || (b.goalsFor - b.goalsAgainst) - (a.goalsFor - a.goalsAgainst)
  );
}

interface GroupCardProps {
  groupName: string;
  entries: StandingEntry[];
  staticTeams?: StaticTeam[];
  matches?: Match[];
  nextMatch?: Match | null;
  hasStandingsError?: boolean;
  hasMatchesError?: boolean;
}

const formatGroupLabel = (group: string) =>
  group.replace('GROUP_', 'Grupo ');

const formatKickoff = (utcDate?: string) => {
  if (!utcDate) return { time: '--:--', date: 'JUN 2026' };
  const date = new Date(utcDate);
  const time = date.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' });
  const day = date.toLocaleDateString('es-AR', { day: '2-digit', month: 'short' }).toUpperCase();
  return { time, date: day };
};

const MatchRow = ({ match }: { match: Match }) => {
  const isFinished = match.status === 'FINISHED';
  const isLive = match.status === 'IN_PLAY' || match.status === 'PAUSED';
  const isScheduled = match.status === 'SCHEDULED' || match.status === 'TIMED';

  return (
    <div className="flex items-center justify-between p-2.5 rounded-lg bg-white dark:bg-slate-900/60 text-xs">
      <div className="flex items-center gap-2 flex-1 min-w-0">
        <Link to={getTeamLink(match.homeTeam)} className="hover:scale-110 transition-transform shrink-0">
          {getFlagCode(match.homeTeam) ? (
            <span className={`fi fi-${getFlagCode(match.homeTeam)} w-5 h-3 rounded-sm`} title={match.homeTeam.name} />
          ) : match.homeTeam.crest ? (
            <img src={proxiedImage(match.homeTeam.crest)} alt={match.homeTeam.name} className="w-5 h-3 object-contain" />
          ) : (
            <div className="w-5 h-3 bg-slate-200 rounded-sm" />
          )}
        </Link>
        <span className="font-bold uppercase truncate">{match.homeTeam.shortName ?? match.homeTeam.name}</span>
      </div>

      <div className="text-center min-w-[60px] shrink-0 mx-2">
        {isFinished || isLive ? (
          <span className={cn(
            "font-mono font-bold",
            isLive && "text-fifa-red animate-pulse"
          )}>
            {match.score.fullTime.home ?? match.score.halfTime.home ?? '-'}
            {' - '}
            {match.score.fullTime.away ?? match.score.halfTime.away ?? '-'}
          </span>
        ) : isScheduled ? (
          <span className="font-mono text-slate-500">
            {formatKickoff(match.utcDate).time}
          </span>
        ) : (
          <span className="text-slate-400">vs</span>
        )}
      </div>

      <div className="flex items-center gap-2 flex-1 min-w-0 justify-end">
        <span className="font-bold uppercase truncate">{match.awayTeam.shortName ?? match.awayTeam.name}</span>
        <Link to={getTeamLink(match.awayTeam)} className="hover:scale-110 transition-transform shrink-0">
          {getFlagCode(match.awayTeam) ? (
            <span className={`fi fi-${getFlagCode(match.awayTeam)} w-5 h-3 rounded-sm`} title={match.awayTeam.name} />
          ) : match.awayTeam.crest ? (
            <img src={proxiedImage(match.awayTeam.crest)} alt={match.awayTeam.name} className="w-5 h-3 object-contain" />
          ) : (
            <div className="w-5 h-3 bg-slate-200 rounded-sm" />
          )}
        </Link>
      </div>
    </div>
  );
};

export const GroupCard = ({
  groupName,
  entries,
  staticTeams = [],
  matches = [],
  nextMatch,
  hasStandingsError,
  hasMatchesError
}: GroupCardProps) => {
  const kickoff = formatKickoff(nextMatch?.utcDate);
  const showStatic = entries.length === 0 && staticTeams.length > 0;

  const finishedMatches = matches.filter(m => m.status === 'FINISHED');
  const upcomingMatches = matches.filter(m => m.status === 'SCHEDULED' || m.status === 'TIMED');
  const liveMatches = matches.filter(m => m.status === 'IN_PLAY' || m.status === 'PAUSED');

  const computedEntries = (showStatic && finishedMatches.length > 0)
    ? computeStandingsFromMatches(staticTeams, matches)
    : [];
  const useComputed = computedEntries.length > 0;

  return (
    <div className="stadium-card flex flex-col h-full border border-transparent hover:border-fifa-blue/20 transition-all">
      <div className="bg-gradient-to-r from-fifa-blue to-blue-900 p-5 flex justify-between items-center">
        <h3 className="font-headline font-bold text-white uppercase tracking-tight">
          {formatGroupLabel(groupName)}
        </h3>
        <span className="text-[10px] font-mono text-white/60 bg-white/10 px-2 py-1 rounded">
          {GROUP_VENUES[groupName] ?? 'Sede por confirmar'}
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
            {useComputed ? (
              computedEntries.map((entry, idx) => (
                <tr key={entry.name} className="border-b border-slate-50 dark:border-slate-800/50 group">
                  <td className="py-3">
                    <span className={cn(
                      "w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold",
                      idx < 2 ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-500"
                    )}>{idx + 1}</span>
                  </td>
                  <td className="py-3 flex items-center gap-3">
                    {entry.flag && <span className={`fi fi-${entry.flag} w-6 h-4 rounded-sm`} />}
                    <span className="font-bold uppercase tracking-tight text-xs">{entry.nameEs ?? entry.name}</span>
                  </td>
                  <td className="py-3 text-center font-mono text-xs">{entry.played}</td>
                  <td className="py-3 text-center font-mono font-bold text-fifa-blue dark:text-fifa-gold">{entry.points}</td>
                </tr>
              ))
            ) : showStatic ? (
              staticTeams.map((team, idx) => (
                <tr key={team.name} className="border-b border-slate-50 dark:border-slate-800/50 group">
                  <td className="py-3">
                    <span className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold bg-slate-100 text-slate-500">
                      {idx + 1}
                    </span>
                  </td>
                  <td className="py-3 flex items-center gap-3">
                    <span className={`fi fi-${team.flag} w-6 h-4 rounded-sm`} title={team.nameEs} aria-label={team.nameEs} />
                    <span className="font-bold uppercase tracking-tight text-xs">{team.nameEs}</span>
                  </td>
                  <td className="py-3 text-center font-mono text-xs">—</td>
                  <td className="py-3 text-center font-mono font-bold text-fifa-blue dark:text-fifa-gold">—</td>
                </tr>
              ))
            ) : entries.length > 0 ? (
              entries.map((entry) => (
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
                      <span className={`fi fi-${getFlagCode(entry.team)} w-6 h-4 rounded-sm`} title={entry.team.name} aria-label={entry.team.name} />
                    ) : (entry.team as any).flag ? (
                      <span className={`fi fi-${(entry.team as any).flag} w-6 h-4 rounded-sm`} title={entry.team.name} aria-label={entry.team.name} />
                    ) : entry.team.crest ? (
                      <img src={proxiedImage(entry.team.crest)} alt={entry.team.name} className="w-6 h-4 object-contain" />
                    ) : (
                      <div className="w-6 h-4 bg-slate-200 rounded-sm" />
                    )}
                    <span className="font-bold uppercase tracking-tight text-xs">{entry.team.name}</span>
                  </td>
                  <td className="py-3 text-center font-mono text-xs">{entry.playedGames}</td>
                  <td className="py-3 text-center font-mono font-bold text-fifa-blue dark:text-fifa-gold">{entry.points}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="py-6 text-center text-xs text-slate-500">
                  {hasStandingsError ? "No se pudieron cargar las posiciones." : "Posiciones aún no disponibles."}
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {(finishedMatches.length > 0 || liveMatches.length > 0 || upcomingMatches.length > 0) && (
          <div className="space-y-2">
            <p className="text-[10px] font-bold uppercase text-slate-400 tracking-widest">
              {finishedMatches.length > 0 ? 'Resultados' : liveMatches.length > 0 ? 'En Vivo' : 'Próximo Partido'}
            </p>
            {liveMatches.map(m => <MatchRow key={m.id} match={m} />)}
            {finishedMatches.slice(0, 3).map(m => <MatchRow key={m.id} match={m} />)}
            {upcomingMatches.length > 0 && finishedMatches.length === 0 && liveMatches.length === 0 && (
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-900/50 group cursor-pointer hover:bg-slate-100 transition-colors">
                <Link to={getTeamLink(upcomingMatches[0].homeTeam)} className="hover:scale-110 transition-transform">
                  {getFlagCode(upcomingMatches[0].homeTeam) ? (
                    <span
                      className={`fi fi-${getFlagCode(upcomingMatches[0].homeTeam)} w-6 h-4 rounded-sm`}
                      title={upcomingMatches[0].homeTeam.name}
                      aria-label={upcomingMatches[0].homeTeam.name}
                    />
                  ) : upcomingMatches[0].homeTeam.crest ? (
                    <img src={proxiedImage(upcomingMatches[0].homeTeam.crest)} alt={upcomingMatches[0].homeTeam.name} className="w-6 h-4 object-contain" />
                  ) : (
                    <div className="w-6 h-4 bg-slate-200 rounded-sm" />
                  )}
                </Link>
                <div className="flex flex-col items-center">
                  <span className="font-mono font-bold text-xs">{kickoff.time}</span>
                  <span className="text-[8px] text-slate-400">{kickoff.date}</span>
                </div>
                <Link to={getTeamLink(upcomingMatches[0].awayTeam)} className="hover:scale-110 transition-transform">
                  {getFlagCode(upcomingMatches[0].awayTeam) ? (
                    <span
                      className={`fi fi-${getFlagCode(upcomingMatches[0].awayTeam)} w-6 h-4 rounded-sm`}
                      title={upcomingMatches[0].awayTeam.name}
                      aria-label={upcomingMatches[0].awayTeam.name}
                    />
                  ) : upcomingMatches[0].awayTeam.crest ? (
                    <img src={proxiedImage(upcomingMatches[0].awayTeam.crest)} alt={upcomingMatches[0].awayTeam.name} className="w-6 h-4 object-contain" />
                  ) : (
                    <div className="w-6 h-4 bg-slate-200 rounded-sm" />
                  )}
                </Link>
              </div>
            )}
          </div>
        )}

        {matches.length === 0 && nextMatch && (
          <div className="space-y-3">
            <p className="text-[10px] font-bold uppercase text-slate-400 tracking-widest">Próximo Partido</p>
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-900/50 text-xs text-slate-500 text-center font-bold">
              {kickoff.date}
            </div>
          </div>
        )}

        {matches.length === 0 && !nextMatch && (
          <div className="space-y-3">
            <p className="text-[10px] font-bold uppercase text-slate-400 tracking-widest">Próximo Partido</p>
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/50 text-xs text-slate-500 text-center font-bold">
              {kickoff.date}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
