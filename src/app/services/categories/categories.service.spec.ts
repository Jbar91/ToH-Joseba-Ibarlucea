import { TestBed } from '@angular/core/testing';

import { CategoriesService } from './categories.service';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { HeroService } from '../hero/hero.service';
import { of } from 'rxjs';
import { mockHeroes, mockIdHeroes } from 'src/mocks/test.mocks';
import { Hero } from 'src/app/hero';

describe('CategoriesService', () => {
  let service: CategoriesService;
  let controller: HttpTestingController;

  const mockHeroesService = {
    getHeroes: jasmine.createSpy('getHeroes').and.returnValue(of(mockIdHeroes)),
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        {
          provide: HeroService,
          useValue: mockHeroesService,
        },
      ],
    });
    service = TestBed.inject(CategoriesService);
    controller = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('Should have an array of heroes', () => {
    const heroes = service.heroes;

    expect(heroes).toEqual([]);
  });

  it('Should have a BehaviorSubject of heroesInfo with initial values', () => {
    let heroInfo: Hero[] = [];

    service.heroesInfo$.subscribe((info) => {
      heroInfo = info;
    });
    const initialInfo = [{ id: 0, name: '', category: '' }];

    expect(heroInfo).toEqual(initialInfo);
  });

  describe('When the getHeroesInfo method is called', () => {
    describe("And there's no errors", () => {
      it("Should call the getHeroes method from the heroService and set the heroes property with it's response", () => {
        service.getHeroesInfo().subscribe();

        const firstHeroId = service.heroes[0].id;
        const fisrtExpectedId = mockIdHeroes[0].id;

        expect(firstHeroId).toEqual(fisrtExpectedId);
      });

      it('Should send a get request to the heroesUrl', () => {
        service.getHeroesInfo().subscribe((heroes) => {
          expect(heroes).toEqual(mockHeroes);
        });

        const req = controller.expectOne(service['heroesUrl']);
        expect(req.request.method).toEqual('GET');
        req.flush(mockHeroes);
      });
    });

    describe("And there's an error", () => {
      it('Should call the handleError method and log an error on console', () => {
        service.getHeroesInfo().subscribe({
          error: (err) => {
            expect(err).toBeTruthy();
          },
        });
        const error = spyOn(console, 'error');

        const req = controller.expectOne(service['heroesUrl']);
        expect(req.request.method).toEqual('GET');
        req.error(new ProgressEvent('error'));

        expect(error).toHaveBeenCalled();
      });
    });
  });
});
