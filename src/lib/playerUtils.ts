export function normalizePosition(position: string): string {
  const p = position.toLowerCase();
  if (p.includes('goal')) return 'Goalkeeper';
  if (p.includes('def')) return 'Defence';
  if (p.includes('mid')) return 'Midfield';
  if (p.includes('off') || p.includes('for') || p.includes('att') || p.includes('strik') || p.includes('wing')) {
    return 'Offence';
  }
  return position;
}
