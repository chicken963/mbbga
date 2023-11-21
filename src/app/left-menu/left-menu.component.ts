import { Component } from '@angular/core';
import {animate, state, style, transition, trigger} from "@angular/animations";
import {ToggleLeftServiceService} from "../services/toggle-left-service.service";
import {AuthService} from "../services/auth.service";

@Component({
  selector: 'app-left-menu',
  templateUrl: './left-menu.component.html',
  styleUrls: ['./left-menu.component.css']
})
export class LeftMenuComponent {

  constructor(private authService: AuthService) {
  }

  ngOnInit() {}

  isAuthorized(): boolean {
    return this.authService.isAuthorized();
  }
}
