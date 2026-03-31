export interface Stadium {
  id: string;
  name: string;
  city: string;
  country: 'USA' | 'Mexico' | 'Canada';
  capacity: number;
  matchesAssigned: number;
  coordinates: [number, number];
  phases: string[];
  imageUrl: string;
  avgTemp: string;
}

export const STADIUMS: Stadium[] = [
  {
    id: 'att-stadium',
    name: "AT&T Stadium",
    city: 'Arlington, Texas',
    country: 'USA',
    capacity: 94000,
    matchesAssigned: 0,
    coordinates: [32.7473, -97.0945],
    phases: [],
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/c/c5/Cowboys_stadium_inside_view_4.JPG',
    avgTemp: 'N/D'
  },
  {
    id: 'azteca',
    name: 'Estadio Azteca',
    city: 'Ciudad de México',
    country: 'Mexico',
    capacity: 83000,
    matchesAssigned: 0,
    coordinates: [19.3029, -99.1505],
    phases: [],
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/c/c1/Soccer_game_at_the_Azteca_Stadium.JPG',
    avgTemp: 'N/D'
  },
  {
    id: 'metlife',
    name: 'MetLife Stadium',
    city: 'East Rutherford, New Jersey',
    country: 'USA',
    capacity: 82500,
    matchesAssigned: 0,
    coordinates: [40.8135, -74.0744],
    phases: [],
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/5/54/Copa_America_game_between_Columbia_vs_Peru_at_the_MetLife_Stadium.jpg',
    avgTemp: 'N/D'
  },
  {
    id: 'mercedes-benz',
    name: 'Mercedes-Benz Stadium',
    city: 'Atlanta, Georgia',
    country: 'USA',
    capacity: 75000,
    matchesAssigned: 0,
    coordinates: [33.7553, -84.4006],
    phases: [],
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/c/cb/2017_Orlando_City_at_Atlanta_United_MLS_Game.jpg',
    avgTemp: 'N/D'
  },
  {
    id: 'arrowhead',
    name: 'GEHA Field at Arrowhead Stadium',
    city: 'Kansas City, Missouri',
    country: 'USA',
    capacity: 73000,
    matchesAssigned: 0,
    coordinates: [39.0489, -94.4840],
    phases: [],
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/1/10/25_July_2010_Kansas_City_Wizards_vs_Manchester_United_friendly.jpg',
    avgTemp: 'N/D'
  },
  {
    id: 'nrg',
    name: 'NRG Stadium',
    city: 'Houston, Texas',
    country: 'USA',
    capacity: 72000,
    matchesAssigned: 0,
    coordinates: [29.6847, -95.4107],
    phases: [],
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/b/b9/NRG_Stadium%2C_LEAGUES_CUP_2024_TIGRES_INTER_MIAMI.jnp.jpg',
    avgTemp: 'N/D'
  },
  {
    id: 'levis',
    name: "Levi's Stadium",
    city: 'Santa Clara, California',
    country: 'USA',
    capacity: 71000,
    matchesAssigned: 0,
    coordinates: [37.4030, -121.9700],
    phases: [],
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/0/00/Entering_Levi%27s_Stadium.JPG',
    avgTemp: 'N/D'
  },
  {
    id: 'sofi',
    name: 'SoFi Stadium',
    city: 'Inglewood, California',
    country: 'USA',
    capacity: 70000,
    matchesAssigned: 0,
    coordinates: [33.9535, -118.3392],
    phases: [],
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/d/d9/SoFi_Stadium_23rd_March_2025.jpg',
    avgTemp: 'N/D'
  },
  {
    id: 'lincoln-financial',
    name: 'Lincoln Financial Field',
    city: 'Philadelphia, Pennsylvania',
    country: 'USA',
    capacity: 69000,
    matchesAssigned: 0,
    coordinates: [39.9008, -75.1675],
    phases: [],
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/6/6a/United_States_v_Paraguay%2C_Copa_Am%C3%A9rica_Centenario_%28cropped%29.jpg',
    avgTemp: 'N/D'
  },
  {
    id: 'lumen',
    name: 'Lumen Field',
    city: 'Seattle, Washington',
    country: 'USA',
    capacity: 69000,
    matchesAssigned: 0,
    coordinates: [47.5952, -122.3316],
    phases: [],
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/1/1f/2025_FIFA_Club_World_Cup_-_Seattle_Sounders_FC_vs._Botafogo_-_03.jpg',
    avgTemp: 'N/D'
  },
  {
    id: 'gillette',
    name: 'Gillette Stadium',
    city: 'Foxborough, Massachusetts',
    country: 'USA',
    capacity: 65000,
    matchesAssigned: 0,
    coordinates: [42.0909, -71.2643],
    phases: [],
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/e/e7/New_England_Revolution_vs_Liga_Deportivo_Alajuense_2024-03-06_53571677017.jpg',
    avgTemp: 'N/D'
  },
  {
    id: 'hard-rock',
    name: 'Hard Rock Stadium',
    city: 'Miami Gardens, Florida',
    country: 'USA',
    capacity: 65000,
    matchesAssigned: 0,
    coordinates: [25.9580, -80.2389],
    phases: [],
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/0/01/Hard_Rock_Stadium_Club_World_Cup.jpg',
    avgTemp: 'N/D'
  },
  {
    id: 'bc-place',
    name: 'BC Place',
    city: 'Vancouver, British Columbia',
    country: 'Canada',
    capacity: 54000,
    matchesAssigned: 0,
    coordinates: [49.2767, -123.1120],
    phases: [],
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/f/ff/BC_Place_2015_Women%27s_FIFA_World_Cup.jpg',
    avgTemp: 'N/D'
  },
  {
    id: 'estadio-bbva',
    name: 'Estadio BBVA',
    city: 'Guadalupe, Nuevo León',
    country: 'Mexico',
    capacity: 53500,
    matchesAssigned: 0,
    coordinates: [25.6692, -100.2449],
    phases: [],
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/2/2f/Estadio_BBVA_Bancomer_-_Diciembre_2017.jpg',
    avgTemp: 'N/D'
  },
  {
    id: 'estadio-akron',
    name: 'Estadio Akron',
    city: 'Zapopan, Jalisco',
    country: 'Mexico',
    capacity: 48000,
    matchesAssigned: 0,
    coordinates: [20.6829, -103.4621],
    phases: [],
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/1/10/Estadio_Akron_02-07-2022_cabecera_sur_lado_derecho_%283%29.jpg',
    avgTemp: 'N/D'
  },
  {
    id: 'bmo-field',
    name: 'BMO Field',
    city: 'Toronto, Ontario',
    country: 'Canada',
    capacity: 45000,
    matchesAssigned: 0,
    coordinates: [43.6332, -79.4186],
    phases: [],
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/d/dd/Bmo_Field_2016_East_Stand.jpg',
    avgTemp: 'N/D'
  }
];
