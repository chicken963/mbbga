import {Component, Inject} from '@angular/core';
import {GameBlankSet} from "../interfaces/blank/game-blank-set";
import {HttpClient} from "@angular/common/http";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {Router} from "@angular/router";
import {BlankBackground} from "../interfaces/blank/background";
import {BackgroundService} from "../services/background.service";

@Component({
    selector: 'app-blank-set-select',
    templateUrl: './blank-set-select.component.html',
    styleUrls: ['./blank-set-select.component.scss', './../common-styles/overlay.scss']
})
export class BlankSetSelectComponent {

    blankSets: GameBlankSet[];
    selectedBlankSet: GameBlankSet;
    gameId: string;
    private numberOfImagesToLoad: number;
    imagesArePreloaded: boolean = false;
    loadPercents: number;
    gameBlankSetsArePreloaded: boolean;

    constructor(@Inject(MAT_DIALOG_DATA) public data: any,
                private router: Router,
                private backgroundService: BackgroundService,
                private dialogRef: MatDialogRef<BlankSetSelectComponent>,
                private http: HttpClient) {
        this.gameId = data.gameId;
    }


    ngOnInit() {
        this.gameBlankSetsArePreloaded = true;
        this.http.get<GameBlankSet[]>(`/blanks?game-id=${this.gameId}`).subscribe(response => {
            this.gameBlankSetsArePreloaded = false;
            this.blankSets = response;
        })
    }

    cancel() {
        this.dialogRef.close();
    }

    startGame() {
        this.imagesArePreloaded = true;
        this.loadPercents = 0;
        this.http.get<BlankBackground[]>(`/backgrounds/blankSet/${this.selectedBlankSet.id}`).subscribe(backgrounds => {
            this.backgroundService.bindBackgroundsToBlankSet(backgrounds, this.selectedBlankSet);
            let backgroundsWithLoadableImage = backgrounds.filter(background => background);
            let backgroundsWithDefaultImage = backgrounds.filter(background => !background);

            this.numberOfImagesToLoad = backgroundsWithLoadableImage.length;
            this.backgroundService.getBackgroundFetched().subscribe(value => {
                if (value) {
                    this.numberOfImagesToLoad--;
                    this.loadPercents += Math.round(100 / backgrounds.length);
                }
                if (this.numberOfImagesToLoad == 0) {
                    this.finishAndNavigate();
                }
            });
            backgroundsWithLoadableImage.forEach(background => this.backgroundService.fetchImage(background));
            if (backgroundsWithDefaultImage.length > 0) {
                this.backgroundService.fetchDefaultImage();
                this.loadPercents += Math.round(100 / backgrounds.length * backgroundsWithDefaultImage.length);
            }
            if (this.numberOfImagesToLoad == 0) {
                this.finishAndNavigate();
            }
        });

    }

    private finishAndNavigate() {
        this.backgroundService.setCurrentGameSet(this.selectedBlankSet);
        this.imagesArePreloaded = false;
        this.dialogRef.close();
        this.router.navigate(['game', this.gameId, 'play', this.selectedBlankSet.id]);
    }
}
