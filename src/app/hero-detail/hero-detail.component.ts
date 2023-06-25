import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { Hero } from '../hero';
import { HeroService } from '../services/hero/hero.service';
import { CategoriesService } from '../services/categories/categories.service';

@Component({
  selector: 'app-hero-detail',
  templateUrl: './hero-detail.component.html',
  styleUrls: ['./hero-detail.component.css'],
})
export class HeroDetailComponent implements OnInit {
  hero: Hero | undefined;
  categories: Array<string> = ['Mutant', 'Flyer', 'Psychic'];

  constructor(
    private route: ActivatedRoute,
    private heroService: HeroService,
    private location: Location,
    private categoriesService: CategoriesService
  ) {}

  ngOnInit(): void {
    this.getHero();
  }

  getHero(): void {
    const id = parseInt(this.route.snapshot.paramMap.get('id')!, 10);
    this.categoriesService.getHeroesInfo().subscribe((hero) => {
      this.hero = hero.find((hero) => hero.id === id);
    });
  }

  goBack(): void {
    this.location.back();
  }

  save(): void {
    if (this.hero) {
      this.heroService.updateHero(this.hero).subscribe(() => {
        this.goBack();
      });
    }
  }
}
