import {Component, ElementRef, HostListener, Inject, OnDestroy} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {CloseDialogPopupComponent} from "../close-dialog-popup/close-dialog-popup.component";

@Component({
  selector: 'app-add-audiotracks-workbench',
  templateUrl: './add-audiotracks-workbench.component.html',
  styleUrls: ['./add-audiotracks-workbench.component.css']
})
export class AddAudiotracksWorkbenchComponent implements OnDestroy {

  private confirmationDialogRef: any;
  private dialogIsOpened: boolean = false;

  constructor(@Inject(MAT_DIALOG_DATA) public data: File[],
              private dialog: MatDialog,
              private selfDialogRef: MatDialogRef<AddAudiotracksWorkbenchComponent>,
              private elementRef: ElementRef) {}


  @HostListener('document:mousedown', ['$event'])
  onClickOutside(event: Event): void {
    if (!this.elementRef.nativeElement.contains(event.target) && !this.dialogIsOpened) {
      this.dialogIsOpened = true;
      this.openConfirmationDialog();
    }
  }

  openConfirmationDialog(): void {
    this.confirmationDialogRef = this.dialog.open(CloseDialogPopupComponent, {
      data: { parent: this }
    });
    this.confirmationDialogRef.afterClosed().subscribe((confirmed: boolean) => {
      this.dialogIsOpened = false;
      if (confirmed) {
        this.selfDialogRef.close();
      }
    });
  }

  ngOnDestroy(): void {

  }

}
