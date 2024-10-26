import { Injectable } from '@angular/core';
import {Round} from "../interfaces/round";

@Injectable({
  providedIn: 'root'
})
export class RoundSortService {

  constructor() { }

  public sortRounds(r1: Round, r2: Round) {
    return r1.indexInGame - r2.indexInGame;
  }
}
