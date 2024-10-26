import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ErrorService {

  private errorFlag = new BehaviorSubject<boolean>(false);

  constructor() { }

  serError(value: boolean) {
    this.errorFlag.next(value);
  }

  getError(): Observable<boolean> {
    return this.errorFlag.asObservable();
  }


}
