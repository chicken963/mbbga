import {Injectable} from '@angular/core';
import {Observable, Subject} from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class CreateRoundCloseService {

    private closeCreateRoundPopupSubject: Subject<boolean> = new Subject<boolean>();

    constructor() {
    }

    getCloseRoundPopupState(): Observable<boolean> {
        return this.closeCreateRoundPopupSubject.asObservable();
    }

    setCloseRoundPopupState(state: boolean) {
      this.closeCreateRoundPopupSubject.next(state);
    }
}
