import {Component, Inject, QueryList, ViewChildren} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {LocalAudioService} from "../local-audio/local-audio-service";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {AudioTrack} from "../interfaces/audio-track";
import {NotificationService, NotificationType} from "../utils/notification.service";
import {DialogService} from "../utils/dialog.service";
import {LibraryService} from "../library-content/library.service";
import {OverlayService} from "../overlay.service";
import {AudioControlsComponent} from "../audio-controls/audio-controls.component";
import {map} from "rxjs";

@Component({
    selector: 'app-add-audiotracks-workbench',
    templateUrl: './add-audiotracks-workbench.component.html',
    styleUrls: ['./add-audiotracks-workbench.components.scss',
        './../common-styles/scrollbar.css']
})
export class AddAudiotracksWorkbenchComponent {

    audioTracks: AudioTrack[] = [];

    @ViewChildren(AudioControlsComponent) audioControls: QueryList<AudioControlsComponent>;

    constructor(@Inject(MAT_DIALOG_DATA) public data: File[],
                private selfDialogRef: MatDialogRef<AddAudiotracksWorkbenchComponent>,
                private dialogService: DialogService,
                private localAudioService: LocalAudioService,
                private http: HttpClient,
                private notificationService: NotificationService,
                private libraryService: LibraryService,
                private overlayService: OverlayService
    ) {
        data.map(file => this.localAudioService.toLocalAudioTrack(file, "edit")
            .then(audiotrack => this.audioTracks.push(audiotrack)));
    }

    openConfirmationDialog(): void {
        this.dialogService.openYesNoPopup("Are you sure you want to interrupt adding audio tracks to library?\nAll changes will be lost.",
            (confirmed: boolean) => {
                if (confirmed) {
                    this.audioTracks = [];
                    this.selfDialogRef.close();
                }
            });
    }

    deleteFromWorkbench(audioTrack: AudioTrack) {
        const index = this.audioTracks.findIndex(wbAudioTrack => wbAudioTrack === audioTrack);
        if (index !== -1) {
            this.audioTracks.splice(index, 1);
        }
        if (this.audioTracks.length === 0) {
            this.selfDialogRef.close();
        }
    }

    saveToLibrary(index: number) {
        let audioTrack = this.audioTracks[index];

        const formData = new FormData();
        formData.append('file-data', audioTrack.file);

        const headers = new HttpHeaders();
        headers.append('Content-Type', 'multipart/form-data');

        let addToLibrary = this.http.post<any>("/audio-tracks/add/async", formData, {
            headers: headers,
            params:
                {
                    artist: audioTrack.artist,
                    name: audioTrack.name,
                    start: audioTrack.versions[0].startTime,
                    end: audioTrack.versions[0].endTime,
                    duration: audioTrack.length
                }
        });
        this.notificationService.pushNotification(`Upload for audio track '${audioTrack.artist} - ${audioTrack.name}' started`)
        this.deleteFromWorkbench(audioTrack);
        addToLibrary
            .pipe(map(response => response.audioFile as AudioTrack))
            .subscribe(response => {
                    let audio = response as unknown as AudioTrack;
                    this.libraryService.addToLibrary(audio);
                    this.notificationService.pushNotification(`Audio track '${audio.artist} - ${audio.name}' was successfully added to library`, "success")
                },
                error => {
                    if (error.status === 409) {
                        this.notificationService.pushNotification(`Error happened while adding '${audioTrack.artist} - ${audioTrack.name}' to library. Reason: audio track with the same artist and name already exists.`);
                        return;
                    }
                    this.notificationService.pushNotification(`Error happened while adding '${audioTrack.artist} - ${audioTrack.name}' to library. Reason: ${error.message}`);
                });
    }
}
