import {Component, OnDestroy} from '@angular/core';
import {Game} from "../interfaces/game";
import {HttpClient} from "@angular/common/http";
import {ActivatedRoute} from "@angular/router";
import {DialogService} from "../utils/dialog.service";
import {MatDialog} from "@angular/material/dialog";
import {CreateGameBlankSetComponent} from "../create-game-blank-set/create-game-blank-set.component";
import {GameBlankSet} from "../interfaces/blank/game-blank-set";
import {BlankManagementService} from "../services/blank-management.service";
import {Subject, takeUntil} from "rxjs";
import {MatTableDataSource} from "@angular/material/table";
import {AuthService} from "../services/auth.service";
import {NotificationService} from "../utils/notification.service";

@Component({
    selector: 'app-game-blanks-workbench',
    templateUrl: './game-blanks-workbench.component.html',
    styleUrls: ['./game-blanks-workbench.component.scss']
})
export class GameBlanksWorkbenchComponent implements OnDestroy {

    gameId: string;
    game: Game;
    gameBlankSets: GameBlankSet[];
    dataSource: MatTableDataSource<GameBlankSet>;
    displayedColumns: string[] = ['position', 'name', 'ticketsAmount', 'created', 'author', 'show', 'delete'];
    ngDestroy$: Subject<boolean> = new Subject<boolean>();

    constructor(private http: HttpClient,
                private dialogService: DialogService,
                private dialog: MatDialog,
                private route: ActivatedRoute,
                private authService: AuthService,
                private notificationService: NotificationService,
                private blankManagementService: BlankManagementService) {
        this.gameId = this.route.snapshot.params["id"];
        this.http.get<any>(`/games/${this.gameId}`).subscribe(response => {
            this.game = response;
        });
        this.http.get<GameBlankSet[]>(`/blanks?game-id=${this.gameId}`).subscribe(response => {
            this.gameBlankSets = response;
            this.gameBlankSets.forEach(gameBlankSet => gameBlankSet.isOwnedByCurrentUser = gameBlankSet.owner.id === this.authService.user.id)
            this.dataSource = new MatTableDataSource(this.gameBlankSets);
        });
        this.blankManagementService.getBlankSetAdded().pipe(takeUntil(this.ngDestroy$)).subscribe(blankSet => {
            blankSet.isOwnedByCurrentUser = blankSet.owner.id === this.authService.user.id;
            this.gameBlankSets.push(blankSet);
            this.dataSource = new MatTableDataSource(this.gameBlankSets);
            this.notificationService.pushNotification(`Blank set "${blankSet.name}" was successfully added`, "success");
        });
        this.blankManagementService.getBlankSetRemoved().pipe(takeUntil(this.ngDestroy$)).subscribe(blankSet => {
            const index = this.gameBlankSets.indexOf(blankSet);
            this.gameBlankSets.splice(index, 1);
            this.dataSource = new MatTableDataSource(this.gameBlankSets);
            this.notificationService.pushNotification(`Blank set "${blankSet.name}" was successfully deleted`, "success");
        });
    }

    showPreGeneratePopup() {
        this.dialog.open(CreateGameBlankSetComponent, {
            disableClose: true,
            width: '70%',
            panelClass: 'create-blank-set',
            data: {
                game: this.game
            }
        })
    }

    ngOnDestroy(): void {
        this.ngDestroy$.next(true);
    }

    delete(gameBlankSet: GameBlankSet) {
        this.http.delete(`/blanks/${gameBlankSet.id}`).subscribe(response => {
            this.blankManagementService.removeBlankSet(gameBlankSet);
        })

    }
}
