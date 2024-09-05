import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  public activeIconSubject = new BehaviorSubject<string>('');
  private languageSubject = new BehaviorSubject<string>('ar');
  public showNav = new BehaviorSubject<boolean>(true);
  public showHeader = new BehaviorSubject<boolean>(false);
  
  language$ = this.languageSubject.asObservable();
  
  constructor(router: Router) {
    this.activeIconSubject.next(router.url.substring(router.url.lastIndexOf('/') + 1));
   }
  setActiveIcon(icon: string) {
    this.activeIconSubject.next(icon);
  }
  getActiveIcon() {
    return this.activeIconSubject.value;
  }

  setShowNav(showNav: boolean) {
    this.showNav.next(showNav);
  }
  getShowNav() {
    return this.showNav.value;
  }

}
