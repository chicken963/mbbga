import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material.module';
import { PlayerComponent } from './pages/player/player.component';
import {AuthInterceptor} from "./services/auth-interceptor.service";
import { LoginComponent } from './login/login.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import { LeftMenuComponent } from './left-menu/left-menu.component';
import { TopBarComponent } from './top-bar/top-bar.component';
import {MatSidenavModule} from "@angular/material/sidenav";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatMenuModule} from "@angular/material/menu";
import {LibraryModule} from "./library/library.module";
import { OkPopupComponent } from './ok-popup/ok-popup.component';
import {MatDialogModule} from "@angular/material/dialog";
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { NotificationComponent } from './notification/notification.component';
import {TimeFormatModule} from "./time-format/time-format.module";
import {MatLineModule} from "@angular/material/core";
import { RegistrationComponent } from './registration/registration.component';
import { GamesDashboardComponent } from './games-dashboard/games-dashboard.component';
import { UsersDashboardComponent } from './users-dashboard/users-dashboard.component';
import {MatTabsModule} from "@angular/material/tabs";
import { GamesTableComponent } from './games-table/games-table.component';
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import { GameCardComponent } from './game-card/game-card.component';
import {FlexLayoutModule} from "@angular/flex-layout";
import { CreateGameComponent } from './create-game/create-game.component';
import { DatePipe } from './date.pipe';
import {MatTooltipModule} from "@angular/material/tooltip";
import { CreateRoundComponent } from './create-round/create-round.component';
import {MatSelectModule} from "@angular/material/select";
import { WinConditionsFormComponent } from './win-conditions-form/win-conditions-form.component';
import { FieldSizeFormComponent } from './field-size-form/field-size-form.component';
import {MatTableModule} from "@angular/material/table";
import {RoundTableWorkbenchModule} from "./round-table-workbench/round-table-workbench.module";
import { AudiotrackVersionEditInputsComponent } from './audiotrack-version-edit-inputs/audiotrack-version-edit-inputs.component';

@NgModule({
    declarations: [
        AppComponent,
        PlayerComponent,
        LoginComponent,
        LeftMenuComponent,
        TopBarComponent,
        OkPopupComponent,
        NotificationComponent,
        RegistrationComponent,
        GamesDashboardComponent,
        UsersDashboardComponent,
        GamesTableComponent,
        GameCardComponent,
        CreateGameComponent,
        DatePipe,
        CreateRoundComponent,
        WinConditionsFormComponent,
        FieldSizeFormComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        HttpClientModule,
        BrowserAnimationsModule,
        MaterialModule,
        ScrollingModule,
        FormsModule,
        MatSidenavModule,
        MatFormFieldModule,
        ReactiveFormsModule,
        MatInputModule,
        MatMenuModule,
        LibraryModule,
        MatDialogModule,
        MatSnackBarModule,
        TimeFormatModule,
        MatLineModule,
        MatTabsModule,
        MatProgressSpinnerModule,
        FlexLayoutModule,
        MatTooltipModule,
        MatSelectModule,
        MatTableModule,
        RoundTableWorkbenchModule
    ],
    providers: [
        MatSnackBarModule,
        {
            provide: HTTP_INTERCEPTORS,
            useClass: AuthInterceptor,
            multi: true
        }
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
