import {Component, OnInit} from '@angular/core';
import {Game} from "../interfaces/game";
import {AuthService} from "../services/auth.service";
import {Round} from "../interfaces/round";
import {WinConditionType} from "../interfaces/win-condition";
import {HttpClient} from "@angular/common/http";
import {ActivatedRoute, Router} from "@angular/router";
import {NotificationService} from "../utils/notification.service";

@Component({
    selector: 'app-create-game',
    templateUrl: './create-game.component.html',
    styleUrls: ['./create-game.component.scss']
})
export class CreateGameComponent implements OnInit {

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

    currentDate(): Date {
        return new Date();
    }

    ngOnInit(): void {

    }

    removeRound(round: Round) {
        const index = this.game.rounds.indexOf(round, 0);
        this.removeTab(index);
    }

    addRound() {
        this.game.rounds.push(this.prepareEmptyRound());
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

    removeTab(index: number) {
        this.game.rounds.splice(index, 1);
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
}
