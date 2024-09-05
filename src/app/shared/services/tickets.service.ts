import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../environment/environment';
import { ResponseApi, tickets } from '../interfaces/response-api';

@Injectable({
  providedIn: 'root'
})
export class TicketsService {

  constructor(private httpClient :HttpClient) { }
  private allTickets = environment.apiUrl+'/Tickets/GetTicketsForUser';

  createTicket(formData:FormData):Observable<any>{
    return this.httpClient.post<any>(`${environment.apiUrl}/Tickets/CreateTicket`,formData);
  }

  getTickets(language:string):Observable<ResponseApi<tickets[]>>{
    const lang = language == "en"? new HttpHeaders().set('Accept-Language', 'en') : new HttpHeaders().set('Accept-Language', 'ar');
    return this.httpClient.get<ResponseApi<tickets[]>>(`${this.allTickets}`,{headers: lang});
  }
}
