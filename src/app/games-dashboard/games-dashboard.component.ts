import {Component, OnInit} from '@angular/core';
import {AuthService} from "../services/auth.service";
import {User} from "../interfaces/user";
import {Game} from "../interfaces/game";
import {HttpClient} from "@angular/common/http";

@Component({
  selector: 'app-games-dashboard',
  templateUrl: './games-dashboard.component.html',
  styleUrls: ['./games-dashboard.component.css']
})
export class GamesDashboardComponent implements OnInit {

    user: User;
    constructor(private authService: AuthService, private http: HttpClient) {
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

    removeGame(mode: string, $event: Game) {
        if (mode === 'all') {
            let index = this.allGames.indexOf($event);
            this.allGames.splice(index, 1);
        }
        if (mode === 'user') {
            let index = this.userGames.indexOf($event);
            this.allGames.splice(index, 1);
        }
    }
}
