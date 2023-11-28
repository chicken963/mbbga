import {Component, Inject, Input} from '@angular/core';
import {MAT_SNACK_BAR_DATA, MatSnackBarRef} from "@angular/material/snack-bar";

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css']
})
export class NotificationComponent {

  constructor(public snackBarRef: MatSnackBarRef<NotificationComponent>,
              @Inject(MAT_SNACK_BAR_DATA) public data: any,) {}

  dismiss() {
    this.snackBarRef.dismiss();
  }

  removeMessage(messages: string[], message: string) {
    messages.splice(messages.indexOf(message), 1);
    if (messages.length === 0) {
      this.dismiss();
    }
  }
}
