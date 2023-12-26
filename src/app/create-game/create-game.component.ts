import {Component, OnInit} from '@angular/core';
import {Game} from "../interfaces/game";
import {AuthService} from "../services/auth.service";
import {Round} from "../interfaces/round";
import {WinConditionType} from "../interfaces/win-condition";

@Component({
  selector: 'app-create-game',
  templateUrl: './create-game.component.html',
  styleUrls: ['./create-game.component.scss']
})
export class CreateGameComponent implements OnInit {

    constructor(private authService: AuthService) {
    }

    game: Game;

    currentDate(): Date {
        return new Date();
    }

    ngOnInit(): void {
        this.game = {
            name: "",
            author: this.authService.user,
            createdAt: "",
            numberOfTickets: 0,
            rounds: [this.prepareEmptyRound()]
        };
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
            fieldSize: [5, 5],
            winConditions: [
                {type: WinConditionType.LINES, linesCount: 1},
                {type: WinConditionType.LINES, linesCount: 3},
                {type: WinConditionType.FULL, linesCount: 0},
            ],
            audioTracks: [],
            tickets: []
        }
    }

    removeTab(index: number) {
        this.game.rounds.splice(index, 1);
    }
}
