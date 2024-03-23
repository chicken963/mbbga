import {Component, Input} from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators} from "@angular/forms";
import {RoundBlankSet} from "../interfaces/blank/round-blank-set";
import {Round} from "../interfaces/round";

@Component({
  selector: 'app-field-size-form',
  templateUrl: './field-size-form.component.html',
  styleUrls: ['./field-size-form.component.scss',
              './../common-styles/round-workbench-groups.scss']
})
export class FieldSizeFormComponent {

  @Input("roundBlankSet")
  roundBlankSet: RoundBlankSet;

  @Input("round")
  round: Round;

  @Input("fieldSizeForm")
  fieldSizeForm: FormGroup;

  sizeOptions: number[] = Array.from({ length: 15 }, (_, index) => index + 1);

  constructor(private fb: FormBuilder) {
  }

  ngOnInit() {
    this.fieldSizeForm = this.fb.group({
      height: this.roundBlankSet.rowsCount,
      width: this.roundBlankSet.columnsCount
    }, {
      validators: [this.multiplicationValidator()]
    });
    this.fieldSizeForm.get('height')?.valueChanges.subscribe(newValue => {
      this.roundBlankSet.rowsCount = newValue;
    })
    this.fieldSizeForm.get('width')?.valueChanges.subscribe(newValue => {
      this.roundBlankSet.columnsCount = newValue;
    })
  }

  multiplicationValidator() {
    return (control: AbstractControl): ValidationErrors | null => {
      const height = control.get('height')?.value;
      const width = control.get('width')?.value;

      const fieldSize = height * width;

      if (fieldSize > this.round.audioTracks.length) {
        return { tooBigField: true };
      }

      return null;
    };
  }

  get formControls() {
    return this.fieldSizeForm?.controls;
  }

}
