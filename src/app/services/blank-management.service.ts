import { Injectable } from '@angular/core';
import {Observable, Subject} from "rxjs";
import {GameBlankSet} from "../interfaces/blank/game-blank-set";

@Injectable({
  providedIn: 'root'
})
export class BlankManagementService {

  blankSetAdded: Subject<GameBlankSet> = new Subject<GameBlankSet>();
  blankSetRemoved: Subject<GameBlankSet> = new Subject<GameBlankSet>();

  constructor() { }

  getBlankSetAdded(): Observable<GameBlankSet> {
    return this.blankSetAdded.asObservable();
  }

  addBlankSet(blankSet: GameBlankSet) {
    this.blankSetAdded.next(blankSet);
  }

  getBlankSetRemoved(): Observable<GameBlankSet> {
    return this.blankSetRemoved.asObservable();
  }

  removeBlankSet(blankSet: GameBlankSet) {
    this.blankSetRemoved.next(blankSet);
  }
}
