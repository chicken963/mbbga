import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {LibraryComponent} from './library.component';
import {MatExpansionModule} from "@angular/material/expansion";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {MatDialogModule} from '@angular/material/dialog';
import {AddAudiotracksWorkbenchComponent} from '../add-audiotracks-workbench/add-audiotracks-workbench.component';
import {FileDialogComponent} from '../file-dialog/file-dialog.component';
import {CloseDialogPopupComponent} from '../close-dialog-popup/close-dialog-popup.component';
import {MatInputModule} from "@angular/material/input";
import {AudioTimeDirective} from '../audio-time.directive';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {TimeFormatModule} from "../time-format/time-format.module";
import {LibraryContentComponent} from '../library-content/library-content.component';

import {MatSliderModule} from '@angular/material/slider';
import {AudioControlsComponent} from "../audio-controls/audio-controls.component";
import {MatListModule} from "@angular/material/list";
import {RangeSliderComponent} from "../range-slider/range-slider.component";
import {MatCardModule} from "@angular/material/card";
import {VolumeSliderComponent} from "../volume-slider/volume-slider.component";
import {AudiotrackEditInputsComponent} from '../audiotrack-edit-inputs/audiotrack-edit-inputs.component';
import {AudiotrackVersionControlsComponent} from '../audiotrack-version-controls/audiotrack-version-controls.component';
import {AudiotrackViewInputsComponent} from '../audiotrack-view-inputs/audiotrack-view-inputs.component';
import {MatTooltipModule} from '@angular/material/tooltip';
import {LibraryArtistComponent} from '../library-artist/library-artist.component';
import {HighlightPipe} from "../highlight.pipe";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {RoundAudiotracksWorkbenchComponent} from "../round-audiotracks-workbench/round-audiotracks-workbench.component";
import {RoundPlaylistComponent} from "../round-playlist/round-playlist.component";
import {MatTableModule} from "@angular/material/table";
import {ParentWidthDirective} from "../parent-width.directive";
import {
    AudiotrackVersionEditInputsComponent
} from "../audiotrack-version-edit-inputs/audiotrack-version-edit-inputs.component";
import { AudiotrackVersionModeButtonsComponent } from '../audiotrack-version-mode-buttons/audiotrack-version-mode-buttons.component';
import { AudiotrackVersionPlaybackButtonsComponent } from '../audiotrack-version-playback-buttons/audiotrack-version-playback-buttons.component';
import { AudiotrackModeButtonsComponent } from '../audiotrack-mode-buttons/audiotrack-mode-buttons.component';


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
        AudiotrackVersionControlsComponent,
        AudiotrackVersionEditInputsComponent,
        AudiotrackViewInputsComponent,
        LibraryArtistComponent,
        HighlightPipe,
        ParentWidthDirective,
        AudiotrackVersionModeButtonsComponent,
        AudiotrackVersionPlaybackButtonsComponent,
        AudiotrackModeButtonsComponent
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
        MatCardModule,
        ReactiveFormsModule,
        MatTooltipModule,
        MatCheckboxModule,
        MatTableModule
    ],
    entryComponents: [AddAudiotracksWorkbenchComponent],
    exports: [
        HighlightPipe,
        LibraryComponent,
        ParentWidthDirective
    ]
})
export class LibraryModule {
}
