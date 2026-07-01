// src/lib/knockoutUtils.ts
// Utilidades compartidas para la fase eliminatoria
// Usadas tanto por KnockoutBracket.tsx como por HomeKnockoutSection.tsx

export const STAGE_ALIASES: Record<string, string> = {
  LAST_32:                 'LAST_32',
  ROUND_OF_32:             'LAST_32',
  PRELIMINARY_ROUND:       'LAST_32',
  LAST_16:                 'LAST_16',
  ROUND_OF_16:             'LAST_16',
  QUARTER_FINALS:          'QUARTER_FINALS',
  QUARTER_FINAL:           'QUARTER_FINALS',
  SEMI_FINALS:             'SEMI_FINALS',
  SEMI_FINAL:              'SEMI_FINALS',
  THIRD_PLACE:             'THIRD_PLACE',
  THIRD_PLACE_PLAY_OFF:    'THIRD_PLACE',
  FINAL:                   'FINAL',
};

export const normalizeStage = (stage: string): string =>
  STAGE_ALIASES[stage] ?? stage;

export const STAGE_LABELS: Record<string, string> = {
  LAST_32:        'Ronda de 32',
  LAST_16:        'Octavos de Final',
  QUARTER_FINALS: 'Cuartos de Final',
  SEMI_FINALS:    'Semifinales',
  THIRD_PLACE:    'Tercer Puesto',
  FINAL:          'Final',
};

// Orden de progresión (de menos avanzado a más avanzado)
export const STAGE_PROGRESSION = [
  'LAST_32',
  'LAST_16',
  'QUARTER_FINALS',
  'SEMI_FINALS',
  'THIRD_PLACE',
  'FINAL',
] as const;
