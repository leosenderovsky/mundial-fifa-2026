const API_KEY = import.meta.env.VITE_FOOTBALL_DATA_API_KEY || '';
const BASE_URL = 'https://api.football-data.org/v4';
const PROXY_URL = '/.netlify/functions/football-data';

export const api = {
  async fetch(endpoint: string, params: Record<string, string> = {}) {
    const query = new URLSearchParams(params).toString();
    const isDirect = Boolean(API_KEY);
    const url = isDirect
      ? `${BASE_URL}${endpoint}${query ? `?${query}` : ''}`
      : `${PROXY_URL}?${new URLSearchParams({ endpoint, ...params }).toString()}`;

    const res = await fetch(url, {
      headers: API_KEY ? { 'X-Auth-Token': API_KEY } : undefined
    });
    if (!res.ok) throw new Error('API Error');
    return res.json();
  },
  async getLiveMatches() { return this.fetch('/competitions/WC/matches', { status: 'LIVE' }); },
  async getStandings() { return this.fetch('/competitions/WC/standings'); },
  async getScorers() { return this.fetch('/competitions/WC/scorers'); },
  async getMatches(params: { dateFrom?: string; dateTo?: string; stage?: string; status?: string } = {}) {
    const cleanParams: Record<string, string> = {};
    Object.entries(params).forEach(([key, value]) => {
      if (value) cleanParams[key] = value;
    });
    return this.fetch('/competitions/WC/matches', cleanParams);
  },
  async getTopScorers(limit: number = 10) { 
    return this.fetch('/competitions/WC/scorers', { limit: String(limit) }); 
  },
  async getTeamById(id: number) { 
    return this.fetch(`/teams/${id}`); 
  }
};
