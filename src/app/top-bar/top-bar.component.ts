import {Component} from '@angular/core';
import {ToggleLeftServiceService} from "../services/toggle-left-service.service";
import {AuthService} from "../services/auth.service";

@Component({
    selector: 'app-top-bar',
    templateUrl: './top-bar.component.html',
    styleUrls: ['./top-bar.component.css']
})
export class TopBarComponent {

    constructor(private leftBarService: ToggleLeftServiceService,
                private authService: AuthService) {
    }

    toggleLeftMenu() {
        this.leftBarService.emitEvent();
    }

    isAuthorized(): boolean {
        return this.authService.isAuthorized();
    }

    getCurrentUser(): string {
        return this.authService.getUser();
    }

    logout() {
        this.authService.logout();
    }
}
