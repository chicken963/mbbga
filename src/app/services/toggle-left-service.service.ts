import { Injectable } from '@angular/core';
import {Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ToggleLeftServiceService {

  private eventSource = new Subject<boolean>();

  showLeftBar: boolean = true;

  event$ = this.eventSource.asObservable();

  emitEvent() {
    this.showLeftBar = !this.showLeftBar
    this.eventSource.next(this.showLeftBar);
  }
}
