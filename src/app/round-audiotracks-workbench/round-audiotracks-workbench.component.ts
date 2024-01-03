import {Component, Inject, Optional} from '@angular/core';
import {MAT_DIALOG_DATA} from "@angular/material/dialog";
import {Round} from "../interfaces/round";

@Component({
  selector: 'app-round-audiotracks-workbench',
  templateUrl: './round-audiotracks-workbench.component.html',
  styleUrls: ['./round-audiotracks-workbench.component.css']
})
export class RoundAudiotracksWorkbenchComponent {

  constructor(@Inject(MAT_DIALOG_DATA) public round: Round) {
  }

}
