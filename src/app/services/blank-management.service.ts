import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable, Subject} from "rxjs";
import {GameBlankSet} from "../interfaces/blank/game-blank-set";
import {Game} from "../interfaces/game";
import {StrikeCriterion} from "../interfaces/blank/strike-criterion";
import {RoundBlankSet} from "../interfaces/blank/round-blank-set";
import {User} from "../interfaces/user";
import {BackgroundService} from "./background.service";

@Injectable({
  providedIn: 'root'
})
export class BlankManagementService {

  blankSetAdded: Subject<GameBlankSet> = new Subject<GameBlankSet>();
  blankSetRemoved: Subject<GameBlankSet> = new Subject<GameBlankSet>();

  gameSelected: BehaviorSubject<Game | null> = new BehaviorSubject<Game | null>(null);

  constructor(private backgroundService: BackgroundService) { }

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

  generateDefaultGameBlankSet(user: User, game: Game): GameBlankSet {
    return {
      name: "",
      owner: user,
      game: {id: game.id},
      numberOfBlanks: 100,
      roundBlankSets: game.rounds.map(round => {
        return {
          rowsCount: 5,
          columnsCount: 5,
          strikeCriterion: StrikeCriterion.ARTIST,
          blankBackground: this.backgroundService.defaultBackground,
          round: {id: round.id,
            name: round.name,
            index: game.rounds.indexOf(round)},
          blanks: []
        } as RoundBlankSet
      })
    }
  }
}
