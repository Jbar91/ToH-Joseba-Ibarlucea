import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HeroesComponent } from './heroes.component';
import { HeroService } from '../hero.service';
import { CategoriesService } from '../services/categories.service';
import { MessageService } from '../message.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { BehaviorSubject, of } from 'rxjs';
import {
  mockAddHero,
  mockDeleteHeroes,
  mockHeroes,
  mockInitialHeroes,
  mockNoCategoryHero,
  mockNoNameHero,
} from 'src/mocks/test.mocks';
import { Hero } from '../hero';

describe('Given HeroesComponent', () => {
  let component: HeroesComponent;
  let fixture: ComponentFixture<HeroesComponent>;
  let heroService: HeroService;
  let categoriesService: CategoriesService;
  let messageService: MessageService;

  const mockCategoriesService = {
    getHeroesInfo: jasmine
      .createSpy('getHeroesInfo')
      .and.returnValue(of(mockHeroes)),
    heroesInfo$: new BehaviorSubject<Hero[]>(mockInitialHeroes),
  };

  const mockHeroService = {
    addHero: jasmine.createSpy('addHero').and.callFake(() => {
      return of(mockAddHero);
    }),
    deleteHero: jasmine.createSpy('deleteHero').and.callFake(() => {
      return of(mockDeleteHeroes);
    }),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      declarations: [HeroesComponent],
      providers: [
        { provide: HeroService, useValue: mockHeroService },
        { provide: CategoriesService, useValue: mockCategoriesService },
        MessageService,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HeroesComponent);
    component = fixture.componentInstance;
    categoriesService = TestBed.inject(CategoriesService);
    messageService = TestBed.inject(MessageService);
    heroService = TestBed.inject(HeroService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeDefined();
  });

  describe('When ngOnInit is called', () => {
    it('Should call GetHeroesInfo', () => {
      const heroesInfo = spyOn(component, 'getHeroesInfo');

      component.ngOnInit();

      expect(heroesInfo).toHaveBeenCalled();
    });
  });

  describe('When getHeroesInfo method is called', () => {
    it('Should call GetHeroesInfo from CategoriesService', () => {
      component.getHeroesInfo();

      expect(categoriesService.getHeroesInfo).toHaveBeenCalled();
    });

    it('Should call getHeroesInfo from CategoriesService and set the heroes array', () => {
      const heroesInfo = spyOn(component, 'getHeroesInfo').and.callThrough();
      const heroes = component.heroes;

      component.getHeroesInfo();

      expect(heroesInfo).toHaveBeenCalled();
      expect(heroes).toEqual(mockHeroes);
    });

    it('Should render the available heroes list', () => {
      const compiled = fixture.nativeElement;
      const heroes = compiled.querySelectorAll('li');

      component.getHeroesInfo();

      expect(heroes.length).toEqual(3);
    });
  });

  describe('When getHeroesOptions method is called', () => {
    it('Should call getHeroesInfo from CategoriesService', () => {
      component.getHeroOptions();

      expect(categoriesService.getHeroesInfo).toHaveBeenCalled();
    });

    it('Should set the heroes array with the heroes options', () => {
      const heroes = component.heroes;
      component.getHeroOptions();

      expect(heroes).toEqual(mockHeroes);
    });
  });

  describe('When add method is called', () => {
    describe("And the hero's name is empty", () => {
      it("Should call the log method with a 'Please enter a name for the hero'", () => {
        const log = spyOn(messageService, 'add').and.callThrough();
        component.add(mockNoNameHero.name, mockNoNameHero.category);

        expect(log).toHaveBeenCalledWith(
          'HeroesComponent: Please enter a name'
        );
      });
    });

    describe("And the hero's category is -Display All-", () => {
      it("Should call the log method with a 'Please select a category'", () => {
        const log = spyOn(messageService, 'add').and.callThrough();
        component.add(mockNoCategoryHero.name, mockNoCategoryHero.category);

        expect(log).toHaveBeenCalledWith(
          'HeroesComponent: Please select a category'
        );
      });
    });

    describe("And there's a name and the category is not -Display All-", () => {
      it('Should call the addHero method from HeroService', () => {
        component.add(mockAddHero.name, mockAddHero.category);

        expect(heroService.addHero).toHaveBeenCalled();
      });
    });
  });

  describe('When delete method is called', () => {
    it('Should call the deleteHero method from HeroService', () => {
      const hero = mockHeroes[0];
      component.delete(hero);

      expect(heroService.deleteHero).toHaveBeenCalledWith(hero.id);
    });

    it("Should filter the heroes array and remove the hero that's being deleted", () => {
      const hero = mockHeroes[0];
      component.delete(hero);
      const deletedHeroes = component.heroes;

      expect(hero).not.toBe(deletedHeroes[0]);
    });
  });

  describe('When the filerHeroes Method is called', () => {
    describe('And the category is -Display All-', () => {
      it('Should call the getHeroesInfo method', () => {
        const getHeroesInfo = spyOn(
          component,
          'getHeroesInfo'
        ).and.callThrough();
        component.filterHeroes('-Display All-');

        expect(getHeroesInfo).toHaveBeenCalled();
      });
    });

    describe('And the category is not -Display All-', () => {
      it('Should call the getHeroesInfo method and filter the heroes array by the category', () => {
        const heroOptions = spyOn(
          component,
          'getHeroOptions'
        ).and.callThrough();
        component.filterHeroes('Flyer');

        expect(heroOptions).toHaveBeenCalled();
        expect(component.heroes).toEqual([mockHeroes[1]]);
      });
    });
  });
});
