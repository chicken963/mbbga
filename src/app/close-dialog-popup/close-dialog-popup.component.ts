import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-close-dialog-popup',
  templateUrl: './close-dialog-popup.component.html',
  styleUrls: ['./close-dialog-popup.component.css']
})
export class CloseDialogPopupComponent {
  constructor(private dialogRef: MatDialogRef<CloseDialogPopupComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,) {}

  onConfirm(): void {
    this.dialogRef.close(true);
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}
