import {Component, Input} from '@angular/core';
import {Game} from "../interfaces/game";
import {Router} from "@angular/router";

@Component({
  selector: 'app-game-card',
  templateUrl: './game-card.component.html',
  styleUrls: ['./game-card.component.scss']
})
export class GameCardComponent {
  
  @Input("game")
  game: Game;

  constructor(private router: Router) {
  }

  navigateToGame() {
    this.router.navigate(['/game', this.game.id]);
  }
}
