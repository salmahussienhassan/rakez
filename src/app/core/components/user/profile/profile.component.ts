import { CommonModule, ViewportScroller } from '@angular/common';
import { Component, ElementRef, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink, RouterOutlet } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { LangService } from '../../../../shared/services/lang.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [RouterOutlet,RouterLink, TranslateModule,CommonModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {
  open:boolean=false
  close:boolean=true
  activeIndex: string = '';
  email:any;
  name:any;
  lang:any;
  userInfo:any;
  currentUrl:string = '';
  isAccountInfoVisible: boolean = false;
  isStatistics: boolean = false;
  constructor( router: Router,private viewportScroller: ViewportScroller,
    private langService:LangService, private activatedRoute: ActivatedRoute,
    private eRef: ElementRef) { 
   this.activeIndex =  router.url.substring(router.url.lastIndexOf('/')+1);
  }

  ngOnInit(): void {
     this.activatedRoute.paramMap.subscribe(params => {
      this.lang = params.get('lang');
      this.langService.currentLang = this.lang;
      console.log(this.langService.currentLang);
    })
     this.userInfo = localStorage.getItem('registerData')
    this.email= JSON.parse(this.userInfo).email;
    this.name=JSON.parse(this.userInfo).displayName;
     console.log(this.email)
     this.activeIndex = 'accountInformation';
   }

   ToggleClose(){
    this.close= !this.close
    this.open=true;
   }

    
   @HostListener('document:click', ['$event'])
   clickout(event: any) {
     if (this.open && !this.eRef.nativeElement.contains(event.target)) {
      this.close= true
      this.open=false;
     }
   }
 
   toggleOpenAndClose(){
    this.close=true;
    this.open=false;
   }
   
   showAccountInfo() {
    this.isAccountInfoVisible = !this.isAccountInfoVisible;
  }

  showStatistics() {
    this.isStatistics = !this.isStatistics;
  }
   scrollToTop() {
    this.viewportScroller.scrollToPosition([0, 0]);
  }

  setActive(index: string) {
    this.activeIndex = index;
  }
}
