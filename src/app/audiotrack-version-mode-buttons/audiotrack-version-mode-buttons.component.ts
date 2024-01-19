import {Component, EventEmitter, Input, Output} from '@angular/core';
import {AudioTrackVersion} from "../interfaces/audio-track-version";
import {AudioTrack} from "../interfaces/audio-track";
import {HttpClient} from "@angular/common/http";
import {NotificationService} from "../utils/notification.service";
import {DialogService} from "../utils/dialog.service";

@Component({
    selector: 'app-audiotrack-version-mode-buttons',
    templateUrl: './audiotrack-version-mode-buttons.component.html',
    styleUrls: ['./audiotrack-version-mode-buttons.component.scss']
})
export class AudiotrackVersionModeButtonsComponent {

    @Input("version")
    version: AudioTrackVersion;

    @Input("audio-track")
    audioTrack: AudioTrack;

    snapshot: any;

    @Output() onSave = new EventEmitter<AudioTrackVersion>;

    constructor(private http: HttpClient,
                private notificationService: NotificationService,
                private dialogService: DialogService) {
    }

    setMode(value: string) {
        if (value === 'edit') {
            this.snapshot = {
                startTime: this.version.startTime,
                endTime: this.version.endTime
            }
        }
        this.version.mode = value;
    }

    delete() {
        if (this.version.id) {
            this.dialogService.openYesNoPopup("Are you sure you want to delete this version from library? You won't be able to rollback this action.",
                (confirmed: boolean) => {
                    if (confirmed) {
                        this.http.delete(`/audio-tracks/version?id=${this.version.id}`)
                            .subscribe(() => {
                                this.notificationService.pushNotification("The version is successfully deleted.");
                                const index = this.audioTrack.versions.indexOf(this.version);
                                this.audioTrack.versions.splice(index, 1);
                            });
                    }
                });
        } else {
            const index = this.audioTrack.versions.indexOf(this.version);
            this.audioTrack.versions.splice(index, 1);
        }
    }

    cancel() {
        this.version.startTime = this.snapshot.startTime;
        this.version.endTime = this.snapshot.endTime;
        this.setMode('view');
    }

    save() {
        if (this.version.id) {
            this.http.put(`/audio-tracks/modify/bounds`, this.version)
                .subscribe(() => this.notificationService.pushNotification(`Audio track ${this.audioTrack.artist} - ${this.audioTrack.name} is successfully updated.`))
        } else {
            let audioTrackWithVersionSnapshot = {...this.audioTrack}
            audioTrackWithVersionSnapshot.versions = [this.version]
            this.http.post<AudioTrackVersion>(`/audio-tracks/add/version`, audioTrackWithVersionSnapshot)
                .subscribe(response => {
                    this.version.id = response.id;
                    this.notificationService.pushNotification(`New version for audio track ${this.audioTrack.artist} - ${this.audioTrack.name} is successfully added.`);
                })
        }

    }

    addVersion() {
        let version = {...this.version}
        version.createdByCurrentUser = true;
        version.mode = 'edit'
        version.id = '';
        this.audioTrack.versions.push(version);
    }
}
