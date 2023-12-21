import {AfterViewInit, Component, Input} from '@angular/core';
import {Game} from "../interfaces/game";
import {HttpClient} from "@angular/common/http";

@Component({
    selector: 'app-games-table',
    templateUrl: './games-table.component.html',
    styleUrls: ['./games-table.component.scss',
        '../common-styles/scrollbar.css',
        '../common-styles/accent-icons.css',
        '../game-card/game-card.component.scss']
})
export class GamesTableComponent implements AfterViewInit {

    constructor(private http: HttpClient) {
    }

    @Input("type")
    type: string;

    gamesAreLoaded: boolean;
    games: Game[];

    ngAfterViewInit(): void {
        if (this.type == "all") {
            this.http.get<Game[]>("/games/all").subscribe(response => {
                response.forEach(game => {
                    game.createdAt = this.toFormattedDate(game.createdAt);
                    game.modifiedAt = this.toFormattedDate(game.modifiedAt);
                })
                this.games = response;
                this.gamesAreLoaded = true;
            })
        }
    }

    private toFormattedDate(date: string): string {
        const localDateTime = new Date(date);
        return localDateTime.toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            hour12: false
        });
    }

}
