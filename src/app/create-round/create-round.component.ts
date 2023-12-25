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

    controls: AbstractControl[] = [];
    winConditions: WinCondition[] = [];
    subscriptions: Subscription[] = [];


    winConditionTypes: WinConditionType[] = Object.values(WinConditionType);
    attemptToCreateHarderThanFull: boolean = false;

    constructor(private fb: FormBuilder) {
    }

    ngOnInit() {
        this.roundForm = this.fb.group({
            name: [this.round.name],
            winConditionFormItems: this.fb.array([]),
        });
        this.round.winConditions.forEach(winCondition => this.addItem(winCondition));
        this.subscribeToFormArrayChanges();
    }

    get winConditionFormItems(): FormArray {
        return this.roundForm.get('winConditionFormItems') as FormArray;
    }

    createItem(item: WinCondition, index: number): FormGroup {
        return this.fb.group({
            type: new FormControl(item.type),
            weight: new FormControl(item.weight, [this.neighbourWeightsMatcher.bind(this, index)])
        });
    }

    addItem(newWinCondition: WinCondition): void {
        if (this.winConditions[this.winConditions.length - 1]?.type === this.winConditionTypes[1]) {
            this.attemptToCreateHarderThanFull = true;
            return;
        }
        this.attemptToCreateHarderThanFull = false;
        this.winConditions.push(newWinCondition)

        let control = this.createItem(newWinCondition, this.winConditions.length - 1);
        this.winConditionFormItems.push(control);

        let subscription = control.valueChanges.subscribe((newValue) => {
            this.attemptToCreateHarderThanFull = false;
            let index = this.subscriptions.indexOf(subscription);
            if (this.winConditions[index].type === WinConditionType.LINES && newValue.type === WinConditionType.FULL) {
                for(let i = this.winConditions.length - 1; i > index; i--) {
                    this.removeItem(i);
                }
            }
            this.winConditions[index] = newValue;
        });
        this.controls.push(control);
        this.subscriptions.push(subscription);


    }

    removeItem(index: number): void {
        this.attemptToCreateHarderThanFull = false;
        this.subscriptions[index].unsubscribe();
        this.subscriptions.splice(index, 1);
        this.controls.splice(index, 1);
        this.winConditions.splice(index, 1);
        this.winConditionFormItems.removeAt(index);
    }

    incrementLinesCount(i: number) {
        this.winConditions[i].weight! += 1;
        this.controls[i].setValue(this.winConditions[i]);
    }

    decrementLinesCount(i: number) {
        if (this.winConditions[i].weight && this.winConditions[i].weight! > 1) {
            this.winConditions[i].weight! -= 1;
            this.controls[i].setValue(this.winConditions[i]);
        }
    }

    subscribeToFormArrayChanges(): void {
        this.roundForm.get('name')?.valueChanges.subscribe(newValue => {
            this.round.name = newValue;
        })
    }

    neighbourWeightsMatcher(index: number, weightControl: AbstractControl) {
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
        const currentWeight = this?.winConditions[index]?.weight;
        const nextWeight = this?.winConditions[index + 1]?.weight;
        return nextWeight <= currentWeight;
    }

    easierThanPreviousMatcher(index: number): boolean | null {
        if (index === 0) {
            return null;
        }
        const currentWeight = this?.winConditions[index]?.weight;
        const previousWeight = this?.winConditions[index - 1]?.weight;
        return previousWeight >= currentWeight;
    }

}
