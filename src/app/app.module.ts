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
import { WelcomeComponent } from './welcome/welcome.component';
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

@NgModule({
    declarations: [
        AppComponent,
        PlayerComponent,
        LoginComponent,
        WelcomeComponent,
        LeftMenuComponent,
        TopBarComponent,
        OkPopupComponent,
        NotificationComponent
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
        MatLineModule
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
