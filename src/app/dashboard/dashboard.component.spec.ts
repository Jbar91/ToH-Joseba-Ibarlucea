import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { RouterModule } from '@angular/router';
import { of } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HeroSearchComponent } from '../hero-search/hero-search.component';
import { HEROESINFO } from '../mock-heroes';

import { DashboardComponent } from './dashboard.component';
import { CategoriesService } from '../services/categories.service';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let categoriesService;
  let getHeroesSpy: jasmine.Spy;

  beforeEach(waitForAsync(() => {
    categoriesService = jasmine.createSpyObj('CategoriesService', [
      'getHeroesInfo',
    ]);
    getHeroesSpy = categoriesService.getHeroesInfo.and.returnValue(
      of(HEROESINFO)
    );
    TestBed.configureTestingModule({
      declarations: [DashboardComponent, HeroSearchComponent],
      imports: [RouterModule.forRoot([]), HttpClientTestingModule],
      providers: [
        { provide: CategoriesService, useValue: categoriesService },
        { provide: HttpClientTestingModule, useValue: HttpClientTestingModule },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should display "Top Heroes" as headline', () => {
    expect(fixture.nativeElement.querySelector('h2').textContent).toEqual(
      'Top Heroes'
    );
  });

  it('should call categoriesService', waitForAsync(() => {
    expect(getHeroesSpy.calls.any()).toBe(true);
  }));

  it('should display 4 links', waitForAsync(() => {
    expect(fixture.nativeElement.querySelectorAll('a').length).toEqual(4);
  }));
});
