import { Injectable } from '@angular/core';
import { environment } from '../environment/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { DropdownValues, Partner, ResponseApi, Services, Values, WhyRakez, verifyCode } from '../interfaces/response-api';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private dropdown = environment.apiUrl+'/Shared/GetValuesOFDropDownByIdForUser';
  private verification = environment.apiUrl+'/VerificationCode/generate-verification-code';
  private whyRakez = environment.apiUrl+'/WhyQuick/GetWhyQuickForUser';
  private ourValues = environment.apiUrl+'/Values/GetValuesForUser';
  private ourServices = environment.apiUrl+'/Services/GetServicesForUser';
  private partners = environment.apiUrl+'/Parteners/GetPartenersForUser';
  private tabby =   environment.apiUrl+'/Payment/TabyCheckout';

  constructor( private httpClient :HttpClient) {}

  getDropDown(id:number,language:string):Observable<ResponseApi<DropdownValues[]>>{
    const lang = language == "en"? new HttpHeaders().set('Accept-Language', 'en') : new HttpHeaders().set('Accept-Language', 'ar');
    return this.httpClient.get<ResponseApi<DropdownValues[]>>(`${this.dropdown}?id=${id}`,{headers: lang});
  }

  getVerificationCode(){
    return this.httpClient.get<verifyCode>(`${this.verification}`);
  }

  getWhyRakez(language:string):Observable<ResponseApi<WhyRakez[]>>{
    const lang = language == "en"? new HttpHeaders().set('Accept-Language', 'en') : new HttpHeaders().set('Accept-Language', 'ar');
    return this.httpClient.get<ResponseApi<WhyRakez[]>>(`${this.whyRakez}`, {headers: lang});
  }

  getOurValues(language:string):Observable<ResponseApi<Values[]>>{
    const lang = language == "en"? new HttpHeaders().set('Accept-Language', 'en') : new HttpHeaders().set('Accept-Language', 'ar');
    return this.httpClient.get<ResponseApi<Values[]>>(`${this.ourValues}`, {headers: lang});
  }

  getOurServices(language:string):Observable<ResponseApi<Services[]>>{
    const lang = language == "en"? new HttpHeaders().set('Accept-Language', 'en') : new HttpHeaders().set('Accept-Language', 'ar');
    return this.httpClient.get<ResponseApi<Services[]>>(`${this.ourServices}`, {headers: lang});
  }

  getPartners():Observable<ResponseApi<Partner[]>>{
    return this.httpClient.get<ResponseApi<Partner[]>>(`${this.partners}`);
  }

  UploadMedia(formData:FormData):Observable<any>{
    return this.httpClient.post<any>(`${environment.apiUrl}/Quotation/UploadMedia`,formData);
  }

  tappyPayment(body: any) {
    return this.httpClient.post<any>(`${environment.apiUrl}/Payment/TabyCheckout`, body);
  }
}
