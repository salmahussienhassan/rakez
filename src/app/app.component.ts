import { Component, CUSTOM_ELEMENTS_SCHEMA, Inject } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterLink, RouterOutlet } from '@angular/router';
import { LangService } from './shared/services/lang.service';
import { HeaderComponent } from './shared/components/header/header.component';
import { FooterComponent } from './shared/components/footer/footer.component';
import { DOCUMENT } from '@angular/common';
import { HomeComponent } from './core/components/home/home.component';
import { NgxSpinnerModule } from 'ngx-spinner';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [NgxSpinnerModule ,RouterOutlet,RouterLink,HeaderComponent,FooterComponent,HomeComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppComponent {
  title = 'rakez';
  showNav: boolean = true;
  showHeader: boolean = false;
  direction: string = 'rtl';
  lang ='ar';
  constructor(@Inject(DOCUMENT)  private document: Document,private router: Router,
   private activatedRoute: ActivatedRoute,private langService:LangService){}
  ngOnInit(): void {
    this.langService.languageChanged.subscribe(lang => {
      this.direction = lang === 'ar' ? 'rtl' : 'ltr';
    })

    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        const firstChild = this.activatedRoute.firstChild;
        if (firstChild && (firstChild.snapshot.routeConfig?.path === ':lang/profile'
          || firstChild.snapshot.routeConfig?.path?.includes('register')
          || firstChild.snapshot.routeConfig?.path?.includes('login')
          || firstChild.snapshot.routeConfig?.path?.includes('login-verify')
          || firstChild.snapshot.routeConfig?.path?.includes('reset-password')
          || firstChild.snapshot.routeConfig?.path?.includes('otp')
          || firstChild.snapshot.routeConfig?.path?.includes('check-email')
          || firstChild.snapshot.routeConfig?.path === '**'
        )) {
          this.showNav = false;
        } else {
          this.showNav = true;
        }
        if (firstChild && (firstChild.snapshot.routeConfig?.path === ':lang/home')||
          firstChild && (firstChild.snapshot.routeConfig?.path === '')) {
          this.showHeader = false;
        } else {
          this.showHeader = true;
        }

      }
    });
  }
}
