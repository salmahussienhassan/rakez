import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class HomeActiveFormService {
  public _isActive = new BehaviorSubject<boolean>(false);
  homeIsActive$ = this._isActive.asObservable();

  public _index = new BehaviorSubject<number>(1);
  formIndex$ = this._index.asObservable();

  setActiveForm(homeIsActive: boolean , formIndex: number) {
    this._isActive.next(homeIsActive);
    this._index.next(formIndex);
  }
}
