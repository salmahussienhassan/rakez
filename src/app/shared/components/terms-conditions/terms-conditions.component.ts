import { Component } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-terms-conditions',
  standalone: true,
  imports: [RouterLink, TranslateModule],
  templateUrl: './terms-conditions.component.html',
  styleUrl: './terms-conditions.component.css'
})
export class TermsConditionsComponent {
  lang:any;

  constructor(private activatedRoute:ActivatedRoute){}
  ngOnInit(): void {
    this.lang = localStorage.getItem('lang');
    console.log("y", this.lang)
   // this.snapshotUrl();
  }
  snapshotUrl(){
    this.activatedRoute.paramMap.subscribe(params => {
      this.lang = params.get('lang');
    })
  }
}
