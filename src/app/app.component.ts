import {Component, ViewChild} from '@angular/core';
import {ToggleLeftServiceService} from "./services/toggle-left-service.service";
import {animate, state, style, transition, trigger} from "@angular/animations";
import {LeftMenuComponent} from "./left-menu/left-menu.component";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [
    trigger('slideInOut', [
      state('true', style({ transform: 'translateX(0)' })),
      state('false', style({ transform: 'translateX(-100%)' })),
      transition('true => false, false => true', animate('300ms ease-out')),
    ]),
  ]
})
export class AppComponent {
  title = 'mbbga';
  isMenuVisible = true;

  constructor(private toggleService: ToggleLeftServiceService) {
    this.toggleService.event$.subscribe((value) => {
      this.isMenuVisible = value;
    });
  }
}
