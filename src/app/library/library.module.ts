import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LibraryComponent } from './library.component';
import {MatExpansionModule} from "@angular/material/expansion";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import { MatDialogModule } from '@angular/material/dialog';
import { AddAudiotracksWorkbenchComponent } from '../add-audiotracks-workbench/add-audiotracks-workbench.component';
import { FileDialogComponent } from '../file-dialog/file-dialog.component';
import { CloseDialogPopupComponent } from '../close-dialog-popup/close-dialog-popup.component';
import {MatInputModule} from "@angular/material/input";
import { AudioTimeDirective } from '../audio-time.directive';
import {FormsModule} from "@angular/forms";
import {TimeFormatModule} from "../time-format/time-format.module";
import { LibraryContentComponent } from '../library-content/library-content.component';

import {MatSliderModule} from '@angular/material/slider';
import {AudioControlsComponent} from "../audio-controls/audio-controls.component";
import {MatListModule} from "@angular/material/list";
import {RangeSliderComponent} from "../range-slider/range-slider.component";
import {MatCardModule} from "@angular/material/card";
import {AppModule} from "../app.module";
import {VolumeSliderComponent} from "../volume-slider/volume-slider.component";
import { AudiotrackEditInputsComponent } from '../audiotrack-edit-inputs/audiotrack-edit-inputs.component';
import { AudiotrackEditControlsComponent } from '../audiotrack-edit-controls/audiotrack-edit-controls.component';



@NgModule({
  declarations: [
    LibraryComponent,
    AddAudiotracksWorkbenchComponent,
    FileDialogComponent,
    CloseDialogPopupComponent,
    AudioTimeDirective,
    LibraryContentComponent,
    AudioControlsComponent,
    VolumeSliderComponent,
    AudiotrackEditInputsComponent,
    AudiotrackEditControlsComponent
  ],
    imports: [
        CommonModule,
        MatExpansionModule,
        MatProgressSpinnerModule,
        MatButtonModule,
        MatIconModule,
        MatDialogModule,
        MatInputModule,
        FormsModule,
        TimeFormatModule,
        MatSliderModule,
        MatListModule,
        RangeSliderComponent,
        MatCardModule
    ],
  entryComponents: [AddAudiotracksWorkbenchComponent]
})
export class LibraryModule { }
