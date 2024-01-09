import {Component, OnInit, ViewChild, ViewChildren, ViewEncapsulation} from '@angular/core';
import {Game} from "../interfaces/game";
import {AuthService} from "../services/auth.service";
import {Round} from "../interfaces/round";
import {WinConditionType} from "../interfaces/win-condition";
import {HttpClient} from "@angular/common/http";
import {ActivatedRoute, Router} from "@angular/router";
import {NotificationService} from "../utils/notification.service";
import {MatTabChangeEvent, MatTabGroup} from "@angular/material/tabs";
import {CreateRoundComponent} from "../create-round/create-round.component";

@Component({
    selector: 'app-create-game',
    templateUrl: './create-game.component.html',
    styleUrls: ['./create-game.component.scss'],
    encapsulation: ViewEncapsulation.Emulated
})
export class CreateGameComponent implements OnInit {

    @ViewChildren(CreateRoundComponent)
    createRoundComponents: CreateRoundComponent[];

    constructor(private authService: AuthService,
                private http: HttpClient,
                private router: Router,
                private route: ActivatedRoute,
                private notificationService: NotificationService) {
        this.game = {
            id: "",
            name: "",
            mode: 'create',
            author: this.authService.user,
            createdAt: "",
            rounds: [this.prepareEmptyRound()]
        }
        this.gameId = this.route.snapshot.params["id"];
        if (this.gameId) {
            /*this.gameService.gameToRender().subscribe(
                game => this.game = game
            );*/
            this.http.get<any>(`/games/${this.gameId}`).subscribe(response => this.game = response);
        }
    }

    game: Game;
    gameId: string;
    selectedTabIndex: number;

    currentDate(): Date {
        return new Date();
    }

    ngOnInit(): void {

    }

    removeRound(index: number) {
        this.game.rounds.splice(index, 1);
        if (this.game.rounds.length === 0) {
            this.addRound();
            return;
        }
        setTimeout(() => this.selectedTabIndex = this.game.rounds.length - 1);
    }

    addRound() {
        this.game.rounds.push(this.prepareEmptyRound());
        setTimeout(() => this.selectedTabIndex = this.game.rounds.length - 1);
    }

    prepareEmptyRound(): Round {
        return {
            name: "",
            rowsCount: 5,
            columnsCount: 5,
            winConditions: [
                {type: WinConditionType.LINES, linesToStrike: 1},
                {type: WinConditionType.LINES, linesToStrike: 3},
                {type: WinConditionType.FULL, linesToStrike: 0},
            ],
            audioTracks: [],
            tickets: []
        }
    }

    save(game: Game) {
        if (game.mode === 'create') {
            this.http.post("/games/add", game).subscribe(response => {
                this.router.navigate(["/game-dashboard"]);
                this.notificationService.pushNotification("Game successfully saved");
            }, error => {
                this.notificationService.pushNotification("Error happened while saving game. Reason: " + error.error);
            })
        }
    }

    backToMenu() {
        this.router.navigate(["/game-dashboard"]);
    }

    onRoundChanged($event: MatTabChangeEvent) {
        let clickedIndex = $event.index;
    }
}
