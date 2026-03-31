const API_KEY = import.meta.env.VITE_FOOTBALL_DATA_API_KEY || '';
const BASE_URL = 'https://api.football-data.org/v4';

export const api = {
  async fetch(endpoint: string) {
    const res = await fetch(`${BASE_URL}${endpoint}`, {
      headers: { 'X-Auth-Token': API_KEY }
    });
    if (!res.ok) throw new Error('API Error');
    return res.json();
  },
  async getLiveMatches() { return this.fetch('/competitions/WC/matches?status=LIVE'); },
  async getStandings() { return this.fetch('/competitions/WC/standings'); },
  async getScorers() { return this.fetch('/competitions/WC/scorers'); },
  // Métodos que faltaban:
  async getTopScorers(limit: number = 10) { 
    return this.fetch(`/competitions/WC/scorers?limit=${limit}`); 
  },
  async getTeamById(id: number) { 
    return this.fetch(`/teams/${id}`); 
  }
};