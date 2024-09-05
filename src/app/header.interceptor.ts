import { loginGuard } from './shared/guards/login.guard';
import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AccountinfoService } from './shared/services/accountinfo.service';

export const headerInterceptor: HttpInterceptorFn = (request, next) => {
  const accountService = inject(AccountinfoService)
  const cloneRequest = request.clone({
    setHeaders: {
      Authorization: `Bearer ${accountService.token}`
    }
  });

  return next(cloneRequest);
}


