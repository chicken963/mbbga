import { NgModule } from '@angular/core';
import {BrowserModule, HammerModule} from '@angular/platform-browser';
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
import { DateRefinePipe } from './date-refine.pipe';
import { GameBlanksWorkbenchComponent } from './game-blanks-workbench/game-blanks-workbench.component';
import { CreateGameBlankSetComponent } from './create-game-blank-set/create-game-blank-set.component';
import { CapitalizeFirstLetterPipe } from './capitalize-first-letter.pipe';
import { GameBlankSetComponent } from './game-blank-set/game-blank-set.component';
import { RoundBlankSetComponent } from './round-blank-set/round-blank-set.component';
import { BlankComponent } from './blank/blank.component';
import { BlankMiniatureComponent } from './blank-miniature/blank-miniature.component';
import { BackgroundSelectComponent } from './background-select/background-select.component';
import { CropperComponent } from './cropper/cropper.component';
import {DragDropModule} from "@angular/cdk/drag-drop";
import { TransformedAreaComponent } from './transformed-area/transformed-area.component';
import { CropBoundsEditorComponent } from './crop-counds-editor/crop-bounds-editor.component';
import { AreaFontConfiguratorComponent } from './area-font-configurator/area-font-configurator.component';
import { BlankSetSelectComponent } from './blank-set-select/blank-set-select.component';
import {MatRadioModule} from "@angular/material/radio";
import { GameplayDashboardComponent } from './gameplay-dashboard/gameplay-dashboard.component';

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
        FieldSizeFormComponent,
        DateRefinePipe,
        GameBlanksWorkbenchComponent,
        CreateGameBlankSetComponent,
        CapitalizeFirstLetterPipe,
        GameBlankSetComponent,
        RoundBlankSetComponent,
        BlankComponent,
        BlankMiniatureComponent,
        BackgroundSelectComponent,
        CropperComponent,
        TransformedAreaComponent,
        CropBoundsEditorComponent,
        AreaFontConfiguratorComponent,
        BlankSetSelectComponent,
        GameplayDashboardComponent
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
        RoundTableWorkbenchModule,
        HammerModule,
        DragDropModule,
        MatRadioModule
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
