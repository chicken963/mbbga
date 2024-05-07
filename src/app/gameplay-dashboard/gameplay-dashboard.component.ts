import { Component } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {ActivatedRoute} from "@angular/router";
import {Game} from "../interfaces/game";
import {GameBlankSet} from "../interfaces/blank/game-blank-set";
import {Round} from "../interfaces/round";
import {RoundBlankSet} from "../interfaces/blank/round-blank-set";
import {Observable, Subject} from "rxjs";
import {BackgroundService} from "../services/background.service";

@Component({
  selector: 'app-gameplay-dashboard',
  templateUrl: './gameplay-dashboard.component.html',
  styleUrls: ['./gameplay-dashboard.component.scss', './../common-styles/tabs.scss', './../common-styles/scrollbar.css']
})
export class GameplayDashboardComponent {

    game: Game;
    gameBlankSet: GameBlankSet;
    currentRound: number = 0;
    roundsWithBlankSets: Map<Round, RoundBlankSet> = new Map<Round, RoundBlankSet>();
    numberOfRequestsLoaded: number;

    constructor(private http: HttpClient,
                private activatedRoute: ActivatedRoute,
                private backgroundService: BackgroundService) {
        this.numberOfRequestsLoaded = 0;
        let gameId = this.activatedRoute.snapshot.params["id"];
        this.gameBlankSet = this.backgroundService.getCachedCurrentGameSet()!;
        this.http.get<Game>(`/games/${gameId}`).subscribe(response => {
            this.game = response
            this.fillRoundsAndBlanksMap();
        });
    }

    private fillRoundsAndBlanksMap() {
        this.game.rounds.forEach(round => {
            this.roundsWithBlankSets.set(round, this.gameBlankSet.roundBlankSets.find(roundBlankSet => roundBlankSet.round.id === round.id)!)
        })
    }
}
