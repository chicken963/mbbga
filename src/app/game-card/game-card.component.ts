import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Game} from "../interfaces/game";
import {Router} from "@angular/router";
import {HttpClient} from "@angular/common/http";
import {AuthService} from "../services/auth.service";
import {DialogService} from "../utils/dialog.service";
import {BlankManagementService} from "../services/blank-management.service";
import {MatDialog} from "@angular/material/dialog";
import {BlankSetSelectComponent} from "../blank-set-select/blank-set-select.component";

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

    constructor(private router: Router, private http: HttpClient,
                private authService: AuthService,
                private dialog: MatDialog,
                private blankService: BlankManagementService,
                private dialogService: DialogService) {
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

    editGame() {
        this.router.navigate(['/game', this.game.id]);
    }

    manageBlanks() {
        this.blankService.gameSelected.next(this.game);
        this.router.navigate(['/game', this.game.id, 'blanks']);
    }

    delete() {
        this.http.delete(`/games/${this.game.id}`).subscribe(() => this.gameDeleted.emit(this.game));
    }

    askForDeletion() {
        this.dialogService.openYesNoPopup(`Are you sure you want to delete the game ${this.game.name}? You will be unable to revert this action.`,
            (confirmed: boolean) => {
                if (confirmed) {
                    this.delete();
                }
            });
    }

    openPreselectPopup() {
        this.dialog.open(BlankSetSelectComponent, {
            disableClose: true,
            minWidth: `35vw`,
            data: {gameId: this.game.id}})
    }
}
