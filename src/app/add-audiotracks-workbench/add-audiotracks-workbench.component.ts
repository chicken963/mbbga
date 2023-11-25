import {Component, ElementRef, HostListener, Inject, OnDestroy, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {CloseDialogPopupComponent} from "../close-dialog-popup/close-dialog-popup.component";
import {LocalAudioService} from "../local-audio/local-audio-service";
import {LocalAudioTrack} from "../local-audio/local-audio-track";
import {HttpClient} from "@angular/common/http";
import {OkPopupComponent} from "../ok-popup/ok-popup.component";
import {TimeConversionService} from "../time-conversion.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {AudioTrack} from "../interfaces/audiotrack";
import {NotificationComponent} from "../notification/notification.component";
import {NotificationService} from "../utils/notification.service";
import {DialogService} from "../utils/dialog.service";
import {LibraryService} from "../library-content/library.service";

@Component({
    selector: 'app-add-audiotracks-workbench',
    templateUrl: './add-audiotracks-workbench.component.html',
    styleUrls: ['./add-audiotracks-workbench.components.scss']
})
export class AddAudiotracksWorkbenchComponent {

    private dialogIsOpened: boolean = false;
    audiotracks: LocalAudioTrack[] = [];

    constructor(@Inject(MAT_DIALOG_DATA) public data: File[],
                private selfDialogRef: MatDialogRef<AddAudiotracksWorkbenchComponent>,
                private elementRef: ElementRef,
                private dialogService: DialogService,
                private localAudioService: LocalAudioService,
                private http: HttpClient,
                private timeConversionService: TimeConversionService,
                private notificationService: NotificationService,
                private libraryService: LibraryService) {
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
        this.dialogService.openYesNoPopup("Are you sure you want to interrupt adding audio tracks to library?\nAll changes will be lost.",
            (confirmed: boolean) => {
                this.dialogIsOpened = false;
                if (confirmed) {
                    this.selfDialogRef.close();
                }
            });
    }

    addToLibrary() {
        let counter = 0;
        let anyTrackFailed: boolean = false;
        for (let audiotrack of this.audiotracks) {
            const formData = new FormData();
            formData.append('file', audiotrack.file, audiotrack.name);
            this.selfDialogRef.close();
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
                    let audio = response as unknown as AudioTrack;
                    this.libraryService.emitLibraryChangedEvent(audio);
                    this.notificationService.showNotification(`Audio track '${audio.artist} - ${audio.name}' was successfully added to library`)
                },
                error => {
                    counter += 1;
                    this.notificationService.showNotification(`Error happened while adding '${audiotrack.artist} - ${audiotrack.name}' to library. Reason: ${error.message}`);
                }).add(() => {
                if (counter == this.audiotracks.length) {
                    if (anyTrackFailed) {
                        this.notificationService.showNotification(
                            "Some of the tracks were not added to library.", "error");
                    } else {
                        this.notificationService.showNotification(
                            "Audio tracks successfully added to library.", "done-all");
                    }
                }});
        }
    }

    updateStartTime($event: any, audiotrack: LocalAudioTrack) {
        audiotrack.startTime = this.timeConversionService.stringToSeconds($event.target.value);
    }

    updateEndTime($event: any, audiotrack: LocalAudioTrack) {
        audiotrack.endTime = this.timeConversionService.stringToSeconds($event.target.value);
    }
}
