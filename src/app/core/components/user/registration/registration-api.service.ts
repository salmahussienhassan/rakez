import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs'
import { Login } from './interfaces/login';
import { ForgetPass } from './interfaces/forget-pass';
import { VerifyOtp } from './interfaces/verify-otp';
import { ResetPass } from './interfaces/reset-pass';
import { environment } from '../../../../shared/environment/environment';
import { ResponseApi, registrationResponse } from '../../../../shared/interfaces/response-api';
import { Registration } from './interfaces/registration';
import { CheckPhone } from './interfaces/check-phone';

@Injectable({
  providedIn: 'root'
})
export class RegistrationApiService {

  private login = environment.apiAccountUrl+'/login';
  private login2FA = environment.apiAccountUrl+'/login-2FA';
  private register = environment.apiAccountUrl+'/Register';
  private confirmEmail = environment.apiAccountUrl+'/confirmEmail';
  private forgotPassword = environment.apiAccountUrl+'/forgot-password';
  private verifyOtp = environment.apiAccountUrl+'/verify-otp';
  private resetPassword = environment.apiAccountUrl+'/reset-password';
  private resendOtp = environment.apiAccountUrl+'/resend-otp';
  private offerOtp = environment.apiAccountUrl+'/GetOffersOtp';

  private authenticationStatusSubject: BehaviorSubject<boolean>;

  constructor( private httpClient :HttpClient) {
    this.authenticationStatusSubject = new BehaviorSubject<boolean>(false);
  }

  get authenticationStatus(): Observable<boolean> {
    return this.authenticationStatusSubject.asObservable();
  }

  postLogin(body:Login):Observable<ResponseApi<registrationResponse>>
  {
    return this.httpClient.post<ResponseApi<registrationResponse>>(`${this.login}`, body);
  }

  postLogin2AF(code:string, identityNumber:string):Observable<ResponseApi<registrationResponse>>
  {
    return this.httpClient.post<ResponseApi<registrationResponse>>(`${this.login2FA}?code=${code}&identityNumber=${identityNumber}`, {})
    .pipe(
      tap(res=>{
        if(res){
          console.log(res);
          this.authenticationStatusSubject.next(true);
        }
      })
    );;;
  }

  postRegister(role:string , body:Registration):Observable<ResponseApi<registrationResponse>>
  {
    return this.httpClient.post<ResponseApi<registrationResponse>>(`${this.register}?role=${role}`,body);
  }

  getConfirmEmail(token:string , email:string):Observable<ResponseApi<null>>
  {
    return this.httpClient.get<ResponseApi<null>>(`${this.confirmEmail}?token=${token}&email=${email}`);
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }

  postForgetPost(body:ForgetPass)
  {
    return this.httpClient.post(`${this.forgotPassword}`, body);
  }

  postVerifyOtp(body:VerifyOtp)
  {
    return this.httpClient.post(`${this.verifyOtp}`, body)
  }

  postResendOtp(body:ForgetPass)
  {
    return this.httpClient.post(`${this.resendOtp}`, body);
  }

  postResetPass(body:ResetPass)
  {
    return this.httpClient.post(`${this.resetPassword}`, body);
  }

  checkEmail(body:CheckPhone)
  {
    return this.httpClient.post(`${this.offerOtp}`, body);
  }
}
