import {Component, OnDestroy, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {DialogService} from "../utils/dialog.service";
import {MatDialog} from "@angular/material/dialog";
import {ActivatedRoute, Router} from "@angular/router";
import {AuthService} from "../services/auth.service";
import {NotificationService} from "../utils/notification.service";
import {BlankManagementService} from "../services/blank-management.service";
import {Game} from "../interfaces/game";
import {Location} from '@angular/common';
import {BlankBackground} from "../interfaces/blank/background";
import {CropperComponent} from "../cropper/cropper.component";
import {DomSanitizer, SafeUrl} from "@angular/platform-browser";
import {BackgroundService} from "../services/background.service";
import {BackgroundSelectService} from "../services/background-select.service";
import {JumpToBackgroundDashboardService} from "../services/jump-to-background-dashboard.service";
import {GameBlankSet} from "../interfaces/blank/game-blank-set";
import {RoundBlankSet} from "../interfaces/blank/round-blank-set";
import {Subject, takeUntil} from "rxjs";

@Component({
    selector: 'app-background-select',
    templateUrl: './background-select.component.html',
    styleUrls: ['./background-select.component.scss']
})
export class BackgroundSelectComponent implements OnInit, OnDestroy {

    gameId: string;
    game: Game;
    backgrounds: BlankBackground[] = [];
    numberOfNotLoadedImages: number;
    imageSrc: any;
    defaultImageDataUrl: string;
    selectedBackgroundIndex: number;
    gameBlankSet: GameBlankSet;
    isGameOwner: boolean;
    roundBlankSet: RoundBlankSet;

    ngDestroy$: Subject<boolean> = new Subject<boolean>();

    constructor(private http: HttpClient,
                private dialogService: DialogService,
                private dialog: MatDialog,
                private router: Router,
                private location: Location,
                private route: ActivatedRoute,
                private sanitizer: DomSanitizer,
                public authService: AuthService,
                private notificationService: NotificationService,
                private backgroundService: BackgroundService,
                private jumpToBackgroundDashboardService: JumpToBackgroundDashboardService,
                private backgroundSelectService: BackgroundSelectService,
                private blankManagementService: BlankManagementService) {
        this.backgrounds.push(this.backgroundService.defaultBackground);

        this.gameBlankSet = this.backgroundService.getCachedCurrentGameSet()!;

        this.gameId = this.route.snapshot.params["id"];
        let game = this.blankManagementService.gameSelected.value;
        if (!game) {
            this.http.get<any>(`/games/${this.gameId}`).subscribe(response => {
                this.game = response;
            });
        } else {
            this.game = game;
        }
        this.http.get<BlankBackground[]>(`/backgrounds/all`).subscribe(response => {
            this.numberOfNotLoadedImages = response.length;
            response.forEach(background => {
                    this.addBackgroundAndLoadPreview(background);
                });
            this.roundBlankSet = this.backgroundService.getCachedCurrentGameSet()!.roundBlankSets[this.backgroundService.getRbsIndex()];
            let selectedBackground = this.backgrounds.find(background => background.id && background.id === this.roundBlankSet.blankBackground.id);
            this.selectedBackgroundIndex = selectedBackground ? this.backgrounds.indexOf(selectedBackground) : 0;
        });
        this.backgroundService.getBackgroundAdded().pipe(takeUntil(this.ngDestroy$)).subscribe(background =>
            this.addBackgroundAndLoadPreview(background));
    }

    private addBackgroundAndLoadPreview(background: BlankBackground) {
        background.fontSize = this.getFontSize(background);
        this.backgrounds.push(background);
        if (!background.image) {
            this.backgroundService.fetchImage(background);
        }

    }

    private getFontSize(background: BlankBackground): number {
        if (background.name?.length && background.name?.length > 25) {
            return 14;
        }
        return this.backgroundService.defaultBackground.fontSize!;
    }

    ngOnInit() {
        this.backgroundSelectService.getSelectedRadioButton().pipe(takeUntil(this.ngDestroy$)).subscribe(index => {
            this.selectedBackgroundIndex = index;
        });
        this.backgroundService.getBackgroundFetched().pipe(takeUntil(this.ngDestroy$)).subscribe(value => {
            if (value) {
                this.numberOfNotLoadedImages--;
            }
        });
    }

    showCropper(event: any) {
        const file: File = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e: any) => {
                const image = new Image();
                image.onload = () => {
                    let newBackground = {...this.backgroundService.defaultBackground};
                    this.dialog.open(CropperComponent, {
                        disableClose: true,
                        minWidth: `85vw`,
                        minHeight: `95vh`,
                        data: {
                            src: this.imageSrc,
                            // dataUrl: image.src,
                            background: newBackground
                        }
                    });
                };
                image.src = e.target.result;
                this.imageSrc = this.sanitizer.bypassSecurityTrustUrl(e.target.result);
                if (this.imageSrc.changingThisBreaksApplicationSecurity) {
                    this.imageSrc = this.imageSrc.changingThisBreaksApplicationSecurity;
                }
            };
            reader.readAsDataURL(file);
        }
    }

    onRadioButtonClick(background: BlankBackground, i: number) {
        this.roundBlankSet.blankBackground = background;
        this.backgroundSelectService.setSelectedRadioButton(i);
    }

    editBackground(background: BlankBackground) {
        this.dialog.open(CropperComponent, {
            disableClose: true,
            data: {
                background: background
            }
        });
    }

    askForDeletion(background: BlankBackground) {
        this.dialogService.openYesNoPopup(`Are you sure you want to delete the background "${background.name}"? You will be unable to revert this action.`,
            (confirmed: boolean) => {
                if (confirmed) {
                    this.delete(background);
                }
            });
    }

    private delete(background: BlankBackground) {
        this.http.delete(`/backgrounds?background-id=${background.id}`).subscribe(() => {
            let index = this.backgrounds.indexOf(background);
            this.backgrounds.splice(index, 1);
        });
    }

    backToBlankSetCreation() {
        this.backgroundService.navigationToGameBlankSetCreationFromBackgroundSelect.next(true);
        this.location.back();
    }

    ngOnDestroy(): void {
        this.gameBlankSet.roundBlankSets[this.backgroundService.getRbsIndex()] = this.roundBlankSet;
        this.backgroundService.setCurrentGameSet(this.gameBlankSet);
        this.ngDestroy$.next(true);
    }
}
