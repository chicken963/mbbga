import {Component, Inject} from '@angular/core';
import {MAT_SNACK_BAR_DATA, MatSnackBarRef} from "@angular/material/snack-bar";
import {NotificationMessage} from "../utils/notification.service";

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss']
})
export class NotificationComponent {

  notifications: NotificationMessage[] = [];

  constructor(public snackBarRef: MatSnackBarRef<NotificationComponent>,
              @Inject(MAT_SNACK_BAR_DATA) public data: any) {
    this.notifications = this.data.notifications;
  }

  removeMessage(notification: NotificationMessage) {
    this.notifications.splice(this.notifications.indexOf(notification), 1);
    if (this.notifications.length === 0) {
      this.snackBarRef.dismiss();
    }
  }
}
