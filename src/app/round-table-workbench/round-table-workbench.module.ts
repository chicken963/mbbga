import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RoundAudiotracksWorkbenchComponent} from "../round-audiotracks-workbench/round-audiotracks-workbench.component";
import {RoundPlaylistComponent} from "../round-playlist/round-playlist.component";
import {LibraryModule} from "../library/library.module";
import {MatTableModule} from "@angular/material/table";



@NgModule({
  declarations: [
    RoundAudiotracksWorkbenchComponent,
    RoundPlaylistComponent
  ],
  exports: [
    RoundPlaylistComponent
  ],
  imports: [
    CommonModule,
    LibraryModule,
    MatTableModule
  ]
})
export class RoundTableWorkbenchModule { }
