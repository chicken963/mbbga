import {Component} from '@angular/core';
import {AuthService} from "../services/auth.service";
import {HttpClient} from "@angular/common/http";

@Component({
  selector: 'app-left-menu',
  templateUrl: './left-menu.component.html',
  styleUrls: ['./left-menu.component.css']
})
export class LeftMenuComponent {

  isAdmin: boolean;

  constructor(private authService: AuthService) {
  }

  ngOnInit() {
    this.authService.getUser().subscribe(user => {
      this.isAdmin = this.authService.isAdmin;
    })
  }

  isAuthorized(): boolean {
    return this.authService.isAuthorized();
  }
}
