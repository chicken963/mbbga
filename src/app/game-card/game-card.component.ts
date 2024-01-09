import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Game} from "../interfaces/game";
import {Router} from "@angular/router";
import {HttpClient} from "@angular/common/http";

@Component({
  selector: 'app-game-card',
  templateUrl: './game-card.component.html',
  styleUrls: ['./game-card.component.scss']
})
export class GameCardComponent {
  
  @Input("game")
  game: Game;

  @Output() gameDeleted: EventEmitter<Game> = new EventEmitter<Game>();

  constructor(private router: Router, private http: HttpClient) {
  }

  navigateToGame() {
    this.router.navigate(['/game', this.game.id]);
  }

  delete() {
    this.http.delete(`/games/${this.game.id}`).subscribe(() => this.gameDeleted.emit(this.game));
  }
}
