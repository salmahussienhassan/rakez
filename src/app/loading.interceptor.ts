import { HttpInterceptorFn } from '@angular/common/http';
import { finalize } from 'rxjs';
import { NgxSpinnerService } from "ngx-spinner";
import { inject } from '@angular/core';

export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  const spinner = inject(NgxSpinnerService);
 
  spinner.show();
  return next(req).pipe(
    finalize(() => spinner.hide())
  );
};
