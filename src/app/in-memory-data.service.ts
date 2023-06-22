import { Injectable } from '@angular/core';
import { InMemoryDbService } from 'angular-in-memory-web-api';
import { Hero } from './hero';

@Injectable({
  providedIn: 'root',
})
export class InMemoryDataService implements InMemoryDbService {
  createDb() {
    const heroes = [
      { id: 12, name: 'Dr. Nice', category: 'Mutant' },
      { id: 13, name: 'Bombasto', category: 'Mutant' },
      { id: 14, name: 'Celeritas', category: 'Flyer' },
      { id: 15, name: 'Magneta', category: 'Psychic' },
      { id: 16, name: 'RubberMan', category: 'Mutant' },
      { id: 17, name: 'Dynama', category: 'Flyer' },
      { id: 18, name: 'Dr. IQ', category: 'Psychic' },
      { id: 19, name: 'Magma', category: 'Mutant' },
      { id: 20, name: 'Tornado', category: 'Mutant' },
    ];
    return { heroes };
  }

  // Overrides the genId method to ensure that a hero always has an id.
  // If the heroes array is empty,
  // the method below returns the initial number (11).
  // if the heroes array is not empty, the method below returns the highest
  // hero id + 1.
  genId(heroes: Hero[]): number {
    return heroes.length > 0
      ? Math.max(...heroes.map((hero) => hero.id)) + 1
      : 11;
  }
}
