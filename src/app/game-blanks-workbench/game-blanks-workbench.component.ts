import {Component, OnDestroy} from '@angular/core';
import {Game} from "../interfaces/game";
import {HttpClient} from "@angular/common/http";
import {ActivatedRoute, Router} from "@angular/router";
import {DialogService} from "../utils/dialog.service";
import {MatDialog} from "@angular/material/dialog";
import {CreateGameBlankSetComponent} from "../create-game-blank-set/create-game-blank-set.component";
import {GameBlankSet} from "../interfaces/blank/game-blank-set";
import {BlankManagementService} from "../services/blank-management.service";
import {Subject, takeUntil} from "rxjs";
import {MatTableDataSource} from "@angular/material/table";
import {AuthService} from "../services/auth.service";
import {NotificationService} from "../utils/notification.service";
import {BackgroundService} from "../services/background.service";
import {BlankBackground} from "../interfaces/blank/background";
import {Location} from "@angular/common";

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
    numberOfImagesToLoad: number = 0;

    constructor(private http: HttpClient,
                private dialogService: DialogService,
                private dialog: MatDialog,
                private router: Router,
                private route: ActivatedRoute,
                private authService: AuthService,
                private location: Location,
                private notificationService: NotificationService,
                private backgroundService: BackgroundService,
                private blankManagementService: BlankManagementService) {
        this.gameId = this.route.snapshot.params["id"];
        let game = this.blankManagementService.gameSelected.value;
        if (!game) {
            this.http.get<any>(`/games/${this.gameId}`).subscribe(response => {
                this.game = response;
            });
        } else {
            this.game = game;
        }
        this.http.get<GameBlankSet[]>(`/blanks?game-id=${this.gameId}`).subscribe(response => {
            this.gameBlankSets = response;
            this.gameBlankSets.forEach(gameBlankSet => gameBlankSet.roundBlankSets = gameBlankSet.roundBlankSets.sort((r1, r2) => r1.round.index - r2.round.index));
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
        this.router.navigate(['/game', this.game.id, 'blanks', 'new']);
    }

    ngOnDestroy(): void {
        this.ngDestroy$.next(true);
    }

    delete(gameBlankSet: GameBlankSet) {
        this.http.delete(`/blanks/${gameBlankSet.id}`).subscribe(response => {
            this.blankManagementService.removeBlankSet(gameBlankSet);
        })

    }

    openBlankSet(gameBlankSet: GameBlankSet) {
        this.http.get<BlankBackground[]>(`/backgrounds/blankSet/${gameBlankSet.id}`).subscribe(backgrounds => {
            this.backgroundService.bindBackgroundsToBlankSet(backgrounds, gameBlankSet);
            let backgroundsWithLoadableImage = backgrounds.filter(background => background);
            let backgroundsWithDefaultImage = backgrounds.filter(background => !background);

            this.numberOfImagesToLoad = backgroundsWithLoadableImage.length;
            this.backgroundService.getBackgroundFetched().subscribe(value => {
                if (value) {
                    this.numberOfImagesToLoad--;
                }
                if (this.numberOfImagesToLoad == 0) {
                    this.backgroundService.setCurrentGameSet(gameBlankSet);
                    this.backgroundService.navigationToGameBlankSetCreationFromBackgroundSelect.next(false);
                    this.router.navigate(['/game', this.game.id, 'blanks', gameBlankSet.id]);
                }
            });
            backgroundsWithLoadableImage.forEach(background => this.backgroundService.fetchImage(background));
            if (backgroundsWithDefaultImage.length > 0) {
                this.backgroundService.fetchDefaultImage();
            }
            if (this.numberOfImagesToLoad == 0) {
                this.backgroundService.setCurrentGameSet(gameBlankSet);
                this.backgroundService.navigationToGameBlankSetCreationFromBackgroundSelect.next(false);
                this.router.navigate(['/game', this.game.id, 'blanks', gameBlankSet.id]);
            }
        });
    }

    private gameBlankSetWasNotOpenedBefore(gameBlankSet: GameBlankSet) {
        return gameBlankSet.roundBlankSets.find(roundBlankSet => roundBlankSet.blankBackground && roundBlankSet.blankBackground.id && !roundBlankSet.blankBackground.image);
    }

    allBackgroundImagesAreLoaded(gameBlankSet: GameBlankSet): boolean {
        return gameBlankSet.roundBlankSets
            .every(roundBlankSet => !roundBlankSet.blankBackground || roundBlankSet.blankBackground.image);
    }

    openConfirmationDialog(gameBlankSet: GameBlankSet) {
        this.dialogService.openYesNoPopup(`Are you sure you want to delete game blank set ${gameBlankSet.name}?\nYou will be unable to revert this action.`,
            (confirmed: boolean) => {
                if (confirmed) {
                    this.delete(gameBlankSet);
                }
            });
    }

    backToGamesList() {
        this.location.back();
    }
}
