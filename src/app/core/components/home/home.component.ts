import { CUSTOM_ELEMENTS_SCHEMA, Component, Input, ChangeDetectorRef, AfterViewChecked, OnInit } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CarInfoComponent } from '../car/car-info/car-info.component';
import { Values, Services, Partner, ResponseApi, WhyRakez } from '../../../shared/interfaces/response-api';
import { ApiService } from '../../../shared/services/api.service';
import { MedicalInfoComponent } from '../medical/medical-info/medical-info.component';
import { MalpracticeInfoComponent } from '../malpractice/malpractice-info/malpractice-info.component';
import { TravelInfoComponent } from '../travel/travel-info/travel-info.component';
import { HomeActiveFormService } from '../../../shared/services/home-active-form.service';
import { DataService } from '../../../shared/services/data.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    TranslateModule,
    CarInfoComponent,
    MedicalInfoComponent,
    MalpracticeInfoComponent,
    TravelInfoComponent,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  insuranceTypeCar: boolean = true;
  insuranceTypeMedical: boolean = false;
  insuranceTypeMalpractice: boolean = false;
  insuranceTypeTravel:boolean = false;
  whyRakez:WhyRakez[] = [];
  ourValues:Values[] = [];
  ourServices:Services[] = [];
  ourServicesActive:Services[] = [];
  ourServicesInActive:Services[] = [];
  ourPartners:Partner[] = [];
  ourPartnersActive:Partner[] = [];
  ourPartnersInActive:Partner[] = [];
  lang:any;
  currentUrl:string = '';
  type:any;
  showMore: boolean = false;
  startIndex: number = 0;
  interval: any;

  constructor(
    private quick: ApiService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private homeActiveFormService: HomeActiveFormService,
    private cdr: ChangeDetectorRef,
    private dataService: DataService) {}

  ngOnInit(): void {
    this.snapshotUrl();
    this.homeActiveFormService.formIndex$.subscribe((index) => {
      this.type = index;
      this.cdr.detectChanges();
    }); 
  }


  snapshotUrl() {
    this.activatedRoute.paramMap.subscribe((params) => {
      this.lang = params.get('lang');
      this.currentUrl = this.activatedRoute.snapshot.url.join('/').substring(3);
      this.router.navigate([`${this.lang}/home`]);
      this.callingAPIs(this.lang);
    });
  }

  callingAPIs(language:string){
    this.quick.getWhyRakez(language).subscribe((data:ResponseApi<WhyRakez[]>)=>{
      if(data.statusCode == 200 || data.statusCode == 204){
        this.whyRakez = data.data
      }
    });
    this.quick.getOurValues(language).subscribe((data:ResponseApi<Values[]>)=>{
      if(data.statusCode == 200 || data.statusCode == 204){
        this.ourValues = data.data
      }
    });
    this.quick.getOurServices(language).subscribe((data:ResponseApi<Services[]>)=>{
      if(data.statusCode == 200 || data.statusCode == 204){
        this.ourServices = data.data
        this.ourServicesActive = this.ourServices.slice(0,3);
        this.ourServicesInActive = this.ourServices.slice(0,3);
      }
    });
    this.quick.getPartners().subscribe((data: ResponseApi<Partner[]>) => {
      if (data.statusCode == 200 || data.statusCode == 204) {
        this.ourPartners = data.data;
        this.updateActiveImages();
        this.interval = setInterval(() => {
          this.updateActiveImages();
        }, 1000);
      }
    });
  }

  updateActiveImages() {
    const totalImages = this.ourPartners.length;
    this.startIndex = (this.startIndex + 1) % totalImages;
    let endIndex = this.startIndex + 6;
    // If endIndex exceeds the total number of images, wrap around
    if (endIndex > totalImages) {
        this.ourPartnersActive = [
            ...this.ourPartners.slice(this.startIndex),
            ...this.ourPartners.slice(0, this.startIndex % totalImages),
        ];
    }
     else {
        this.ourPartnersActive = this.ourPartners.slice(this.startIndex, endIndex);
    }
  }

  ngOnDestroy() {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }

  selectInsuranceType(type: number) {
    if (type == 1) {
      this.insuranceTypeCar = true;
      this.insuranceTypeMedical = false;
      this.insuranceTypeMalpractice = false;
      this.insuranceTypeTravel = false;
    } else if (type == 4) {
      this.insuranceTypeCar = false;
      this.insuranceTypeMedical = true;
      this.insuranceTypeMalpractice = false;
      this.insuranceTypeTravel = false;
    } else if (type == 5) {
      this.insuranceTypeCar = false;
      this.insuranceTypeMedical = false;
      this.insuranceTypeMalpractice = true;
      this.insuranceTypeTravel = false;
    } else if (type == 6) {
      this.insuranceTypeCar = false;
      this.insuranceTypeMedical = false;
      this.insuranceTypeMalpractice = false;
      this.insuranceTypeTravel = true;
    }

    this.type = type;
  }

  showMoreRakez(){
    this.showMore =!this.showMore;
  }

  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

}
