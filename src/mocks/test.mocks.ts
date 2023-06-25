import { Hero } from 'src/app/hero';

export const mockHeroes: Hero[] = [
  { name: 'test', category: 'Mutant', id: 1 },
  { name: 'test2', category: 'Flyer', id: 2 },
  { name: 'test3', category: 'Psychic', id: 3 },
];

export const mockIdHeroes = [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }];

export const mockHeroesCategories = [
  { name: 'test', category: 'Mutant' },
  { name: 'test2', category: 'Flyer' },
  { name: 'test3', category: 'Psychic' },
];

export const mockDeleteHeroes: Hero[] = [
  { name: 'test2', category: 'Flyer', id: 2 },
  { name: 'test3', category: 'Psychic', id: 3 },
];

export const mockInitialHeroes: Hero[] = [];

export const mockAddHero = { name: 'Pepe', category: 'Mutant', id: 4 };

export const mockNoNameHero = { name: '', category: 'Mutant' };

export const mockNoCategoryHero = { name: 'Pepe', category: '-Display All-' };
