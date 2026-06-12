const API_KEY = import.meta.env.VITE_FOOTBALL_DATA_API_KEY || '';
const BASE_URL = 'https://api.football-data.org/v4';
const PROXY_URL = '/.netlify/functions/football-data';
const THESPORTSDB_PROXY_URL = '/.netlify/functions/thesportsdb';

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
    if (!res.ok) {
      const detail = await res.text();
      throw new Error(`API Error ${res.status}${detail ? `: ${detail}` : ''}`);
    }
    return res.json();
  },
  async getLiveMatches() {
    const today = new Date();
    const from = new Date(today); from.setDate(today.getDate() - 1);
    const to = new Date(today); to.setDate(today.getDate() + 2);
    const fmt = (d: Date) => d.toISOString().split('T')[0];
    return this.fetch('/competitions/WC/matches', { dateFrom: fmt(from), dateTo: fmt(to) });
  },
  async getStandings() { return this.fetch('/competitions/WC/standings'); },
  async getScorers() { return this.fetch('/competitions/WC/scorers'); },
  async getMatches(params: { dateFrom?: string; dateTo?: string; stage?: string; status?: string } = {}) {
    const cleanParams: Record<string, string> = {};
    Object.entries(params).forEach(([key, value]) => {
      if (value) cleanParams[key] = value;
    });
    return this.fetch('/competitions/WC/matches', cleanParams);
  },
  async getAllMatches() {
    return this.fetch('/competitions/WC/matches');
  },
  async getCompetitionTeams() {
    return this.fetch('/competitions/WC/teams');
  },
  async getFallbackTeamByName(name: string) {
    const query = new URLSearchParams({ endpoint: '/searchteams.php', t: name }).toString();
    const res = await fetch(`${THESPORTSDB_PROXY_URL}?${query}`);
    if (!res.ok) throw new Error('Fallback API Error');
    return res.json();
  },
  async getFallbackPlayersByTeamId(teamId: string) {
    const query = new URLSearchParams({ endpoint: '/lookup_all_players.php', id: teamId }).toString();
    const res = await fetch(`${THESPORTSDB_PROXY_URL}?${query}`);
    if (!res.ok) throw new Error('Fallback API Error');
    return res.json();
  },
  async getTopScorers(limit: number = 10) { 
    return this.fetch('/competitions/WC/scorers', { limit: String(limit) }); 
  },
  async getTeamById(id: number) { 
    return this.fetch(`/teams/${id}`); 
  },
  async getPlayerPhotos(names: string[], teamName?: string) {
    const res = await fetch('/.netlify/functions/player-photos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ names, ...(teamName ? { teamName } : {}) }),
    });
    if (!res.ok) throw new Error('No se pudieron cargar las fotos');
    return res.json() as Promise<{ photos: Record<string, string | null> }>;
  },
  async getPlayerPhotoFromApiFootball(playerId: number): Promise<string> {
    return `https://media.api-sports.io/football/players/${playerId}.png`;
  },
  async getWorldCupNews() {
    const res = await fetch('/.netlify/functions/news-rss');
    if (!res.ok) throw new Error('No se pudieron cargar las noticias');
    return res.json() as Promise<{ items: Array<{
      title: string;
      summary: string;
      category: string;
      source: string;
      date: string;
      emoji: string;
      tags: string[];
      url: string;
    }> }>;
  },
};
