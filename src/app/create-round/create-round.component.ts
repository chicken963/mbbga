import {Component, Input} from '@angular/core';
import {Round} from "../interfaces/round";
import {AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {WinCondition, WinConditionType} from "../interfaces/win-condition";
import {Subscription} from "rxjs";

@Component({
    selector: 'app-create-round',
    templateUrl: './create-round.component.html',
    styleUrls: ['./create-round.component.scss']
})
export class CreateRoundComponent {

    @Input("round")
    round: Round;
    roundForm: FormGroup;

    linesCountControls: AbstractControl[] = [];
    winConditions: WinCondition[] = [];
    subscriptions: Subscription[] = [];


    winConditionTypes: WinConditionType[] = Object.values(WinConditionType);
    attemptToCreateHarderThanFull: boolean = false;

    sizeOptions: number[] = Array.from({ length: 15 }, (_, index) => index + 1);

    constructor(private fb: FormBuilder) {
    }

    ngOnInit() {
        this.roundForm = this.fb.group({
            name: [this.round.name],
            height: [this.round.fieldSize[0]],
            width: [this.round.fieldSize[1]],
            winConditionFormItems: this.fb.array([]),
        });
        this.round.winConditions.forEach(winCondition => this.addItem(winCondition));
        this.subscribeToRoundFormChanges();
    }

    get winConditionFormItems(): FormArray {
        return this.roundForm.get('winConditionFormItems') as FormArray;
    }

    addItem(newWinCondition: WinCondition): void {
        if (this.lastWinConditionIsFull()) {
            this.attemptToCreateHarderThanFull = true;
            return;
        }
        this.attemptToCreateHarderThanFull = false;
        this.winConditions.push(newWinCondition)

        let winConditionFormControl = this.createItem(newWinCondition, this.winConditions.length - 1);

        let subscription = winConditionFormControl.valueChanges.subscribe((newValue) => {
            this.handleWinConditionChange(subscription, newValue);
        });
        this.subscriptions.push(subscription);
    }

    private lastWinConditionIsFull() {
        return this.winConditions[this.winConditions.length - 1]?.type === this.winConditionTypes[1];
    }

    private handleWinConditionChange(subscription: Subscription, newValue: WinCondition) {
        this.attemptToCreateHarderThanFull = false;
        let index = this.subscriptions.indexOf(subscription);
        if (this.winConditions[index].type === WinConditionType.LINES && newValue.type === WinConditionType.FULL) {
            for (let i = this.winConditions.length - 1; i > index; i--) {
                this.removeItem(i);
            }
        }
        this.winConditions[index] = newValue;
    }

    createItem(item: WinCondition, index: number): FormGroup {
        let linesCountFormControl = new FormControl(item.linesCount, [Validators.required, this.neighbourLinesCountsMatcher.bind(this, index)])
        this.linesCountControls.push(linesCountFormControl);
        let winConditionFormGroup =  this.fb.group({
            type: new FormControl(item.type),
            linesCount: linesCountFormControl
        });
        this.winConditionFormItems.push(winConditionFormGroup);
        return winConditionFormGroup;
    }

    removeItem(index: number): void {
        this.attemptToCreateHarderThanFull = false;
        this.subscriptions[index].unsubscribe();
        this.subscriptions.splice(index, 1);
        this.linesCountControls.splice(index, 1);
        this.winConditions.splice(index, 1);
        this.winConditionFormItems.removeAt(index);
    }

    incrementLinesCount(i: number) {
        this.winConditions[i].linesCount! += 1;
        this.linesCountControls[i].setValue(this.winConditions[i].linesCount);
    }

    decrementLinesCount(i: number) {
        if (this.winConditions[i].linesCount && this.winConditions[i].linesCount! > 1) {
            this.winConditions[i].linesCount! -= 1;
            this.linesCountControls[i].setValue(this.winConditions[i].linesCount);
        }
    }

    subscribeToRoundFormChanges(): void {
        this.roundForm.get('name')?.valueChanges.subscribe(newValue => {
            this.round.name = newValue;
        })
        this.roundForm.get('height')?.valueChanges.subscribe(newValue => {
            console.log(newValue)
            this.round.fieldSize[0] = newValue;
        })
        this.roundForm.get('width')?.valueChanges.subscribe(newValue => {
            this.round.fieldSize[1] = newValue;
        })
    }

    neighbourLinesCountsMatcher(index: number, linesCountControl: AbstractControl) {
        if (this?.winConditions[index]?.type === WinConditionType.FULL) {
            return null;
        }
        if (this.easierThanPreviousMatcher(index)) {
            return {easierThanPrevious: true}
        }
        if (this?.harderThanNextMatcher(index)) {
            return {harderThanNext: true};
        }
        return null;
    }

    harderThanNextMatcher(index: number): boolean | null {
        if (this?.winConditions[index + 1]?.type === WinConditionType.FULL) {
            return null;
        }
        const currentLinesCount = this?.winConditions[index]?.linesCount;
        const nextLinesCount = this?.winConditions[index + 1]?.linesCount;
        return nextLinesCount <= currentLinesCount;
    }

    easierThanPreviousMatcher(index: number): boolean | null {
        if (index === 0) {
            return null;
        }
        const currentLinesCount = this?.winConditions[index]?.linesCount;
        const previousLinesCount = this?.winConditions[index - 1]?.linesCount;
        return previousLinesCount >= currentLinesCount;
    }

}
