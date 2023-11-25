import {Injectable} from "@angular/core";
import {MatSnackBar, MatSnackBarRef} from "@angular/material/snack-bar";
import {NotificationComponent} from "../notification/notification.component";

@Injectable({
    providedIn: 'root',
})
export class NotificationService {

    private queue: MatSnackBarRef<NotificationComponent>[] = [];

    constructor(private snackBar: MatSnackBar) {
    }

    public showNotification(message: string, icon?: string, duration: number = 5000): void {
        let snackBarRef = this.snackBar.openFromComponent(NotificationComponent, {
            data: {
                message: message,
                icon: icon,
                duration: duration,
                horizontalPosition: 'end',
                verticalPosition: 'top',
            }
        });

        /*snackBarRef.afterDismissed().subscribe(() => {
            this.queue.shift();
            if (this.queue.length > 0) {
                this.queue[0].dismiss();
            }
        });

        this.queue.push(snackBarRef);

        if (this.queue.length === 1) {
            snackBarRef.dismiss();
        }*/
    }


}