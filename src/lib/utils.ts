import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combina clases de Tailwind de forma segura evitando duplicados.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Helper para obtener código de bandera desde código ISO 3166-1 alpha-3 al alpha-2 requerido por flag-icons
 */
export function getCountryCode(tla: string): string {
  const FLAG_CODES: Record<string, string> = {
    ARG: 'ar', BRA: 'br', FRA: 'fr', ESP: 'es', DEU: 'de', ENG: 'gb-eng',
    POR: 'pt', NLD: 'nl', BEL: 'be', HRV: 'hr', MEX: 'mx', USA: 'us',
    CAN: 'ca', URY: 'uy', COL: 'co', CHI: 'cl', ECU: 'ec', PER: 'pe',
    BOL: 'bo', VEN: 've', PAR: 'py', MAR: 'ma', SEN: 'sn', CMR: 'cm',
    TUN: 'tn', NGA: 'ng', GHA: 'gh', CIV: 'ci', MLI: 'ml', ZAF: 'za',
    COD: 'cd', HTI: 'ht', JPN: 'jp', KOR: 'kr', AUS: 'au', IRN: 'ir',
    SAU: 'sa', QAT: 'qa', IRQ: 'iq', UZB: 'uz', IND: 'in', JOR: 'jo',
    NZL: 'nz', SUI: 'ch', AUT: 'at', SCO: 'gb-sct', NOR: 'no', SWE: 'se',
    TUR: 'tr', SVK: 'sk', ALB: 'al', SVN: 'si', GEO: 'ge', ISL: 'is',
    CPV: 'cv', BIH: 'ba', CZE: 'cz', DZA: 'dz',
  };
  return FLAG_CODES[tla] ?? tla.toLowerCase().slice(0, 2);
}

/**
 * Helper para formatear fechas de partidos
 */
export function formatMatchDate(dateStr: string, locale = 'es-AR'): string {
  return new Date(dateStr).toLocaleDateString(locale, {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
}