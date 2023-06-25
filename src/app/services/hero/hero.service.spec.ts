import { TestBed } from '@angular/core/testing';

import { HeroService } from './hero.service';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { of } from 'rxjs';
import { mockAddHero, mockHeroes, mockIdHeroes } from 'src/mocks/test.mocks';
import { Hero } from 'src/app/hero';

describe('HeroService', () => {
  let service: HeroService;
  let controller: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(HeroService);
    controller = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('When the getHeroes method is called', () => {
    describe("And there's no errors", () => {
      it("Should return an Observable of heroes with heroes id's", () => {
        service.getHeroes().subscribe((heroes) => {
          expect(heroes).toEqual(mockIdHeroes as Hero[]);
        });

        const req = controller.expectOne(service['heroesIdUrl']);

        expect(req.request.method).toBe('GET');

        req.flush(mockIdHeroes);
      });
    });

    describe("And there's an error", () => {
      it('Should return an empty Observable of heroes and log an error', () => {
        service.getHeroes().subscribe((heroes) => {
          expect(heroes).toEqual([]);
        });
        const consoleErrorSpy = spyOn(console, 'error');

        const req = controller.expectOne(service['heroesIdUrl']);

        expect(req.request.method).toBe('GET');

        req.flush(null, { status: 404, statusText: 'Not Found' });

        expect(consoleErrorSpy).toHaveBeenCalled();
      });
    });

    describe('When the getHero method is called', () => {
      describe("And there's a valid id", () => {
        it('Should return an Observable of hero', () => {
          const id = 1;
          service.getHero(id).subscribe((hero) => {
            expect(hero).toEqual(mockHeroes[0]);
          });

          const req = controller.expectOne(`${service['heroesIdUrl']}/${id}`);

          expect(req.request.method).toBe('GET');

          req.flush(mockHeroes[0]);
        });
      });

      describe("And there's an invalid id", () => {
        it('Should return an Observable of undefined and log an error', () => {
          const id = 10;
          service.getHero(id).subscribe((hero) => {
            expect(hero).toBeUndefined();
          });

          const consoleErrorSpy = spyOn(console, 'error');

          const req = controller.expectOne(`${service['heroesIdUrl']}/${id}`);

          expect(req.request.method).toBe('GET');

          req.flush(null, { status: 404, statusText: 'Not Found' });

          expect(consoleErrorSpy).toHaveBeenCalled();
        });
      });
    });

    describe('When the getHeroNo404 method is called', () => {
      describe("And there's a valid id", () => {
        it('Should return an Observable of hero', () => {
          const id = 2;
          service.getHeroNo404(id).subscribe((hero) => {
            expect(hero).toEqual(mockHeroes[0]);
          });

          const req = controller.expectOne(
            `${service['heroesIdUrl']}/?id=${id}`
          );

          expect(req.request.method).toBe('GET');

          req.flush(mockHeroes);
        });
      });

      describe("And there's an invalid id", () => {
        it('Should return an Observable of undefined and log an error', () => {
          const id = 1;
          service.getHeroNo404(id).subscribe((hero) => {
            expect(hero).toBeUndefined();
          });

          const req = controller.expectOne(
            `${service['heroesIdUrl']}/?id=${id}`
          );

          expect(req.request.method).toBe('GET');

          req.flush(mockAddHero);
        });
      });
    });
  });

  describe('When the searchHeroes method is called', () => {
    describe("And there's a valid term", () => {
      it('Should return an Observable of heroes', () => {
        const term = 'te';
        service.searchHeroes(term).subscribe((heroes) => {
          expect(heroes).toEqual(mockHeroes);
        });

        const req = controller.expectOne(
          `${service['heroesCategoriesURL']}/?name=${term}`
        );

        expect(req.request.method).toBe('GET');

        req.flush(mockHeroes);
      });
    });

    describe("And there's no matching term", () => {
      it('Should return an Observable of empty array and log an error', () => {
        const term = 'Gary';
        service.searchHeroes(term).subscribe((heroes) => {
          expect(heroes).toEqual([]);
        });

        const req = controller.expectOne(
          `${service['heroesCategoriesURL']}/?name=${term}`
        );

        expect(req.request.method).toBe('GET');

        req.flush([]);
      });
    });

    describe("And there's an invalid term", () => {
      it('Should return an Observable of empty array and log an error', () => {
        const term = '';
        service.searchHeroes(term).subscribe((heroes) => {
          expect(heroes).toEqual([]);
        });
      });
    });
  });

  describe('When the addHero method is called', () => {
    describe("And there's a valid hero", () => {
      it('Should return an Observable of hero', () => {
        const hero = mockAddHero;
        service.addHero(hero).subscribe((hero) => {
          expect(hero).toEqual(mockAddHero);
        });

        const req = controller.expectOne(service['heroesIdUrl']);

        expect(req.request.method).toBe('POST');

        req.flush(mockAddHero);
      });
    });
  });

  describe('When the deleteHero method is called', () => {
    describe("And there's a valid id", () => {
      it('Should return an Observable of hero', () => {
        const id = 4;
        service.deleteHero(id).subscribe((hero) => {
          expect(hero).toEqual(mockHeroes[3]);
        });

        const req = controller.expectOne(`${service['heroesIdUrl']}/${id}`);

        expect(req.request.method).toBe('DELETE');

        req.flush(mockHeroes[3]);
      });
    });
  });

  describe('When the updateHero method is called', () => {
    describe("And there's a valid hero", () => {
      it('Should return an Observable of hero', () => {
        const modifiedHero = { ...mockHeroes[0], name: 'Rick' };

        service.updateHero(modifiedHero).subscribe((hero) => {
          expect(hero.name).toEqual(modifiedHero.name);
        });

        const req = controller.expectOne(service['heroesIdUrl']);

        expect(req.request.method).toBe('PUT');

        req.flush(modifiedHero);
      });
    });
  });

  describe('When the handleError method is called without an specified operation', () => {
    it('Should return an empty Observable of heroes and log an error', () => {
      const consoleErrorSpy = spyOn(console, 'error');

      service['handleError'](undefined, [])(new Error('Error'));

      expect(consoleErrorSpy).toHaveBeenCalled();
    });
  });
});
