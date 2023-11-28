import {Injectable} from "@angular/core";
import {MatSnackBar, MatSnackBarRef} from "@angular/material/snack-bar";
import {NotificationComponent} from "../notification/notification.component";

@Injectable({
    providedIn: 'root',
})
export class NotificationService {
    private messages: string[] = [];
    private snackBarRef: MatSnackBarRef<NotificationComponent>;
    private snackBarIsDisplayed: boolean = false;

    constructor(private snackBar: MatSnackBar) {
    }

    public pushNotification(message: string, icon?: string, duration: number = 5000): void {
        this.messages.push(message);
        if (!this.snackBarIsDisplayed) {
            this.snackBarRef = this.snackBar.openFromComponent(NotificationComponent, {
                horizontalPosition: 'end',
                verticalPosition: 'top',
                data: {
                    messages: this.messages,
                    icon: icon
                }
            });
            this.snackBarIsDisplayed = true;
        }
        setTimeout(() => this.snackBarRef.instance.removeMessage(message), duration);

        this.snackBarRef.afterDismissed().subscribe(() => {
            this.snackBarIsDisplayed = false;
        });
    }


}