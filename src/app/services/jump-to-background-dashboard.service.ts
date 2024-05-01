import {Injectable} from '@angular/core';
import {Game} from "../interfaces/game";
import {BackgroundService} from "./background.service";
import {RoundBlankSet} from "../interfaces/blank/round-blank-set";
import {GameBlankSet} from "../interfaces/blank/game-blank-set";

@Injectable({
  providedIn: 'root'
})
export class JumpToBackgroundDashboardService {

  cachedGame: Game;
  cachedRoundBlankSet: RoundBlankSet;

  constructor(private backgroundService: BackgroundService) { }

}
