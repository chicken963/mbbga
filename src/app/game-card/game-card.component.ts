import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Game} from "../interfaces/game";
import {Router} from "@angular/router";
import {HttpClient} from "@angular/common/http";
import {AuthService} from "../services/auth.service";

@Component({
  selector: 'app-game-card',
  templateUrl: './game-card.component.html',
  styleUrls: ['./game-card.component.scss']
})
export class GameCardComponent {
  
  @Input("game")
  game: Game;

  isGameOwner: boolean;

  @Output() gameDeleted: EventEmitter<Game> = new EventEmitter<Game>();

  constructor(private router: Router, private http: HttpClient, private authService: AuthService) {
  }

  ngOnInit() {
    if (this.authService.user) {
      this.isGameOwner = this.authService.user.id === this.game.author.id || this.authService.isAdmin;
      return;
    }
    this.authService.getUser().subscribe(user => {
      this.isGameOwner = user.id === this.game.author.id || this.authService.isAdmin;
    })
  }

  navigateToGame() {
    this.router.navigate(['/game', this.game.id]);
  }

  delete() {
    this.http.delete(`/games/${this.game.id}`).subscribe(() => this.gameDeleted.emit(this.game));
  }
}
