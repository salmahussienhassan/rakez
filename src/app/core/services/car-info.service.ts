import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../shared/environment/environment';
import { ResponseApi } from '../../shared/interfaces/response-api';
import { CarInfo } from '../interfaces/car-info';

@Injectable({
  providedIn: 'root'
})
export class CarInfoService {
  private newInsuranceApi = environment.apiUrl+'/Insurance/AddNewInsurance';
  private transferOwnershipApi = environment.apiUrl+'/Insurance/AddTransferOwnershipData';
  private customCardApi = environment.apiUrl+'/Insurance/AddCustomCard';
  totalPrice = new BehaviorSubject<number>(0);
  vehicleInfo = new BehaviorSubject<any>(null);

  constructor(private httpClient :HttpClient) { }

  addNewInsurance(body:CarInfo):Observable<ResponseApi<null>>
  {
    return this.httpClient.post<ResponseApi<null>>(`${this.newInsuranceApi}?=`, body);
  }

  addTransferOwnership(body:CarInfo):Observable<ResponseApi<null>>
  {
    return this.httpClient.post<ResponseApi<null>>(`${this.transferOwnershipApi}`, body);
  }

  addCustomCard(body:CarInfo):Observable<ResponseApi<null>>
  {
    return this.httpClient.post<ResponseApi<null>>(`${this.customCardApi}`, body);
  }
  

}
