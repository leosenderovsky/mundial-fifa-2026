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
    id: 'azteca',
    name: 'Estadio Azteca',
    city: 'Ciudad de México',
    country: 'Mexico',
    capacity: 87523,
    matchesAssigned: 5,
    coordinates: [19.3029, -99.1505],
    phases: ['Fase de Grupos', 'Inauguración', 'Ronda de 32', 'Octavos de Final'],
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Estadio_Azteca_2015.jpg/1200px-Estadio_Azteca_2015.jpg',
    avgTemp: '24°C'
  },
  {
    id: 'metlife',
    name: 'MetLife Stadium',
    city: 'New York/New Jersey',
    country: 'USA',
    capacity: 82500,
    matchesAssigned: 8,
    coordinates: [40.8128, -74.0742],
    phases: ['Fase de Grupos', 'Ronda de 32', 'Octavos de Final', 'Final'],
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3b/MetLife_Stadium_-_aerial.jpg/1200px-MetLife_Stadium_-_aerial.jpg',
    avgTemp: '28°C'
  },
  // ... (Se completarían los 16 estadios: Dallas, LA, Vancouver, Toronto, etc.)
  {
    id: 'bc-place',
    name: 'BC Place',
    city: 'Vancouver',
    country: 'Canada',
    capacity: 54500,
    matchesAssigned: 7,
    coordinates: [49.2767, -123.1120],
    phases: ['Fase de Grupos', 'Ronda de 32', 'Octavos de Final'],
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/BC_Place_Stadium_Vancouver.jpg/1200px-BC_Place_Stadium_Vancouver.jpg',
    avgTemp: '18°C'
  }
];