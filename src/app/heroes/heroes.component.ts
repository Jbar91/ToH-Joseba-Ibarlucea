import { Component, OnInit } from '@angular/core';

import { Hero } from '../hero';
import { HeroService } from '../hero.service';
import { CategoriesService } from '../services/categories.service';
import { MessageService } from '../message.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-heroes',
  templateUrl: './heroes.component.html',
  styleUrls: ['./heroes.component.css'],
})
export class HeroesComponent implements OnInit {
  heroes: Hero[] = [];
  categories: Array<string> = ['-Display All-', 'Mutant', 'Flyer', 'Psychic'];

  constructor(
    private heroService: HeroService,
    protected categoriesService: CategoriesService,
    protected messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.getHeroesInfo();
  }

  getHeroesInfo() {
    this.categoriesService.getHeroesInfo().subscribe((heroes) => {
      this.heroes = heroes;
      this.categoriesService.heroesInfo$.next(this.heroes);
    });
  }

  getHeroOptions() {
    this.categoriesService.getHeroesInfo().subscribe((heroes) => {
      this.heroes = heroes;
    });
  }

  add(name: string, category: string): void {
    name = name.trim();
    if (!name) {
      return this.log('Please enter a name');
    }

    if (category === '-Display All-') {
      return this.log('Please select a category');
    }

    this.heroService.addHero({ name, category } as Hero).subscribe((hero) => {
      this.heroes.push(hero);
      this.categoriesService.heroesInfo$.next([...this.heroes]);
      this.filterHeroes(category);
    });
  }

  delete(hero: Hero): void {
    this.heroes = this.heroes.filter((h) => h !== hero);
    this.categoriesService.heroesInfo$.next(this.heroes);
    this.heroService.deleteHero(hero.id).subscribe();
  }

  filterHeroes(category: string) {
    if (category === '-Display All-') {
      this.getHeroesInfo();
    } else {
      this.getHeroOptions();
      this.heroes = this.heroes.filter((hero) => hero.category === category);
      this.categoriesService.heroesInfo$.next(this.heroes);
    }
  }

  log(message: string) {
    this.messageService.add(`HeroesComponent: ${message}`);
  }
}
