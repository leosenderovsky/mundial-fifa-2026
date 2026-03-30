const API_KEY = import.meta.env.VITE_FOOTBALL_DATA_API_KEY || '';
const BASE_URL = 'https://api.football-data.org/v4';

export const api = {
  async fetch(url: string) {
    const res = await fetch(`${BASE_URL}${url}`, { headers: { 'X-Auth-Token': API_KEY }});
    if (!res.ok) throw new Error('Error de API');
    return res.json();
  },
  getLiveMatches: () => api.fetch('/competitions/WC/matches?status=LIVE'),
  getStandings: () => api.fetch('/competitions/WC/standings'),
  getScorers: () => api.fetch('/competitions/WC/scorers'),
};