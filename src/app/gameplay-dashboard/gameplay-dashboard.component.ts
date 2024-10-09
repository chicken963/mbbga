import { Component } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {ActivatedRoute} from "@angular/router";
import {Game} from "../interfaces/game";
import {GameBlankSet} from "../interfaces/blank/game-blank-set";
import {Round} from "../interfaces/round";
import {RoundBlankSet} from "../interfaces/blank/round-blank-set";
import {BackgroundService} from "../services/background.service";
import {GamePlay} from "../interfaces/gameplay/game-play";
import {RoundPlay} from "../interfaces/gameplay/round-play";
import {KeyValue} from "@angular/common";

@Component({
  selector: 'app-gameplay-dashboard',
  templateUrl: './gameplay-dashboard.component.html',
  styleUrls: ['./gameplay-dashboard.component.scss', './../common-styles/tabs.scss', './../common-styles/scrollbar.css']
})
export class GameplayDashboardComponent {

    game: Game;
    gameBlankSet: GameBlankSet;
    gamePlay: GamePlay;
    currentRound: number = 0;
    roundsWithBlankSets: Map<Round, RoundBlankSet> = new Map<Round, RoundBlankSet>();
    roundsWithRoundPlays: Map<Round, RoundPlay> = new Map<Round, RoundPlay>();
    numberOfRequestsLoaded: number;

    constructor(private http: HttpClient,
                private activatedRoute: ActivatedRoute,
                private backgroundService: BackgroundService) {
        this.numberOfRequestsLoaded = 0;
        let gameId = this.activatedRoute.snapshot.params["id"];
        let blankSetId = this.activatedRoute.snapshot.params["blankSetId"];
        this.gameBlankSet = this.backgroundService.getCachedCurrentGameSet()!;
        this.http.get<Game>(`/games/${gameId}`).subscribe(response => {
            this.game = response;
            let firstTrack = this.game.rounds.find(round => round.indexInGame === 0)!.audioTracks[0];
            this.http.post<GamePlay>(`/gameplay/start`,  firstTrack, {params: {'game-id': gameId, 'game-blank-set-id': blankSetId}}).subscribe(response => {
                this.gamePlay = response;
                this.fillRoundsAndRoundPlaysMap();
            })
            this.fillRoundsAndBlanksMap();
        });
    }

    private fillRoundsAndBlanksMap() {
        this.game.rounds.forEach(round => {
            this.roundsWithBlankSets.set(round, this.gameBlankSet.roundBlankSets.find(roundBlankSet => roundBlankSet.round.id === round.id)!)
        })
    }

    private fillRoundsAndRoundPlaysMap() {
        this.game.rounds.forEach(round => {
            this.roundsWithRoundPlays.set(round, this.gamePlay.roundPlays.find(roundPlay => roundPlay.round.id === round.id)!)
        })
    }

    linkedSort = (a: KeyValue<Round, RoundBlankSet>, b: KeyValue<Round, RoundBlankSet>): number => {
        return a.key.indexInGame - b.key.indexInGame;
    }
}
