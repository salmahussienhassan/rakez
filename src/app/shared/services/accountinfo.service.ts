import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../environment/environment';

@Injectable({
  providedIn: 'root'
})
export class AccountinfoService {

  constructor(private httpClient:HttpClient,@Inject(PLATFORM_ID) private platformId: any,) { }

  BaseUrl:string=environment.apiUrl+'/UserProfile';
  BaseUrlAccount:string=environment.apiUrl+'/Accounts';
   Flag = new BehaviorSubject<string>('');

 SendOTPForUserMail():Observable<any>{
   return this.httpClient.get<any>(`${this.BaseUrl}/SendMail`);
 }
 
 CheckOTPForUserMail(form:any): Observable<any> {
   return this.httpClient.post<any>(`${this.BaseUrl}/CheckOTP`,form);
 }

 SendOtpToNewMail(email:any):Observable<any>{
   return this.httpClient.get<any>(`${this.BaseUrl}/SendMail?newEmail=${email}`);
 }

 CheckOTPForNewMail(form:any):Observable<any>{
   return this.httpClient.post<any>(`${this.BaseUrl}/CheckOTP`,form);
 }

 SendPasswordOtp(): Observable<any> {
   return this.httpClient.post<any>(`${this.BaseUrl}/SendPasswordOtp`,{});
 }

 VerifyPasswordOtp(form:any): Observable<any> {
   return this.httpClient.post<any>(`${this.BaseUrl}/VerifyPasswordOtp`,form);
 }

 UpdatePassword(form:any): Observable<any> {
   return this.httpClient.post<any>(`${this.BaseUrl}/UpdatePassword`,form);
 }

 DeleteUser(): Observable<any> {
   return this.httpClient.delete<any>(`${this.BaseUrl}/DeleteUser`);
 }

 set token(token:string){
   if (isPlatformBrowser(this.platformId)){
   localStorage.setItem('token',token);
   }
 }
 get token():string {
   if (isPlatformBrowser(this.platformId)){
    return localStorage.getItem('token') ?? '';
   }
   return '';
 }

 nationalAddress(identity:string , date:string ):Observable<any>{
  return this.httpClient.post<any>(`${this.BaseUrlAccount}/GetAddress?userIdentity=${identity}&date=${date}`,{});
 }

}
