import {Component, OnInit} from '@angular/core';
import {AuthService} from "../services/auth.service";
import {User} from "../interfaces/user";
import {Game} from "../interfaces/game";
import {HttpClient} from "@angular/common/http";
import {RoundSortService} from "../services/round-sort.service";

@Component({
  selector: 'app-games-dashboard',
  templateUrl: './games-dashboard.component.html',
  styleUrls: ['./games-dashboard.component.css']
})
export class GamesDashboardComponent implements OnInit {

    user: User;
    constructor(private authService: AuthService,
                private http: HttpClient,
                private roundSortService: RoundSortService) {
      this.authService.getUser().subscribe(user => this.user = user);
    }

    allGames: Game[];
    userGames: Game[];
    gamesAreLoaded: boolean;

    ngOnInit() {
        this.loadAllGames();
    }

    loadAllGames() {
        if (!this.allGames) {
            this.gamesAreLoaded = false;
            this.http.get<Game[]>(`/games/all`).subscribe(response => {
                this.allGames = response;
                this.allGames.forEach(game => {
                    game.rounds = game.rounds.sort(this.roundSortService.sortRounds);
                });
                this.gamesAreLoaded = true;
            })
        }
    }

    loadUserGames() {
        if (!this.userGames) {
            this.gamesAreLoaded = false;
            this.http.get<Game[]>(`/games/${this.authService.user.id}/all`).subscribe(response => {
                this.userGames = response;
                this.gamesAreLoaded = true;
            })
        }
    }

    loadGames($event: number) {
        if ($event === 0) {
            this.loadAllGames();
        } else {
            this.loadUserGames();
        }

    }
}
