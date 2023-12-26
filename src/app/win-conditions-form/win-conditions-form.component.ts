import {Component, Input, OnInit} from '@angular/core';
import {WinCondition, WinConditionType} from "../interfaces/win-condition";
import {Round} from "../interfaces/round";
import {Subscription} from "rxjs";
import {AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-win-conditions-form',
  templateUrl: './win-conditions-form.component.html',
  styleUrls: ['./win-conditions-form.component.scss',
              './../common-styles/round-workbench-groups.scss']
})
export class WinConditionsFormComponent implements OnInit {

  @Input("round")
  round: Round;

  @Input("winConditionsForm")
  winConditionsForm: FormGroup;

  winConditionTypes: WinConditionType[] = Object.values(WinConditionType);
  attemptToCreateHarderThanFull: boolean = false;

  linesCountControls: AbstractControl[] = [];
  subscriptions: Subscription[] = [];

  constructor(private fb: FormBuilder) {
  }

  ngOnInit(): void {
    console.log(this.round.winConditions)
    this.round?.winConditions.forEach(winCondition => this.addControlAndSubscription(winCondition));
  }

  get winConditionFormItems(): FormArray {
    return this.winConditionsForm.get('winConditionFormItems') as FormArray;
  }

  addControlAndSubscription(newWinCondition: WinCondition): void {
    let winConditionFormControl = this.createItem(newWinCondition, this.round.winConditions.length - 1);

    let subscription = winConditionFormControl.valueChanges.subscribe((newValue) => {
      console.log(this.round)
      this.handleWinConditionChange(subscription, newValue);
    });
    this.subscriptions.push(subscription);
  }

  private lastWinConditionIsFull() {
    return this.round.winConditions[this.round.winConditions.length - 1]?.type === this.winConditionTypes[1];
  }

  private handleWinConditionChange(subscription: Subscription, newValue: WinCondition) {
    this.attemptToCreateHarderThanFull = false;
    let index = this.subscriptions.indexOf(subscription);
    if (this.round.winConditions[index].type === WinConditionType.LINES && newValue.type === WinConditionType.FULL) {
      for (let i = this.round.winConditions.length - 1; i > index; i--) {
        this.removeItem(i);
      }
    }
    this.round.winConditions[index] = newValue;
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
    this.round.winConditions.splice(index, 1);
    this.winConditionFormItems.removeAt(index);
  }

  incrementLinesCount(i: number) {
    this.round.winConditions[i].linesCount! += 1;
    this.linesCountControls[i].setValue(this.round.winConditions[i].linesCount);
  }

  decrementLinesCount(i: number) {
    if (this.round.winConditions[i].linesCount && this.round.winConditions[i].linesCount! > 1) {
      this.round.winConditions[i].linesCount! -= 1;
      this.linesCountControls[i].setValue(this.round.winConditions[i].linesCount);
    }
  }

  neighbourLinesCountsMatcher(index: number, linesCountControl: AbstractControl) {
    if (this?.round.winConditions[index]?.type === WinConditionType.FULL) {
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
    if (this?.round.winConditions[index + 1]?.type === WinConditionType.FULL) {
      return null;
    }
    const currentLinesCount = this?.round.winConditions[index]?.linesCount;
    const nextLinesCount = this?.round.winConditions[index + 1]?.linesCount;
    return nextLinesCount <= currentLinesCount;
  }

  easierThanPreviousMatcher(index: number): boolean | null {
    if (index === 0) {
      return null;
    }
    const currentLinesCount = this?.round.winConditions[index]?.linesCount;
    const previousLinesCount = this?.round.winConditions[index - 1]?.linesCount;
    return previousLinesCount >= currentLinesCount;
  }

  addItemIfPossible(newWinCondition: WinCondition) {
    if (this.lastWinConditionIsFull()) {
      this.attemptToCreateHarderThanFull = true;
      return;
    }
    this.attemptToCreateHarderThanFull = false;
    this.round.winConditions.push(newWinCondition)
    this.addControlAndSubscription(newWinCondition);
  }
}
