import {Injectable} from "@angular/core";
import {MatSnackBar, MatSnackBarRef} from "@angular/material/snack-bar";
import {NotificationComponent} from "../notification/notification.component";

@Injectable({
    providedIn: 'root',
})
export class NotificationService {
    private index: number = 0;
    private messages: string[] = [];
    private snackBarRef: MatSnackBarRef<NotificationComponent> | null = null;

    constructor(private snackBar: MatSnackBar) {
    }

    public showNotification(message: string, icon?: string, duration: number = 5000): void {
        console.log("showing notification " + this.index++);
        this.messages.push(message);
        if (this.snackBarRef === null) {
            this.snackBarRef = this.snackBar.openFromComponent(NotificationComponent, {
                horizontalPosition: 'end',
                verticalPosition: 'top',
                data: {
                    message: this.messages,
                    icon: icon,
                    duration: duration,
                }
            });
        }
        let self = this;
        setTimeout(() => {
            self.messages.splice(self.messages.indexOf(message), 1);
            if (this.messages.length === 0) {
                self.snackBarRef?.dismiss();
            }
        }, duration);

        this.snackBarRef.afterDismissed().subscribe(() => {
            this.snackBarRef = null;
        });
    }


}