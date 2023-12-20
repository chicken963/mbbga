import {Injectable} from "@angular/core";
import {MatDialog} from "@angular/material/dialog";
import {OkPopupComponent} from "../ok-popup/ok-popup.component";
import {CloseDialogPopupComponent} from "../close-dialog-popup/close-dialog-popup.component";

@Injectable({
    providedIn: 'root',
})
export class DialogService {

    constructor(private dialog: MatDialog) {
    }

    public showOkPopup(header: string = "", message: string, callback?: () => void) {
        const okPopupDialogRef = this.dialog.open(OkPopupComponent,
            {
                data: {
                    header: header,
                    content: message
                }
            });
        if (callback) {
            okPopupDialogRef.afterClosed().subscribe(callback);
        }
    }

    openYesNoPopup(message: string, callback: (confirmed: boolean) => void) {
        const confirmationDialogRef = this.dialog.open(CloseDialogPopupComponent,
            {
                data: {message: message},
                disableClose: true});
        confirmationDialogRef.afterClosed().subscribe(callback);
    }
}