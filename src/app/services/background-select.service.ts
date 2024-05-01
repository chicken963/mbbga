import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable, Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class BackgroundSelectService {

  private selectedRadioButton = new Subject<number>();

  getSelectedRadioButton(): Observable<number> {
    return this.selectedRadioButton.asObservable();
  }

  setSelectedRadioButton(index: number): void {
    this.selectedRadioButton.next(index);
  }
}
