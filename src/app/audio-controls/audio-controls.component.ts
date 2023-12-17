import {
    AfterViewInit,
    ChangeDetectorRef,
    Component,
    ElementRef,
    EventEmitter,
    Input,
    Output,
    ViewChild
} from '@angular/core';
import {AudiotrackEditInputsComponent} from "../audiotrack-edit-inputs/audiotrack-edit-inputs.component";
import {AudioTrack} from "../interfaces/audio-track";
import {AudioTrackVersion} from "../interfaces/audio-track-version";
import {HttpClient} from "@angular/common/http";
import {OkPopupComponent} from "../ok-popup/ok-popup.component";
import {DialogService} from "../utils/dialog.service";
/*import {animate, style, transition, trigger} from "@angular/animations";


export const slideInOut = trigger('slideInOut', [
    transition(':enter', [
        style({ height: 0, opacity: 0 }),
        animate('300ms ease-out', style({ height: '*', opacity: 1 })),
    ]),
    transition(':leave', [
        animate('300ms ease-in', style({ height: 0, opacity: 0 })),
    ]),
]);*/

@Component({
    selector: 'app-audio-controls',
    templateUrl: './audio-controls.component.html',
    styleUrls: ['./audio-controls.component.scss']
})
export class AudioControlsComponent implements AfterViewInit {

    @Input("audio-track")
    audioTrack: AudioTrack;

    @ViewChild("editInputs")
    editInputsComponent: AudiotrackEditInputsComponent;

    @ViewChild("defaultAudio")
    private defaultAudio: ElementRef<HTMLAudioElement>;

    @Output() onDelete = new EventEmitter<AudioTrack>();
    @Output() onModeChange = new EventEmitter<string>();


    constructor(private cdr: ChangeDetectorRef,
                private http: HttpClient,
                private dialogService: DialogService) {
    }

    ngAfterViewInit(): void {
        this.audioTrack.audioEl = this.defaultAudio.nativeElement;
    }

    setMode(mode: string) {
        this.audioTrack.mode = mode;
        this.onModeChange.emit(mode);
    }

    onFormValidityChanged(isValid: boolean) {
        this.audioTrack.inputsAreValid = isValid;
        this.cdr.detectChanges();
    }

    updateUrl(value: string) {
        this.audioTrack.url = value;
    }

    handleDeleteVersion(versionToDelete: AudioTrackVersion) {
        if (!versionToDelete.createdByCurrentUser) {
            this.dialogService.showOkPopup("Permission denied", "You have no rights to remove the version");
            return;
        }
        if (this.audioTrack.versions.length == 1) {
            this.onDelete.emit(this.audioTrack);
            return;
        }
        const index = this.audioTrack.versions.indexOf(versionToDelete, 0);
        if (versionToDelete.active) {
            if (index == 0) {
                this.audioTrack.versions[1].active = true;
            } else {
                this.audioTrack.versions[0].active = true;
            }
            this.http.delete(`/audio-tracks/version?id=${versionToDelete.id}`).subscribe(
                response => {
                this.audioTrack.versions.splice(index, 1);
            }, error => {
                    this.dialogService.showOkPopup("Error", "Failed to delete audio track version from library.")
            })
        }
    }
}
