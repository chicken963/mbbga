import {Component, ElementRef, HostListener, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {CloseDialogPopupComponent} from "../close-dialog-popup/close-dialog-popup.component";
import {LocalAudioService} from "../local-audio/local-audio-service";
import {LocalAudioTrack} from "../local-audio/local-audio-track";
import {HttpClient} from "@angular/common/http";
import {LoadingService} from "../loading.service";
import {OkPopupComponent} from "../ok-popup/ok-popup.component";
import {TimeConversionService} from "../time-conversion.service";

@Component({
    selector: 'app-add-audiotracks-workbench',
    templateUrl: './add-audiotracks-workbench.component.html',
    styleUrls: ['./add-audiotracks-workbench.components.scss']
})
export class AddAudiotracksWorkbenchComponent {

    private dialogIsOpened: boolean = false;
    audiotracks: LocalAudioTrack[] = [];

    constructor(@Inject(MAT_DIALOG_DATA) public data: File[],
                private dialog: MatDialog,
                private selfDialogRef: MatDialogRef<AddAudiotracksWorkbenchComponent>,
                private elementRef: ElementRef,
                private localAudioService: LocalAudioService,
                private http: HttpClient,
                private loadingService: LoadingService,
                private timeConversionService: TimeConversionService) {
        data.map(file => this.localAudioService.toLocalAudioTrack(file)
            .then(audiotrack => this.audiotracks.push(audiotrack)));
    }


    @HostListener('document:mousedown', ['$event'])
    onClickOutside(event: Event): void {
        if (!this.elementRef.nativeElement.contains(event.target) && !this.dialogIsOpened) {
            this.dialogIsOpened = true;
            this.openConfirmationDialog();
        }
    }

    openConfirmationDialog(): void {
        const confirmationDialogRef = this.dialog.open(CloseDialogPopupComponent);
        confirmationDialogRef.afterClosed().subscribe((confirmed: boolean) => {
            this.dialogIsOpened = false;
            if (confirmed) {
                this.selfDialogRef.close();
            }
        });
    }

    addToLibrary() {
        this.loadingService.show();
        let counter = 0;
        for (let audiotrack of this.audiotracks) {
            const formData = new FormData();
            formData.append('file', audiotrack.file, audiotrack.name);
            this.http.post("/audiotracks/add", audiotrack.file, {
                params:
                    {
                        artist: audiotrack.artist,
                        name: audiotrack.name,
                        start: audiotrack.startTime,
                        end: audiotrack.endTime,
                        duration: audiotrack.length
                    }
            }).subscribe(response => {
                counter += 1;
                if (counter == this.audiotracks.length) {
                    this.loadingService.hide();
                    this.dialogIsOpened = true;
                    const confirmationDialogRef = this.dialog.open(OkPopupComponent,
                        {
                            data: {
                                header: "Success",
                                content: "Audio tracks successfully added to library."
                            }
                        });
                    confirmationDialogRef.afterClosed().subscribe(() => {
                        this.selfDialogRef.close();
                        this.dialogIsOpened = false;
                    });
                }
            },
                error => {
                    counter += 1;
                    if (counter == this.audiotracks.length) {
                        this.loadingService.hide();
                        this.dialogIsOpened = true;
                        const confirmationDialogRef = this.dialog.open(OkPopupComponent,
                            {
                                data: {
                                    header: "Error",
                                    content: "Something went wrong. Reason: " + error.message
                                }
                            });
                        confirmationDialogRef.afterClosed().subscribe(() => {
                            this.selfDialogRef.close();
                            this.dialogIsOpened = false;
                        });
                    }
                })
        }
    }

    updateStartTime($event: any, audiotrack: LocalAudioTrack) {
        audiotrack.startTime = this.timeConversionService.stringToSeconds($event.target.value);
    }

    updateEndTime($event: any, audiotrack: LocalAudioTrack) {
        audiotrack.endTime = this.timeConversionService.stringToSeconds($event.target.value);
    }
}
