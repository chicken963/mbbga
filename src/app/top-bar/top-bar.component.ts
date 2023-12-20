import {Component, OnInit} from '@angular/core';
import {ToggleLeftServiceService} from "../services/toggle-left-service.service";
import {AuthService} from "../services/auth.service";
import {map, Observable} from "rxjs";

@Component({
    selector: 'app-top-bar',
    templateUrl: './top-bar.component.html',
    styleUrls: ['./top-bar.component.css']
})
export class TopBarComponent implements OnInit {

    userLogin: string;

    constructor(private leftBarService: ToggleLeftServiceService,
                private authService: AuthService) {
    }

    ngOnInit() {
        this.getCurrentUser();
    }

    toggleLeftMenu() {
        this.leftBarService.emitEvent();
    }

    isAuthorized(): boolean {
        return this.authService.isAuthorized();
    }

    getCurrentUser(): void {
        this.authService.getUser().pipe(map(user => user.username)).subscribe(
            login => this.userLogin = login);
    }

    logout() {
        this.authService.logout();
    }
}
