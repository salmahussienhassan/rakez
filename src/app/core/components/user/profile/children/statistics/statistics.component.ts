import { TranslateModule } from '@ngx-translate/core';
import { Component } from '@angular/core';
import { OffersComponent } from '../offers/offers.component';
import { ProgramPromotionsComponent } from '../program-promotions/program-promotions.component';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-statistics',
  standalone: true,
  imports: [TranslateModule, RouterLink],
  templateUrl: './statistics.component.html',
  styleUrl: './statistics.component.css'
})

export class StatisticsComponent {
  lang:any;
  constructor(private router: Router, private activatedRoute: ActivatedRoute) { }
  ngOnInit(): void {
    this.snapshotUrl();
  }

  snapshotUrl(){
    this.activatedRoute.paramMap.subscribe(params => {
      this.lang = params.get('lang');
    })
  }

  routerLink(link: string): void {
    this.router.navigate([`${this.lang}/profile/${link}`])
  }
}
