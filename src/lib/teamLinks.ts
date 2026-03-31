import type { Team } from '../types/api';

export const slugifyTeamName = (name: string) =>
  name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');

export const getTeamLink = (team: Team) => {
  const slug = slugifyTeamName(team.name);
  return `/selecciones/${team.id}-${slug}`;
};
