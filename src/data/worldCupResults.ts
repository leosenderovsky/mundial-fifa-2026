// src/data/worldCupResults.ts
// ACTUALIZAR con cada nueva fecha del torneo

import type { Match } from '../types/api';

// IDs de selecciones (los mismos que usa football-data.org)
// Estos IDs son los que devuelve api.getCompetitionTeams()
// Si la API falla, usamos nombres para matchear con STATIC_GROUPS
const mkScore = (h: number, a: number) => ({
  winner: h > a ? 'HOME_TEAM' : a > h ? 'AWAY_TEAM' : 'DRAW',
  duration: 'REGULAR',
  fullTime: { home: h, away: a },
  halfTime: { home: null, away: null },
});

const mkTeam = (name: string, shortName: string, flag: string) => ({
  id: 0,
  name,
  shortName,
  tla: shortName,
  crest: undefined,
  flag,
});

// Resultados confirmados — Jornada 1 (11-12 Jun 2026)
export const PLAYED_MATCHES: Partial<Match>[] = [
  // GRUPO A
  {
    id: 9001, utcDate: '2026-06-11T20:00:00Z', status: 'FINISHED',
    matchday: 1, stage: 'GROUP_STAGE', group: 'GROUP_A', lastUpdated: '',
    homeTeam: mkTeam('Mexico', 'MEX', 'mx'),
    awayTeam: mkTeam('South Africa', 'RSA', 'za'),
    score: mkScore(2, 0),
  },
  {
    id: 9002, utcDate: '2026-06-11T23:00:00Z', status: 'FINISHED',
    matchday: 1, stage: 'GROUP_STAGE', group: 'GROUP_A', lastUpdated: '',
    homeTeam: mkTeam('Korea Republic', 'KOR', 'kr'),
    awayTeam: mkTeam('Czechia', 'CZE', 'cz'),
    score: mkScore(2, 1),
  },
  // GRUPO B
  {
    id: 9003, utcDate: '2026-06-12T17:00:00Z', status: 'FINISHED',
    matchday: 1, stage: 'GROUP_STAGE', group: 'GROUP_B', lastUpdated: '',
    homeTeam: mkTeam('Canada', 'CAN', 'ca'),
    awayTeam: mkTeam('Bosnia-Herzegovina', 'BIH', 'ba'),
    score: mkScore(1, 1),
  },
  {
    id: 9004, utcDate: '2026-06-12T20:00:00Z', status: 'FINISHED',
    matchday: 1, stage: 'GROUP_STAGE', group: 'GROUP_B', lastUpdated: '',
    homeTeam: mkTeam('Qatar', 'QAT', 'qa'),
    awayTeam: mkTeam('Switzerland', 'SUI', 'ch'),
    score: mkScore(1, 1),
  },
  // GRUPO C
  {
    id: 9005, utcDate: '2026-06-13T17:00:00Z', status: 'FINISHED',
    matchday: 1, stage: 'GROUP_STAGE', group: 'GROUP_C', lastUpdated: '',
    homeTeam: mkTeam('Brazil', 'BRA', 'br'),
    awayTeam: mkTeam('Morocco', 'MAR', 'ma'),
    score: mkScore(1, 1),
  },
  {
    id: 9006, utcDate: '2026-06-13T20:00:00Z', status: 'FINISHED',
    matchday: 1, stage: 'GROUP_STAGE', group: 'GROUP_C', lastUpdated: '',
    homeTeam: mkTeam('Haiti', 'HAI', 'ht'),
    awayTeam: mkTeam('Scotland', 'SCO', 'gb-sct'),
    score: mkScore(0, 1),
  },
  // GRUPO D — agregar resultados cuando se confirmen
  // { id: 9007, ... }
];

// Goleadores estáticos — ACTUALIZAR por jornada
export interface StaticScorer {
  playerName: string;
  teamName: string;
  teamShortName: string;
  teamFlag: string;
  goals: number;
  assists: number;
}

export const STATIC_TOP_SCORERS: StaticScorer[] = [
  { playerName: 'Folarin Balogun',  teamName: 'United States',   teamShortName: 'USA',  teamFlag: 'us', goals: 2, assists: 0 },
  { playerName: 'Kai Havertz',      teamName: 'Germany',          teamShortName: 'GER',  teamFlag: 'de', goals: 2, assists: 0 },
  { playerName: 'Yasin Ayari',      teamName: 'Sweden',           teamShortName: 'SWE',  teamFlag: 'se', goals: 2, assists: 0 },
  { playerName: 'Elijah Just',      teamName: 'New Zealand',      teamShortName: 'NZL',  teamFlag: 'nz', goals: 2, assists: 0 },
  { playerName: 'Julián Quiñones',  teamName: 'Mexico',           teamShortName: 'MEX',  teamFlag: 'mx', goals: 1, assists: 0 },
];
