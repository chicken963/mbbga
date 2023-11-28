import {Component, Inject, Input, OnInit} from '@angular/core';
import {MAT_SNACK_BAR_DATA, MatSnackBarRef} from "@angular/material/snack-bar";

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css']
})
export class NotificationComponent {

  messages: string[] = [];

  constructor(public snackBarRef: MatSnackBarRef<NotificationComponent>,
              @Inject(MAT_SNACK_BAR_DATA) public data: any) {
    this.messages = this.data.messages;
  }

  removeMessage(message: string) {
    this.messages.splice(this.messages.indexOf(message), 1);
    if (this.messages.length === 0) {
      this.snackBarRef.dismiss();
    }
  }
}
