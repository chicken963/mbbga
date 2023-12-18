import {Injectable} from "@angular/core";
import {MatSnackBar, MatSnackBarRef} from "@angular/material/snack-bar";
import {NotificationComponent} from "../notification/notification.component";

@Injectable({
    providedIn: 'root',
})
export class NotificationService {
    private notifications: NotificationMessage[] = [];
    private snackBarRef: MatSnackBarRef<NotificationComponent>;
    private snackBarIsDisplayed: boolean = false;

    constructor(private snackBar: MatSnackBar) {
    }

    public pushNotification(message: string, type?: NotificationType, duration: number = 500000): void {
        let notification = {message: message, icon: type ? type : "info"};
        this.notifications.push(notification);
        if (!this.snackBarIsDisplayed) {
            this.snackBarRef = this.snackBar.openFromComponent(NotificationComponent, {
                horizontalPosition: 'end',
                verticalPosition: 'top',
                data: { notifications: this.notifications }
            });
            this.snackBarIsDisplayed = true;
        }
        setTimeout(() => this.snackBarRef.instance.removeMessage(notification), duration);

        this.snackBarRef.afterDismissed().subscribe(() => {
            this.snackBarIsDisplayed = false;
        });
    }
}

export type NotificationMessage = {
    message: string;
    icon: NotificationType;
}

export type NotificationType = "success" | "error" | "info";