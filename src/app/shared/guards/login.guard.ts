import { CanActivateFn, Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID, inject } from '@angular/core';
import { LangService } from '../services/lang.service';

export const loginGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const platformId = inject(PLATFORM_ID);
  const langService = inject(LangService);

  if (isPlatformBrowser(platformId)) {
    console.log('asd');
    if (localStorage.getItem('token')) {
      return true;
    } else {
      langService.language$.subscribe(lang=>{
        console.log(lang);
        router.navigate([`${lang}/login`]);
      })
      return false;
    }
  }
  else {
    return false;
  }
};
