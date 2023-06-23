import { Hero } from './hero';

export const HEROESID: Pick<Hero, 'id'>[] = [
  { id: 12 },
  { id: 13 },
  { id: 14 },
  { id: 15 },
  { id: 16 },
  { id: 17 },
  { id: 18 },
  { id: 19 },
  { id: 20 },
];

export const HEROESINFO: Omit<Hero, 'id'>[] = [
  { name: 'Dr. Nice', category: 'Mutant' },
  { name: 'Bombasto', category: 'Mutant' },
  { name: 'Celeritas', category: 'Flyer' },
  { name: 'Magneta', category: 'Psychic' },
  { name: 'RubberMan', category: 'Mutant' },
  { name: 'Dynama', category: 'Flyer' },
  { name: 'Dr. IQ', category: 'Psychic' },
  { name: 'Magma', category: 'Mutant' },
  { name: 'Tornado', category: 'Mutant' },
];
