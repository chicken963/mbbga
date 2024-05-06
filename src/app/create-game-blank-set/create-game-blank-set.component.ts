import {Component} from '@angular/core';
import {DialogService} from "../utils/dialog.service";
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {Game} from "../interfaces/game";
import {StrikeCriterion} from "../interfaces/blank/strike-criterion";
import {GameBlankSet} from "../interfaces/blank/game-blank-set";
import {AuthService} from "../services/auth.service";
import {HttpClient} from "@angular/common/http";
import {BlankManagementService} from "../services/blank-management.service";
import {ActivatedRoute, Router} from "@angular/router";
import {NotificationService} from "../utils/notification.service";
import {Location} from "@angular/common";
import {BackgroundService} from "../services/background.service";
import {JumpToBackgroundDashboardService} from "../services/jump-to-background-dashboard.service";

@Component({
    selector: 'app-create-game-blank-set',
    templateUrl: './create-game-blank-set.component.html',
    styleUrls: ['./create-game-blank-set.component.scss', './../common-styles/round-workbench-groups.scss']
})
export class CreateGameBlankSetComponent {
    gameBlankSetParamsForm: FormGroup;
    game: Game;
    gameId: string;
    strikeCriteria: StrikeCriterion[] = Object.values(StrikeCriterion)
    gameBlankSet: GameBlankSet;
    fieldSizeForm: FormGroup;

    constructor(private dialogService: DialogService,
                private authService: AuthService,
                private fb: FormBuilder,
                private http: HttpClient,
                private location: Location,
                private route: ActivatedRoute,
                private notificationService: NotificationService,
                private jumpToBackgroundDashboardService: JumpToBackgroundDashboardService,
                private router: Router,
                private backgroundService: BackgroundService,
                private blankManagementService: BlankManagementService) {
    }

    ngOnInit() {
        this.gameId = this.route.snapshot.params["id"];
        let game = this.blankManagementService.gameSelected.value;
        if (!this.backgroundService.navigationToGameBlankSetCreationFromBackgroundSelect.value) {
            if (!game || game.id !== this.gameId) {
                this.http.get<any>(`/games/${this.gameId}`).subscribe(response => {
                    this.game = response;
                    if (this.backgroundService.getCachedCurrentGameSet()) {
                        this.gameBlankSet = this.backgroundService.getCachedCurrentGameSet()!;
                    } else {
                        this.gameBlankSet = this.blankManagementService.generateDefaultGameBlankSet(this.authService.user, this.game);
                    }
                    sessionStorage.setItem('gameBlankSet', JSON.stringify(this.gameBlankSet));
                    this.init();
                });
            } else {
                this.game = game;
                this.gameBlankSet = this.blankManagementService.generateDefaultGameBlankSet(this.authService.user, this.game);
                sessionStorage.setItem('gameBlankSet', JSON.stringify(this.gameBlankSet));
                this.init();
            }
        } else {
            this.game = this.backgroundService.getCachedGame();
            this.gameBlankSet = this.backgroundService.getCachedCurrentGameSet()!;
            this.init();
        }
    }


    openConfirmationDialog(): void {
        this.dialogService.openYesNoPopup("Are you sure you want to cancel new blank set creation?",
            (confirmed: boolean) => {
                if (confirmed) {
                    this.location.back();
                }
            });
    }

    get roundStrikeCriteriaFormItems(): FormArray {
        return this.gameBlankSetParamsForm?.get('roundStrikeCriteriaFormItems') as FormArray;
    }

    saveNewBlankSet() {
        this.http.post<GameBlankSet>("/blanks/add", this.gameBlankSet).subscribe(response => {
            this.blankManagementService.addBlankSet(response);
            this.notificationService.pushNotification("Blank set was successfully added", 'success')
        });
        this.router.navigate(['/game', this.game.id, 'blanks']);
    }

    openBackgroundChooseWindow(rbsIndex: number) {
        this.backgroundService.cacheGame(this.game);
        sessionStorage.setItem("roundBlankSetIndex", String(rbsIndex));
        this.router.navigate(['/game', this.game.id, 'blanks', 'new', 'choose-background'])
    }

    init() {
        if (!this.gameBlankSet) {
            this.gameBlankSet = this.backgroundService.getCachedCurrentGameSet()!;
        }
        this.fieldSizeForm = this.fb.group({})
        this.gameBlankSetParamsForm = this.fb.group({
            blanksSetName: this.gameBlankSet.name,
            blanksCount: [this.gameBlankSet.numberOfBlanks, [Validators.required, Validators.min(1)]],
            roundStrikeCriteriaFormItems: this.fb.array(this.gameBlankSet.roundBlankSets.map(roundBlankSet => {
                this.fb.group({
                        strikeCriterion: new FormControl(roundBlankSet.strikeCriterion),
                        fieldSizeForm: this.fieldSizeForm
                    }
                )}))
        });
        this.roundStrikeCriteriaFormItems.valueChanges.subscribe(() => {
            this.gameBlankSetParamsForm.updateValueAndValidity();
        });
        this.gameBlankSetParamsForm.get('blanksCount')?.setValue(this.gameBlankSet.numberOfBlanks);
        this.gameBlankSetParamsForm.get('blanksSetName')?.setValue(this.gameBlankSet.name);

        this.gameBlankSetParamsForm.get('blanksCount')?.valueChanges.subscribe(newValue => {
            this.gameBlankSet.numberOfBlanks = newValue;
        });

        this.gameBlankSetParamsForm.get('blanksSetName')?.valueChanges.subscribe(newValue => {
            this.gameBlankSet.name = newValue;
        });

        this.roundStrikeCriteriaFormItems?.controls.forEach(control => {
            control.setValue(StrikeCriterion.ARTIST);
            const index = this.roundStrikeCriteriaFormItems.controls.indexOf(control);
            control.valueChanges.subscribe(newValue => {
                this.gameBlankSet.roundBlankSets[index].strikeCriterion = newValue;
            })
        });
    }
}
