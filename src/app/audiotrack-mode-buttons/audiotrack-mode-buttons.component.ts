import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {AudioTrack} from "../interfaces/audio-track";
import {HttpClient} from "@angular/common/http";
import {NotificationService} from "../utils/notification.service";
import {DialogService} from "../utils/dialog.service";
import {LibraryService} from "../library-content/library.service";

@Component({
    selector: 'app-audiotrack-mode-buttons',
    templateUrl: './audiotrack-mode-buttons.component.html',
    styleUrls: ['./audiotrack-mode-buttons.component.css', './../audiotrack-version-mode-buttons/audiotrack-version-mode-buttons.component.scss']
})
export class AudiotrackModeButtonsComponent implements OnInit {

    @Input("audio-track")
    audioTrack: AudioTrack;

    @Input("show-revert")
    showRevert: boolean;

    @Input()
    disabled: boolean;

    @Input()
    disableSave: boolean;

    @Output() onDelete = new EventEmitter<AudioTrack>();
    @Output() onSave = new EventEmitter<string>();

    snapshot: any;

    constructor(private http: HttpClient,
                private notificationService: NotificationService,
                private dialogService: DialogService,
                private libraryService: LibraryService) {
    }

    ngOnInit() {
        this.snapshot = {
            artist: this.audioTrack.artist,
            name: this.audioTrack.name
        }
    }

    delete() {
        if (this.audioTrack.mode === 'view' || this.audioTrack.mode === 'edit') {
            this.dialogService.openYesNoPopup(`Are you sure you want to delete audiotrack \"${this.audioTrack.artist} - ${this.audioTrack.name}\" and all its versions from library? You won't be able to rollback this action.`, (confirmed: boolean) => {
                if (confirmed) {
                    this.onDelete.emit(this.audioTrack);
                }
            })
        } else {
            this.onDelete.emit(this.audioTrack);
        }
    }

    cancel() {
        this.audioTrack.artist = this.snapshot.artist;
        this.audioTrack.name = this.snapshot.name;
        this.audioTrack.mode = 'view';
    }

    switchMode() {
        if (this.audioTrack.mode === 'workbench_view') {
            this.audioTrack.mode = 'workbench_edit';
            this.audioTrack.versions.forEach(version => version.mode = 'workbench_edit');
            return;
        }
        if (this.audioTrack.mode === 'workbench_edit') {
            //TODO post single audioTrack
            this.audioTrack.mode = 'workbench_view';
            this.audioTrack.versions.forEach(version => version.mode = 'workbench_view');
            this.onSave.emit('workbench_view')
            return;
        }
        if (this.audioTrack.mode === 'edit') {
            this.http.put(`/audio-tracks/modify/inputs`, this.audioTrack)
                .subscribe(response => {
                    this.libraryService.modifyLibraryAudioTrack({old: this.snapshot, new : this.audioTrack});
                    this.notificationService.pushNotification(`Audio track ${this.audioTrack.artist} - ${this.audioTrack.name} is successfully updated.`)
                })
            this.audioTrack.mode = 'view';
            this.onSave.emit('view')
            return;
        }
        if (this.audioTrack.mode === 'view') {
            this.snapshot = {
                artist: this.audioTrack.artist,
                name: this.audioTrack.name
            }
            this.audioTrack.mode = 'edit';
        }
    }
}
