import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { HeroSearchComponent } from './hero-search.component';
import { HeroService } from '../hero.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { mockHeroes } from 'src/mocks/test.mocks';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';

describe('Given HeroSearchComponent', () => {
  let component: HeroSearchComponent;
  let fixture: ComponentFixture<HeroSearchComponent>;
  let heroService: HeroService;

  const mockHeroService = {
    searchHeroes: (term: string) => {
      let heroes = mockHeroes.filter((hero) => hero.name.includes(term));
      return of(heroes);
    },
  };

  const mockLocation = jasmine.createSpyObj('Location', ['back']);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, FormsModule, RouterTestingModule],
      declarations: [HeroSearchComponent],
      providers: [
        { provide: HeroService, useValue: mockHeroService },
        { provide: Location, useValue: mockLocation },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HeroSearchComponent);
    component = fixture.componentInstance;
    heroService = TestBed.inject(HeroService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('When search is called', () => {
    it('Then searchTerms should be called', () => {
      const searchTerms = spyOn(component['searchTerms'], 'next');

      component.search('test');
      expect(searchTerms).toHaveBeenCalledWith('test');
    });
  });

  describe('When ngOnInit is called', () => {
    it('Then heroes$ should be called', () => {
      component.ngOnInit();

      expect(component.heroes$).toBeTruthy();
    });

    it('Should appear the list of matching heroes', fakeAsync(() => {
      fixture.detectChanges();

      spyOn(heroService, 'searchHeroes').and.returnValue(of(mockHeroes));

      const compiled = fixture.nativeElement;

      const input: HTMLInputElement = compiled.querySelector('input');

      input.value = 'test';
      input.dispatchEvent(new Event('input'));

      tick(300);
      fixture.detectChanges();

      const links: NodeListOf<HTMLAnchorElement> =
        compiled.querySelectorAll('a');

      expect(links.length).toBe(3);
      expect(links[0].textContent).toContain('test');
      expect(links[1].textContent).toContain('test2');
    }));
  });
});
