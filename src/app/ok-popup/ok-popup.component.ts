import {Component, Inject, Input} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";

interface PopupMetadata {
  header: string;
  content: string;
}

@Component({
  selector: 'app-ok-popup',
  templateUrl: './ok-popup.component.html',
  styleUrls: ['./ok-popup.component.css']
})
export class OkPopupComponent {

  constructor(@Inject(MAT_DIALOG_DATA) public message: PopupMetadata,
              private dialogRef: MatDialogRef<OkPopupComponent>) {}

  onConfirm(): void {
    this.dialogRef.close();
  }
}
