import {AfterViewInit, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Game} from "../interfaces/game";
import {HttpClient} from "@angular/common/http";
import {AuthService} from "../services/auth.service";

@Component({
    selector: 'app-games-table',
    templateUrl: './games-table.component.html',
    styleUrls: ['./games-table.component.scss',
        '../common-styles/scrollbar.css',
        '../common-styles/accent-icons.css',
        '../game-card/game-card.component.scss']
})
export class GamesTableComponent {

    constructor(private http: HttpClient, private authService: AuthService) {
    }

    @Input("type")
    type: string;

    @Input("gamesAreLoaded")
    gamesAreLoaded: boolean;

    @Input("games")
    games: Game[];

    removeGameFromList(game: Game) {
        let index = this.games.indexOf(game);
        this.games.splice(index, 1);
    }
}
