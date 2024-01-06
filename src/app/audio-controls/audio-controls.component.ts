import {
    AfterViewInit,
    ChangeDetectorRef,
    Component,
    ElementRef,
    EventEmitter,
    Input,
    Output,
    ViewChild, ViewChildren
} from '@angular/core';
import {AudiotrackEditInputsComponent} from "../audiotrack-edit-inputs/audiotrack-edit-inputs.component";
import {AudioTrack} from "../interfaces/audio-track";
import {AudioTrackVersion} from "../interfaces/audio-track-version";
import {HttpClient} from "@angular/common/http";
import {DialogService} from "../utils/dialog.service";
import {AddAudioToRoundService} from "../services/add-audio-to-round.service";
import {AudiotrackEditControlsComponent} from "../audiotrack-edit-controls/audiotrack-edit-controls.component";


@Component({
    selector: 'app-audio-controls',
    templateUrl: './audio-controls.component.html',
    styleUrls: ['./audio-controls.component.scss']
})
export class AudioControlsComponent implements AfterViewInit {

    @Input("audio-track")
    audioTrack: AudioTrack;

    @Input("searchQuery")
    searchQuery: string;

    @Input("mode")
    mode: string;

    @ViewChild("editInputs")
    editInputsComponent: AudiotrackEditInputsComponent;

    @ViewChildren(AudiotrackEditControlsComponent)
    versionControls: AudiotrackEditControlsComponent[];

    @ViewChild("defaultAudio")
    private defaultAudio: ElementRef<HTMLAudioElement>;

    @Output() onDelete = new EventEmitter<AudioTrack>();
    @Output() onModeChange = new EventEmitter<string>();


    constructor(private cdr: ChangeDetectorRef,
                private http: HttpClient,
                private dialogService: DialogService,
                private addAudioToRoundService: AddAudioToRoundService) {
    }

    ngAfterViewInit(): void {
        this.audioTrack.audioEl = this.defaultAudio.nativeElement;
    }

    onVersionModeChange(mode: string, i: number) {
        this.audioTrack.versions.forEach(version => {
            version.inputsEditable = false;
        })
        this.audioTrack.versions[i].inputsEditable = true;
        this.audioTrack.mode = mode;
        if (mode === 'selected') {
            this.addAudioToRoundService.addAudioToRound({
                audioTrack: this.audioTrack,
                versionIndex: i
            });
        } else if (mode === 'select') {
            this.addAudioToRoundService.removeAudioFromRound({
                audioTrack: this.audioTrack,
                versionIndex: i
            })
        }
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
        if (versionToDelete.inputsEditable) {
            if (index == 0) {
                this.audioTrack.versions[1].inputsEditable = true;
            } else {
                this.audioTrack.versions[0].inputsEditable = true;
            }
            this.http.delete(`/audio-tracks/version?id=${versionToDelete.id}`).subscribe(
                response => {
                this.audioTrack.versions.splice(index, 1);
            }, error => {
                    this.dialogService.showOkPopup("Error", "Failed to delete audio track version from library.")
            })
        }
    }

    setPreviousValues(stateToRestore: any, index: number) {
        this.audioTrack.artist = stateToRestore.artist;
        this.audioTrack.name = stateToRestore.name;

        this.audioTrack.versions[index].startTime = stateToRestore.startTime;
        this.audioTrack.versions[index].endTime = stateToRestore.endTime;
        this.cdr.detectChanges();
    }
}
