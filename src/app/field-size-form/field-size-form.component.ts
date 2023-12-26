import {Component, Input} from '@angular/core';
import {Round} from "../interfaces/round";
import {FormBuilder, FormGroup} from "@angular/forms";

@Component({
  selector: 'app-field-size-form',
  templateUrl: './field-size-form.component.html',
  styleUrls: ['./field-size-form.component.css',
              './../common-styles/round-workbench-groups.scss']
})
export class FieldSizeFormComponent {

  @Input("round")
  round: Round;

  @Input("fieldSizeForm")
  fieldSizeForm: FormGroup;

  sizeOptions: number[] = Array.from({ length: 15 }, (_, index) => index + 1);

  constructor(private fb: FormBuilder) {
  }

  ngOnInit() {
    this.fieldSizeForm = this.fb.group({
      height: [this.round.fieldSize[0]],
      width: [this.round.fieldSize[1]]
    });
    this.fieldSizeForm.get('height')?.valueChanges.subscribe(newValue => {
      this.round.fieldSize[0] = newValue;
    })
    this.fieldSizeForm.get('width')?.valueChanges.subscribe(newValue => {
      this.round.fieldSize[1] = newValue;
    })
  }

}
