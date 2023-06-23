import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, catchError, map, of, tap } from 'rxjs';
import { Hero } from '../hero';
import { MessageService } from '../message.service';
import { HeroService } from '../hero.service';

@Injectable({
  providedIn: 'root',
})
export class CategoriesService {
  private heroesUrl = 'api/heroesInfo';

  heroes: Hero[] = [];
  heroesInfo$: BehaviorSubject<Hero[]>;

  constructor(
    private http: HttpClient,
    private messageService: MessageService,
    private heroService: HeroService
  ) {
    this.heroesInfo$ = new BehaviorSubject([{ id: 0, name: '', category: '' }]);
  }

  getHeroesInfo(): Observable<Hero[]> {
    this.heroService.getHeroes().subscribe((heroes) => (this.heroes = heroes));

    return this.http.get<Hero[]>(this.heroesUrl).pipe(
      map((heroesCategories) => {
        heroesCategories.map((hero, index) => {
          this.heroes[index].category = hero.category;
          this.heroes[index].name = hero.name;
        });
        return this.heroes;
      }),
      tap((_) => this.log('fetched heroes info')),
      catchError(this.handleError<Hero[]>('getHeroesInfo'))
    );
  }

  private handleError<T>(operation: string, result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);

      this.log(`${operation} failed: ${error.message}`);

      return of(result as T);
    };
  }

  private log(message: string) {
    this.messageService.add(`HeroService: ${message}`);
  }
}
