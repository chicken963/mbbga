import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RoundAudiotracksWorkbenchComponent} from "../round-audiotracks-workbench/round-audiotracks-workbench.component";
import {RoundPlaylistComponent} from "../round-playlist/round-playlist.component";
import {LibraryModule} from "../library/library.module";
import {MatTableModule} from "@angular/material/table";
import {MatIconModule} from "@angular/material/icon";
import {MatTooltipModule} from "@angular/material/tooltip";
import {MatButtonModule} from "@angular/material/button";
import {TimeFormatModule} from "../time-format/time-format.module";
import {MatDialogModule} from "@angular/material/dialog";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {RoundPlayerComponent} from "../round-player/round-player.component";
import {MatCardModule} from "@angular/material/card";
import { RoundPlaybackButtonsComponent } from '../round-playback-buttons/round-playback-buttons.component';



@NgModule({
  declarations: [
    RoundAudiotracksWorkbenchComponent,
    RoundPlaylistComponent,
    RoundPlayerComponent,
    RoundPlaybackButtonsComponent
  ],
    exports: [
        RoundPlaylistComponent,
        RoundPlayerComponent
    ],
    imports: [
        CommonModule,
        LibraryModule,
        MatTableModule,
        MatIconModule,
        MatTooltipModule,
        MatButtonModule,
        TimeFormatModule,
        MatDialogModule,
        MatProgressSpinnerModule,
        MatCardModule
    ]
})
export class RoundTableWorkbenchModule { }
