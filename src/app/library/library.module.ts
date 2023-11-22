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



@NgModule({
  declarations: [
    LibraryComponent,
    AddAudiotracksWorkbenchComponent,
    FileDialogComponent,
    CloseDialogPopupComponent
  ],
  imports: [
    CommonModule,
    MatExpansionModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule
  ],
  entryComponents: [AddAudiotracksWorkbenchComponent]
})
export class LibraryModule { }
