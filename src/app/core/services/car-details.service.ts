import { Injectable } from '@angular/core';
import { environment } from '../../shared/environment/environment';
import { HttpClient } from '@angular/common/http';
import { CarDetails } from '../interfaces/car-details';
import { Observable } from 'rxjs';
import { ResponseApi } from '../../shared/interfaces/response-api';
import { GetCarInfo } from '../interfaces/get-car-info';

@Injectable({
  providedIn: 'root'
})
export class CarDetailsService {
  private ownerInfoApi = environment.apiUrl+'/UserAdditionalInfo';

  constructor(private httpClient :HttpClient) { }

  addOwnerAdditionInfo(body:CarDetails):Observable<ResponseApi<null>>
  {
    return this.httpClient.post<ResponseApi<null>>(`${this.ownerInfoApi}/AddOwnerAdditionInfo`, body);
  }
}
