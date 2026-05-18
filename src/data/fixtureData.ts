import type { Team, Match } from '../types/api';

export interface StaticTeam {
  name: string;
  nameEs: string;
  flag: string;
  crestUrl?: string;
}

export interface StaticGroup {
  key: string;
  label: string;
  teams: StaticTeam[];
}

export const STATIC_GROUPS: StaticGroup[] = [
  {
    key: 'GROUP_A',
    label: 'Grupo A',
    teams: [
      { name: 'Mexico', nameEs: 'México', flag: 'mx', crestUrl: 'https://crests.football-data.org/mx.svg' },
      { name: 'South Africa', nameEs: 'Sudáfrica', flag: 'za', crestUrl: 'https://crests.football-data.org/za.svg' },
      { name: 'South Korea', nameEs: 'Corea del Sur', flag: 'kr', crestUrl: 'https://crests.football-data.org/kr.svg' },
      { name: 'Czechia', nameEs: 'República Checa', flag: 'cz', crestUrl: 'https://crests.football-data.org/cz.svg' },
    ],
  },
  {
    key: 'GROUP_B',
    label: 'Grupo B',
    teams: [
      { name: 'Canada', nameEs: 'Canadá', flag: 'ca', crestUrl: 'https://crests.football-data.org/ca.svg' },
      { name: 'Bosnia-Herzegovina', nameEs: 'Bosnia-Herzegovina', flag: 'ba', crestUrl: 'https://crests.football-data.org/ba.svg' },
      { name: 'Qatar', nameEs: 'Qatar', flag: 'qa', crestUrl: 'https://crests.football-data.org/qa.svg' },
      { name: 'Switzerland', nameEs: 'Suiza', flag: 'ch', crestUrl: 'https://crests.football-data.org/ch.svg' },
    ],
  },
  {
    key: 'GROUP_C',
    label: 'Grupo C',
    teams: [
      { name: 'Brazil', nameEs: 'Brasil', flag: 'br', crestUrl: 'https://crests.football-data.org/br.svg' },
      { name: 'Morocco', nameEs: 'Marruecos', flag: 'ma', crestUrl: 'https://crests.football-data.org/ma.svg' },
      { name: 'Haiti', nameEs: 'Haití', flag: 'ht', crestUrl: 'https://crests.football-data.org/ht.svg' },
      { name: 'Scotland', nameEs: 'Escocia', flag: 'gb-sct', crestUrl: 'https://crests.football-data.org/gb-sct.svg' },
    ],
  },
  {
    key: 'GROUP_D',
    label: 'Grupo D',
    teams: [
      { name: 'United States', nameEs: 'Estados Unidos', flag: 'us', crestUrl: 'https://crests.football-data.org/us.svg' },
      { name: 'Paraguay', nameEs: 'Paraguay', flag: 'py', crestUrl: 'https://crests.football-data.org/py.svg' },
      { name: 'Australia', nameEs: 'Australia', flag: 'au', crestUrl: 'https://crests.football-data.org/au.svg' },
      { name: 'Turkey', nameEs: 'Turquía', flag: 'tr', crestUrl: 'https://crests.football-data.org/tr.svg' },
    ],
  },
  {
    key: 'GROUP_E',
    label: 'Grupo E',
    teams: [
      { name: 'Germany', nameEs: 'Alemania', flag: 'de', crestUrl: 'https://crests.football-data.org/de.svg' },
      { name: 'Curaçao', nameEs: 'Curazao', flag: 'cw', crestUrl: 'https://crests.football-data.org/cw.svg' },
      { name: 'Ivory Coast', nameEs: 'Costa de Marfil', flag: 'ci', crestUrl: 'https://crests.football-data.org/ci.svg' },
      { name: 'Ecuador', nameEs: 'Ecuador', flag: 'ec', crestUrl: 'https://crests.football-data.org/ec.svg' },
    ],
  },
  {
    key: 'GROUP_F',
    label: 'Grupo F',
    teams: [
      { name: 'Netherlands', nameEs: 'Países Bajos', flag: 'nl', crestUrl: 'https://crests.football-data.org/nl.svg' },
      { name: 'Japan', nameEs: 'Japón', flag: 'jp', crestUrl: 'https://crests.football-data.org/jp.svg' },
      { name: 'Sweden', nameEs: 'Suecia', flag: 'se', crestUrl: 'https://crests.football-data.org/se.svg' },
      { name: 'Tunisia', nameEs: 'Túnez', flag: 'tn', crestUrl: 'https://crests.football-data.org/tn.svg' },
    ],
  },
  {
    key: 'GROUP_G',
    label: 'Grupo G',
    teams: [
      { name: 'Belgium', nameEs: 'Bélgica', flag: 'be', crestUrl: 'https://crests.football-data.org/be.svg' },
      { name: 'Egypt', nameEs: 'Egipto', flag: 'eg', crestUrl: 'https://crests.football-data.org/eg.svg' },
      { name: 'Iran', nameEs: 'Irán', flag: 'ir', crestUrl: 'https://crests.football-data.org/ir.svg' },
      { name: 'New Zealand', nameEs: 'Nueva Zelanda', flag: 'nz', crestUrl: 'https://crests.football-data.org/nz.svg' },
    ],
  },
  {
    key: 'GROUP_H',
    label: 'Grupo H',
    teams: [
      { name: 'Spain', nameEs: 'España', flag: 'es', crestUrl: 'https://crests.football-data.org/es.svg' },
      { name: 'Cape Verde', nameEs: 'Cabo Verde', flag: 'cv', crestUrl: 'https://crests.football-data.org/cv.svg' },
      { name: 'Saudi Arabia', nameEs: 'Arabia Saudita', flag: 'sa', crestUrl: 'https://crests.football-data.org/sa.svg' },
      { name: 'Uruguay', nameEs: 'Uruguay', flag: 'uy', crestUrl: 'https://crests.football-data.org/uy.svg' },
    ],
  },
  {
    key: 'GROUP_I',
    label: 'Grupo I',
    teams: [
      { name: 'France', nameEs: 'Francia', flag: 'fr', crestUrl: 'https://crests.football-data.org/fr.svg' },
      { name: 'Senegal', nameEs: 'Senegal', flag: 'sn', crestUrl: 'https://crests.football-data.org/sn.svg' },
      { name: 'Iraq', nameEs: 'Irak', flag: 'iq', crestUrl: 'https://crests.football-data.org/iq.svg' },
      { name: 'Norway', nameEs: 'Noruega', flag: 'no', crestUrl: 'https://crests.football-data.org/no.svg' },
    ],
  },
  {
    key: 'GROUP_J',
    label: 'Grupo J',
    teams: [
      { name: 'Argentina', nameEs: 'Argentina', flag: 'ar', crestUrl: 'https://crests.football-data.org/ar.svg' },
      { name: 'Algeria', nameEs: 'Argelia', flag: 'dz', crestUrl: 'https://crests.football-data.org/dz.svg' },
      { name: 'Austria', nameEs: 'Austria', flag: 'at', crestUrl: 'https://crests.football-data.org/at.svg' },
      { name: 'Jordan', nameEs: 'Jordania', flag: 'jo', crestUrl: 'https://crests.football-data.org/jo.svg' },
    ],
  },
  {
    key: 'GROUP_K',
    label: 'Grupo K',
    teams: [
      { name: 'Portugal', nameEs: 'Portugal', flag: 'pt', crestUrl: 'https://crests.football-data.org/pt.svg' },
      { name: 'DR Congo', nameEs: 'R.D. Congo', flag: 'cd', crestUrl: 'https://crests.football-data.org/cd.svg' },
      { name: 'Uzbekistan', nameEs: 'Uzbekistán', flag: 'uz', crestUrl: 'https://crests.football-data.org/uz.svg' },
      { name: 'Colombia', nameEs: 'Colombia', flag: 'co', crestUrl: 'https://crests.football-data.org/co.svg' },
    ],
  },
  {
    key: 'GROUP_L',
    label: 'Grupo L',
    teams: [
      { name: 'England', nameEs: 'Inglaterra', flag: 'gb-eng', crestUrl: 'https://crests.football-data.org/gb-eng.svg' },
      { name: 'Croatia', nameEs: 'Croacia', flag: 'hr', crestUrl: 'https://crests.football-data.org/hr.svg' },
      { name: 'Ghana', nameEs: 'Ghana', flag: 'gh', crestUrl: 'https://crests.football-data.org/gh.svg' },
      { name: 'Panama', nameEs: 'Panamá', flag: 'pa', crestUrl: 'https://crests.football-data.org/pa.svg' },
    ],
  },
];

const stableTeamId = (groupIndex: number, teamIndex: number) =>
  2026000 + groupIndex * 10 + teamIndex;

const toApiTeam = (teamData: StaticTeam, groupIndex: number, teamIndex: number): Team => ({
  id: stableTeamId(groupIndex, teamIndex),
  name: teamData.nameEs,
  shortName: teamData.name,
  tla: teamData.flag.toUpperCase(),
  crest: teamData.crestUrl,
  flag: teamData.flag,
});

export const STATIC_TEAMS: Team[] = STATIC_GROUPS.flatMap((group, groupIndex) =>
  group.teams.map((team, teamIndex) => toApiTeam(team, groupIndex, teamIndex))
);

const emptyScore = {
  winner: null,
  duration: 'REGULAR',
  fullTime: { home: null, away: null },
  halfTime: { home: null, away: null },
};

const ROUND_ROBIN = [[0, 1], [2, 3], [0, 2], [1, 3], [0, 3], [1, 2]] as const;

const GROUP_KICKOFF_HOURS = [15, 18, 21];

function generateGroupStageMatches(): Match[] {
  const matches: Match[] = [];
  let matchId = 1;
  const tournamentStart = new Date('2026-06-11T00:00:00Z');

  STATIC_GROUPS.forEach((group, groupIndex) => {
    ROUND_ROBIN.forEach((pair, matchIndex) => {
      const home = group.teams[pair[0]];
      const away = group.teams[pair[1]];
      const dayOffset = Math.floor(matchIndex / 2) + groupIndex;
      const hour = GROUP_KICKOFF_HOURS[matchIndex % GROUP_KICKOFF_HOURS.length];
      const date = new Date(tournamentStart);
      date.setUTCDate(date.getUTCDate() + dayOffset);
      date.setUTCHours(hour, 0, 0, 0);

      matches.push({
        id: matchId++,
        utcDate: date.toISOString(),
        status: 'SCHEDULED',
        matchday: Math.floor(matchIndex / 2) + 1,
        stage: 'GROUP_STAGE',
        group: group.key,
        lastUpdated: date.toISOString(),
        homeTeam: toApiTeam(home, groupIndex, pair[0]),
        awayTeam: toApiTeam(away, groupIndex, pair[1]),
        score: emptyScore,
      });
    });
  });

  return matches;
}

const tbdTeam = (label: string, id: number): Team => ({
  id,
  name: label,
  shortName: label,
  crest: undefined,
});

function generateKnockoutMatches(): Match[] {
  const slots = [
  { stage: 'LAST_32', date: '2026-06-28T17:00:00Z', home: '1º Grupo A', away: '3º Grupo B/C/D' },
  { stage: 'LAST_32', date: '2026-06-29T20:00:00Z', home: '1º Grupo B', away: '3º Grupo A/C/D' },
  { stage: 'LAST_32', date: '2026-06-30T17:00:00Z', home: '1º Grupo C', away: '3º Grupo A/B/D' },
  { stage: 'LAST_32', date: '2026-07-01T20:00:00Z', home: '1º Grupo D', away: '3º Grupo A/B/C' },
  { stage: 'LAST_16', date: '2026-07-04T17:00:00Z', home: 'Ganador R32-1', away: 'Ganador R32-2' },
  { stage: 'LAST_16', date: '2026-07-05T20:00:00Z', home: 'Ganador R32-3', away: 'Ganador R32-4' },
  { stage: 'LAST_16', date: '2026-07-06T17:00:00Z', home: 'Ganador R32-5', away: 'Ganador R32-6' },
  { stage: 'LAST_16', date: '2026-07-07T20:00:00Z', home: 'Ganador R32-7', away: 'Ganador R32-8' },
  { stage: 'QUARTER_FINALS', date: '2026-07-09T20:00:00Z', home: 'Ganador R16-1', away: 'Ganador R16-2' },
  { stage: 'QUARTER_FINALS', date: '2026-07-10T17:00:00Z', home: 'Ganador R16-3', away: 'Ganador R16-4' },
  { stage: 'SEMI_FINALS', date: '2026-07-14T20:00:00Z', home: 'Ganador CF-1', away: 'Ganador CF-2' },
  { stage: 'SEMI_FINALS', date: '2026-07-15T20:00:00Z', home: 'Ganador CF-3', away: 'Ganador CF-4' },
  { stage: 'THIRD_PLACE', date: '2026-07-18T17:00:00Z', home: 'Perdedor SF-1', away: 'Perdedor SF-2' },
  { stage: 'FINAL', date: '2026-07-19T20:00:00Z', home: 'Ganador SF-1', away: 'Ganador SF-2' },
  ];

  return slots.map((slot, index) => ({
    id: 9000 + index,
    utcDate: slot.date,
    status: 'SCHEDULED' as const,
    matchday: 1,
    stage: slot.stage,
    group: null,
    lastUpdated: slot.date,
    homeTeam: tbdTeam(slot.home, 9100 + index * 2),
    awayTeam: tbdTeam(slot.away, 9100 + index * 2 + 1),
    score: emptyScore,
  }));
}

export const STATIC_GROUP_MATCHES = generateGroupStageMatches();
export const STATIC_KNOCKOUT_MATCHES = generateKnockoutMatches();
export const STATIC_MATCHES: Match[] = [...STATIC_GROUP_MATCHES, ...STATIC_KNOCKOUT_MATCHES];
