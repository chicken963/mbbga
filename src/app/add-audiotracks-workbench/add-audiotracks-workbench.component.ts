import {AfterViewInit, Component, ElementRef, HostListener, Inject, ViewChild} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {LocalAudioService} from "../local-audio/local-audio-service";
import {HttpClient} from "@angular/common/http";
import {AudioTrack} from "../interfaces/audio-track";
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
    audioTracks: AudioTrack[] = [];
    allTracksAreConfirmed: boolean = false;

    constructor(@Inject(MAT_DIALOG_DATA) public data: File[],
                private selfDialogRef: MatDialogRef<AddAudiotracksWorkbenchComponent>,
                private elementRef: ElementRef,
                private dialogService: DialogService,
                private localAudioService: LocalAudioService,
                private http: HttpClient,
                private notificationService: NotificationService,
                private libraryService: LibraryService) {
        data.map(file => this.localAudioService.toLocalAudioTrack(file, "edit")
            .then(audiotrack => this.audioTracks.push(audiotrack)));
    }

    openConfirmationDialog(): void {
        this.dialogIsOpened = true;
        this.dialogService.openYesNoPopup("Are you sure you want to interrupt adding audio tracks to library?\nAll changes will be lost.",
            (confirmed: boolean) => {
                this.dialogIsOpened = false;
                if (confirmed) {
                    this.audioTracks = [];
                    this.selfDialogRef.close();
                }
            });
    }

    deleteFromWorkbench(audioTrack: AudioTrack) {
        const index = this.audioTracks.findIndex(wbAudioTrack => wbAudioTrack === audioTrack);
        if (this.audioTracks.length === 1) {
            this.openConfirmationDialog();
            return;
        }
        if (index !== -1) {
            this.audioTracks.splice(index, 1);
        }
    }

    addToLibrary() {
        let counter = 0;
        let anyTrackFailed: boolean = false;
        for (let audiotrack of this.audioTracks) {
            const formData = new FormData();
            formData.append('file', audiotrack.file, audiotrack.name);
            this.selfDialogRef.close();
            this.http.post("/audiotracks/add", audiotrack.file, {
                params:
                    {
                        artist: audiotrack.artist,
                        name: audiotrack.name,
                        start: audiotrack.versions[0].startTime,
                        end: audiotrack.versions[0].endTime,
                        duration: audiotrack.length
                    }
            }).subscribe(response => {
                    counter += 1;
                    let audio = response as unknown as AudioTrack;
                    this.libraryService.emitLibraryChangedEvent(audio);
                    this.notificationService.pushNotification(`Audio track '${audio.artist} - ${audio.name}' was successfully added to library`)
                },
                error => {
                    counter += 1;
                    this.notificationService.pushNotification(`Error happened while adding '${audiotrack.artist} - ${audiotrack.name}' to library. Reason: ${error.message}`);
                }).add(() => {
                if (counter == this.audioTracks.length) {
                    if (anyTrackFailed) {
                        this.notificationService.pushNotification(
                            "Some of the tracks were not added to library.", "error");
                    } else {
                        this.notificationService.pushNotification(
                            "Audio tracks successfully added to library.", "success");
                    }
                }});
        }
    }

    allAudioTracksAreConfirmed(): boolean {
        return !this.audioTracks.find(audioTracks => !audioTracks.inputsAreValid);
    }

    checkAllAudioTracksConfirmed() {
        this.allTracksAreConfirmed = !this.audioTracks.find(audioTracks => audioTracks.mode !== 'view');
    }
}
