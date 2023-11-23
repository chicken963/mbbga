import { Component, ElementRef, ViewChild } from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {AddAudiotracksWorkbenchComponent} from "../add-audiotracks-workbench/add-audiotracks-workbench.component";

@Component({
  selector: 'app-file-dialog',
  templateUrl: './file-dialog.component.html',
  styleUrls: ['./file-dialog.component.css']
})
export class FileDialogComponent {
  @ViewChild('fileInput') fileInput: ElementRef;

  constructor(private dialog: MatDialog) {}

  openFileDialog(): void {
    const dialogRef = this.dialog.open(FileDialogComponent);
    dialogRef.afterClosed().subscribe((selectedFiles: FileList) => {
      if (selectedFiles) {
        this.showWorkbench(selectedFiles);
      }
    });
  }


  showWorkbench(event: any) {
    const files = event.target.files;
    const dialogRef = this.dialog.open(AddAudiotracksWorkbenchComponent, {
      width: '90%',
      data: Array.from(files)
    });

    dialogRef.afterClosed().subscribe(result => {
      dialogRef.close();
    });
  }
}
