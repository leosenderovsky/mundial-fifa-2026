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
      { name: 'Mexico', nameEs: 'México', flag: 'mx' },
      { name: 'South Africa', nameEs: 'Sudáfrica', flag: 'za' },
      { name: 'South Korea', nameEs: 'Corea del Sur', flag: 'kr' },
      { name: 'Czechia', nameEs: 'República Checa', flag: 'cz' },
    ],
  },
  {
    key: 'GROUP_B',
    label: 'Grupo B',
    teams: [
      { name: 'Canada', nameEs: 'Canadá', flag: 'ca' },
      { name: 'Bosnia-Herzegovina', nameEs: 'Bosnia-Herzegovina', flag: 'ba' },
      { name: 'Qatar', nameEs: 'Qatar', flag: 'qa' },
      { name: 'Switzerland', nameEs: 'Suiza', flag: 'ch' },
    ],
  },
  {
    key: 'GROUP_C',
    label: 'Grupo C',
    teams: [
      { name: 'Brazil', nameEs: 'Brasil', flag: 'br' },
      { name: 'Morocco', nameEs: 'Marruecos', flag: 'ma' },
      { name: 'Haiti', nameEs: 'Haití', flag: 'ht' },
      { name: 'Scotland', nameEs: 'Escocia', flag: 'gb-sct' },
    ],
  },
  {
    key: 'GROUP_D',
    label: 'Grupo D',
    teams: [
      { name: 'United States', nameEs: 'Estados Unidos', flag: 'us' },
      { name: 'Paraguay', nameEs: 'Paraguay', flag: 'py' },
      { name: 'Australia', nameEs: 'Australia', flag: 'au' },
      { name: 'Turkey', nameEs: 'Turquía', flag: 'tr' },
    ],
  },
  {
    key: 'GROUP_E',
    label: 'Grupo E',
    teams: [
      { name: 'Germany', nameEs: 'Alemania', flag: 'de' },
      { name: 'Curaçao', nameEs: 'Curazao', flag: 'cw' },
      { name: 'Ivory Coast', nameEs: 'Costa de Marfil', flag: 'ci' },
      { name: 'Ecuador', nameEs: 'Ecuador', flag: 'ec' },
    ],
  },
  {
    key: 'GROUP_F',
    label: 'Grupo F',
    teams: [
      { name: 'Netherlands', nameEs: 'Países Bajos', flag: 'nl' },
      { name: 'Japan', nameEs: 'Japón', flag: 'jp' },
      { name: 'Sweden', nameEs: 'Suecia', flag: 'se' },
      { name: 'Tunisia', nameEs: 'Túnez', flag: 'tn' },
    ],
  },
  {
    key: 'GROUP_G',
    label: 'Grupo G',
    teams: [
      { name: 'Belgium', nameEs: 'Bélgica', flag: 'be' },
      { name: 'Egypt', nameEs: 'Egipto', flag: 'eg' },
      { name: 'Iran', nameEs: 'Irán', flag: 'ir' },
      { name: 'New Zealand', nameEs: 'Nueva Zelanda', flag: 'nz' },
    ],
  },
  {
    key: 'GROUP_H',
    label: 'Grupo H',
    teams: [
      { name: 'Spain', nameEs: 'España', flag: 'es' },
      { name: 'Cape Verde', nameEs: 'Cabo Verde', flag: 'cv' },
      { name: 'Saudi Arabia', nameEs: 'Arabia Saudita', flag: 'sa' },
      { name: 'Uruguay', nameEs: 'Uruguay', flag: 'uy' },
    ],
  },
  {
    key: 'GROUP_I',
    label: 'Grupo I',
    teams: [
      { name: 'France', nameEs: 'Francia', flag: 'fr' },
      { name: 'Senegal', nameEs: 'Senegal', flag: 'sn' },
      { name: 'Iraq', nameEs: 'Irak', flag: 'iq' },
      { name: 'Norway', nameEs: 'Noruega', flag: 'no' },
    ],
  },
  {
    key: 'GROUP_J',
    label: 'Grupo J',
    teams: [
      { name: 'Argentina', nameEs: 'Argentina', flag: 'ar' },
      { name: 'Algeria', nameEs: 'Argelia', flag: 'dz' },
      { name: 'Austria', nameEs: 'Austria', flag: 'at' },
      { name: 'Jordan', nameEs: 'Jordania', flag: 'jo' },
    ],
  },
  {
    key: 'GROUP_K',
    label: 'Grupo K',
    teams: [
      { name: 'Portugal', nameEs: 'Portugal', flag: 'pt' },
      { name: 'DR Congo', nameEs: 'R.D. Congo', flag: 'cd' },
      { name: 'Uzbekistan', nameEs: 'Uzbekistán', flag: 'uz' },
      { name: 'Colombia', nameEs: 'Colombia', flag: 'co' },
    ],
  },
  {
    key: 'GROUP_L',
    label: 'Grupo L',
    teams: [
      { name: 'England', nameEs: 'Inglaterra', flag: 'gb-eng' },
      { name: 'Croatia', nameEs: 'Croacia', flag: 'hr' },
      { name: 'Ghana', nameEs: 'Ghana', flag: 'gh' },
      { name: 'Panama', nameEs: 'Panamá', flag: 'pa' },
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
