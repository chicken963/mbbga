import {Component, EventEmitter, Inject} from '@angular/core';
import {DialogService} from "../utils/dialog.service";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {Game} from "../interfaces/game";
import {StrikeCriterion} from "../interfaces/blank/strike-criterion";
import {GameBlankSet} from "../interfaces/blank/game-blank-set";
import {RoundBlankSet} from "../interfaces/blank/round-blank-set";
import {AuthService} from "../services/auth.service";
import {HttpClient} from "@angular/common/http";
import {BlankManagementService} from "../services/blank-management.service";

@Component({
    selector: 'app-create-game-blank-set',
    templateUrl: './create-game-blank-set.component.html',
    styleUrls: ['./create-game-blank-set.component.scss', './../common-styles/round-workbench-groups.scss']
})
export class CreateGameBlankSetComponent {
    gameBlankSetParamsForm: FormGroup;
    game: Game;
    strikeCriteria: StrikeCriterion[] = Object.values(StrikeCriterion)
    gameBlankSet: GameBlankSet;
    fieldSizeForm: FormGroup;

    constructor(@Inject(MAT_DIALOG_DATA) public data: any,
                private dialogService: DialogService,
                private authService: AuthService,
                private selfDialogRef: MatDialogRef<CreateGameBlankSetComponent>,
                private fb: FormBuilder,
                private http: HttpClient,
                private blankManagementService: BlankManagementService) {
        this.game = data.game;
        this.gameBlankSet = {
            name: "",
            owner: this.authService.user,
            game: {id: this.game.id},
            numberOfBlanks: 100,
            roundBlankSets: this.game.rounds.map(round => {
                return {
                    rowsCount: 5,
                    columnsCount: 5,
                    strikeCriterion: StrikeCriterion.ARTIST,
                    round: {id: round.id},
                    blanks: []
                } as RoundBlankSet
            })
        };
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
    }

    ngOnInit() {
        this.gameBlankSetParamsForm.get('blanksCount')?.setValue(this.gameBlankSet.numberOfBlanks);
        this.gameBlankSetParamsForm.get('blanksSetName')?.setValue(this.gameBlankSet.name);

        this.gameBlankSetParamsForm.get('blanksCount')?.valueChanges.subscribe(newValue => {
            this.gameBlankSet.numberOfBlanks = newValue;
        });

        this.gameBlankSetParamsForm.get('blanksSetName')?.valueChanges.subscribe(newValue => {
            this.gameBlankSet.name = newValue;
        });

        this.roundStrikeCriteriaFormItems.controls.forEach(control => {
            control.setValue(StrikeCriterion.ARTIST);
            const index = this.roundStrikeCriteriaFormItems.controls.indexOf(control);
            control.valueChanges.subscribe(newValue => {
                this.gameBlankSet.roundBlankSets[index].strikeCriterion = newValue;
            })
        });
    }


    openConfirmationDialog(): void {
        this.dialogService.openYesNoPopup("Are you sure you want to cancel new blank set creation?",
            (confirmed: boolean) => {
                if (confirmed) {
                    this.selfDialogRef.close();
                }
            });
    }

    setValue(i: number, enumValue: string) {

    }

    get roundStrikeCriteriaFormItems(): FormArray {
        return this.gameBlankSetParamsForm.get('roundStrikeCriteriaFormItems') as FormArray;
    }

    saveNewBlankSet() {
        this.http.post<GameBlankSet>("/blanks/add", this.gameBlankSet).subscribe(response => {
            this.blankManagementService.addBlankSet(response);
        });
        this.selfDialogRef.close();
    }
}
