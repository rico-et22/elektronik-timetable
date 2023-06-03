export type DayIndex = 0 | 1 | 2 | 3 | 4 | 6;

export type ShortDayName =
  'Pon.' | 'Wt.' | 'Śr.' | 'Czw.' | 'Pt.' | 'Sob.' | 'Ndz.';
export const shortDayNames: readonly ShortDayName[] = [
  'Pon.',
  'Wt.',
  'Śr.',
  'Czw.',
  'Pt.',
  'Sob.',
  'Ndz.',
];

// used in fetchReplacements
export type ShortDayNameLowerCase =
  | 'pon.'
  | 'wt.'
  | 'śr.'
  | 'czw.'
  | 'pt.'
  | 'sob.'
  | 'ndz.';
export const shortDayNamesLowerCase: readonly ShortDayNameLowerCase[] = [
  'pon.',
  'wt.',
  'śr.',
  'czw.',
  'pt.',
  'sob.',
  'ndz.',
];
