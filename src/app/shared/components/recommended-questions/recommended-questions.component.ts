import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-recommended-questions',
  standalone: true,
  imports: [TranslateModule,CommonModule],
  templateUrl: './recommended-questions.component.html',
  styleUrl: './recommended-questions.component.css'
})
export class RecommendedQuestionsComponent {
  lang:any;
  RecommendedQuestion:boolean=false
  isRakeezWebsiteAuthorized: boolean = false;
  isRakeezWebsiteSafeForElectronicPayment: boolean = false;
  doesRakeezIncreaseThePriceInsuranceCompaniesRates: boolean = false;
  isTheProcessOfPurchasing: boolean = false;
  whatAreTheCustomerServiceChannels: boolean = false;
  generalQuestion1: boolean = false;
  generalQuestion2: boolean = false;
  generalQuestion3: boolean = false;
  generalQuestion4: boolean = false;
  generalQuestion5: boolean = false;
  generalQuestion6: boolean = false;
  generalQuestion7: boolean = false;
  generalQuestion8: boolean = false;
  generalQuestion9: boolean = false;

  constructor(private activatedRoute:ActivatedRoute){}
  ngOnInit(): void {
    this.snapshotUrl();
  }
  snapshotUrl(){
    this.activatedRoute.paramMap.subscribe(params => {
      this.lang = params.get('lang');
    })
  }

   toggleQuestion(question:  keyof RecommendedQuestionsComponent) {
    this[question] = !this[question];
  }

}
