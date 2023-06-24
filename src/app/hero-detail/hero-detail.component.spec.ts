import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HeroDetailComponent } from './hero-detail.component';
import { HeroService } from '../hero.service';
import { CategoriesService } from '../services/categories.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { mockHeroes } from 'src/mocks/test.mocks';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';

describe('Given HeroDetailComponent', () => {
  let component: HeroDetailComponent;
  let fixture: ComponentFixture<HeroDetailComponent>;
  let heroService: HeroService;
  let categoriesService: CategoriesService;

  const mockCategoriesService = {
    getHeroesInfo: jasmine
      .createSpy('getHeroesInfo')
      .and.returnValue(of(mockHeroes)),
  };

  const mockHeroService = {
    updateHero: jasmine.createSpy('updateHero').and.callFake((hero) => {
      return of(...mockHeroes, hero);
    }),
  };

  const mockRoute = {
    snapshot: {
      paramMap: {
        get: () => '1',
      },
    },
  };

  const mockLocation = jasmine.createSpyObj('Location', ['back']);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule, FormsModule],
      declarations: [HeroDetailComponent],
      providers: [
        { provide: HeroService, useValue: mockHeroService },
        { provide: CategoriesService, useValue: mockCategoriesService },
        { provide: ActivatedRoute, useValue: mockRoute },
        { provide: Location, useValue: mockLocation },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HeroDetailComponent);
    component = fixture.componentInstance;
    categoriesService = TestBed.inject(CategoriesService);
    heroService = TestBed.inject(HeroService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('When ngOnInit is called', () => {
    it('should call getHero', () => {
      const getHero = spyOn(component, 'getHero');
      const heroesInfo = categoriesService.getHeroesInfo;

      component.ngOnInit();

      expect(getHero).toHaveBeenCalled();
      expect(heroesInfo).toHaveBeenCalled();
    });
  });

  describe('When getHero is called', () => {
    describe("And there's a valid id in the params", () => {
      it('Should call getHeroesInfo from CategoriesService and set the hero property', () => {
        const getHeroInfo = spyOn(component, 'getHero').and.callThrough();
        const expectedHero = mockHeroes[0];

        component.getHero();
        const hero = component.hero;

        expect(getHeroInfo).toHaveBeenCalled();
        expect(hero).toEqual(expectedHero);
      });

      it("Should render the found hero's name in the input", () => {
        const expectedHero = mockHeroes[0];
        const compiled = fixture.nativeElement;
        const heroName = compiled.querySelector('input').value;

        component.getHero();
        fixture.detectChanges();

        expect(heroName).toContain(expectedHero.name);
      });
    });

    describe("And there's not a valid id in the params", () => {
      it('Should call getHeroesInfo from CategoriesService and the her property should be undefined', () => {
        mockRoute.snapshot.paramMap.get = () => '0';
        const getHeroInfo = spyOn(component, 'getHero').and.callThrough();
        const expectedHero = undefined;

        component.getHero();
        const hero = component.hero;

        expect(getHeroInfo).toHaveBeenCalled();
        expect(hero).toEqual(expectedHero);
      });
    });
  });

  describe('When the goBack method is called', () => {
    it('Should call the location.back method', () => {
      const goBack = spyOn(component, 'goBack').and.callThrough();
      component.goBack();
      expect(goBack).toHaveBeenCalled();
    });
  });

  describe('When the save method is called', () => {
    describe("And there's a valid hero", () => {
      it('Should call the updateHero method from HeroService', () => {
        component.hero = mockHeroes[0];
        const heroUpdate = heroService.updateHero;
        spyOn(component, 'save').and.callThrough();

        component.save();

        expect(heroUpdate).toHaveBeenCalledWith(mockHeroes[0]);
      });
    });

    describe("And there's not a valid hero", () => {
      it('Should not call the updateHero method from HeroService', () => {
        component.hero = undefined;
        const goBack = spyOn(component, 'goBack');
        spyOn(component, 'save').and.callThrough();

        component.save();

        expect(goBack).not.toHaveBeenCalled();
      });
    });
  });
});
