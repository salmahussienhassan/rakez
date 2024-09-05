import { Component, ElementRef, HostListener, Inject} from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterLink, RouterOutlet } from '@angular/router';
import { LangService } from '../../services/lang.service';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule, DOCUMENT, UpperCasePipe, ViewportScroller } from '@angular/common';
import { HomeActiveFormService } from '../../services/home-active-form.service';
import { RegistrationApiService } from '../../../core/components/user/registration/registration-api.service';
import { DataService } from '../../services/data.service';
import { RegistrationDataService } from '../../services/registration-data.service';
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterOutlet,RouterLink, TranslateModule,CommonModule,UpperCasePipe],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  open:boolean=false
  close:boolean=true
  activeIndex: string = '';
  activeIndex1: string = '';
  email:any
  langText:string = 'en';
  langUrl:string = 'ar';
  currentUrl: string = '';
  userLoggedIn:boolean = false;
  vehicleInsurance:boolean = false;
  name:any;
  mainNavBar: boolean = true;
  headerHomePage:boolean = true;
  registrationData:any ={};
  registerData:any;
  userData:any;

  constructor(private router: Router,
    private langService:LangService,
    private activatedRoute:ActivatedRoute,
    @Inject(DOCUMENT) private document: Document,
     private viewportScroller: ViewportScroller,
     private homeActiveFormService: HomeActiveFormService,
     private registerApi: RegistrationApiService,
    private dataService:DataService,
    private eRef: ElementRef
  ) { 
   this.activeIndex =  router.url.substring(router.url.lastIndexOf('/')+1);
  }

  ngOnInit(): void {
    this.currentUrl = this.activatedRoute.snapshot.url.join('/');
    this.registerApi.authenticationStatus.subscribe(()=>{
    this.userLoggedIn = this.registerApi.isAuthenticated();
    })
    
    this.registerData = localStorage.getItem('registerData');
    if(this.registerData !==  "[object Object]"){
      this.userData = JSON.parse(this.registerData);
      this.registrationData = this.userData;
      console.log("registrationData", this.registrationData);
    }
    this.changeCssFile(this.langUrl);
    this.activeIndex = 'home';
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        const firstChild = this.activatedRoute.firstChild;       
        if(firstChild && (firstChild.snapshot.routeConfig?.path===':lang/home'))
        {
            this.dataService.showHeader.next(true);
            this.headerHomePage = true;
        }    
        else{
          this.dataService.showHeader.next(false);
          this.headerHomePage = false;
        }  
        
        if (firstChild && (firstChild.snapshot.routeConfig?.path === ':lang/profile')){
          this.dataService.setShowNav(false);
        }
        else{
          this.dataService.setShowNav(true);
        }
     }
   });
   this.dataService.showNav.subscribe(data=>{
    this.mainNavBar = data;
    console.log(this.mainNavBar);
    
   })
  }

  ToggleClose(){
    this.close= !this.close
    this.open=true;
    console.log("close:",this.close,"open:",this.open)
   }
 
   @HostListener('document:click', ['$event'])
   clickout(event: any) {
     if (this.open && !this.eRef.nativeElement.contains(event.target)) {
      this.close= true
      this.open=false;
     }
   }
 


  changeLanguage(lang:string) {
    this.langText = lang === 'ar' ? 'en' : 'ar';
    this.langUrl = lang === 'ar' ? 'ar' : 'en';
    const currentUrl = this.router.url.substring(4);
    this.router.navigate([`${this.langUrl}/${currentUrl}`]);
    this.changeCssFile(this.langUrl);
    this.langService.setLanguage(this.langUrl);
  }

  changeCssFile(lang: string) {
    let headTag = this.document.getElementsByTagName("head")[0] as HTMLHeadElement;
    let existingLink = this.document.getElementById("langCss") as HTMLLinkElement;
    let bundleName = lang === 'ar' ? "arabicStyle.css" : "englishStyle.css";
    if (existingLink) {
      existingLink.href = bundleName;
    }
    else{
      let newLink = this.document.createElement("link");
      newLink.rel = "stylesheet";
      newLink.id = "langCss";
      newLink.href = bundleName;
      headTag.appendChild(newLink);
    }
  }


  setActive(index: string) {
    this.activeIndex = index;
  }

  setActive1(index: string) {
    this.activeIndex1 = index;
  }

  chooseVehicleInsurance(){
    this.vehicleInsurance = !this.vehicleInsurance
  }

  onLinkClick(index : number) {
    this.homeActiveFormService.setActiveForm(true , index);
    this.toggleOpenAndClose();
    this.scrollToTop();
  }

  toggleOpenAndClose(){
    this.close=true;
    this.open=false;
   }

   scrollToTop() {
    this.viewportScroller.scrollToPosition([0, 0]);
  }

  login(){
    this.router.navigate([`${this.langUrl}/login`])
  }

  logout(){
    localStorage.setItem('isLoggedIn', 'false');
    localStorage.removeItem('token')
    this.router.navigate(["/"]);
    window.location.reload();
  }

  profile(){
    this.router.navigate([`${this.langUrl}/profile`])
  }

  back(){
    window.history.back();
  }

}
