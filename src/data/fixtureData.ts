export interface StaticTeam {
  name: string;
  nameEs: string;
  flag: string; // código ISO 2 letras para flag-icons (ej: 'ar', 'gb-eng', 'gb-sct')
  crestUrl?: string; // https://crests.football-data.org/XXX.svg
}

export interface StaticGroup {
  key: string; // 'GROUP_A', etc.
  label: string; // 'Grupo A'
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

export const STATIC_TEAMS = STATIC_GROUPS.flatMap((group) => 
  group.teams.map((team) => ({
    id: Math.floor(Math.random() * 1000000), // Random ID for keying
    name: team.nameEs,
    shortName: team.name,
    tla: team.flag.toUpperCase(),
    crest: undefined,
    flag: team.flag
  }))
);
export const STATIC_MATCHES = [
  {
    id: 1,
    utcDate: '2026-06-11T19:00:00Z',
    status: 'SCHEDULED',
    matchday: 1,
    stage: 'GROUP_STAGE',
    group: 'GROUP_A',
    homeTeam: { id: 1, name: 'México', crest: 'https://crests.football-data.org/MEX.svg' },
    awayTeam: { id: 2, name: 'Sudáfrica', crest: 'https://crests.football-data.org/ZAF.svg' },
  },
  {
    id: 2,
    utcDate: '2026-06-12T15:00:00Z',
    status: 'SCHEDULED',
    matchday: 1,
    stage: 'GROUP_STAGE',
    group: 'GROUP_D',
    homeTeam: { id: 3, name: 'Estados Unidos', crest: 'https://crests.football-data.org/USA.svg' },
    awayTeam: { id: 4, name: 'Australia', crest: 'https://crests.football-data.org/AUS.svg' },
  },
  {
    id: 3,
    utcDate: '2026-06-12T18:00:00Z',
    status: 'SCHEDULED',
    matchday: 1,
    stage: 'GROUP_STAGE',
    group: 'GROUP_B',
    homeTeam: { id: 5, name: 'Canadá', crest: 'https://crests.football-data.org/CAN.svg' },
    awayTeam: { id: 6, name: 'Suiza', crest: 'https://crests.football-data.org/CHE.svg' },
  },
  {
    id: 4,
    utcDate: '2026-06-13T21:00:00Z',
    status: 'SCHEDULED',
    matchday: 1,
    stage: 'GROUP_STAGE',
    group: 'GROUP_J',
    homeTeam: { id: 7, name: 'Argentina', crest: 'https://crests.football-data.org/ARG.svg' },
    awayTeam: { id: 8, name: 'Argelia', crest: 'https://crests.football-data.org/DZA.svg' },
  }
];
