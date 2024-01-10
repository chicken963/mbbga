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
import {RoundTableItem} from "../interfaces/round-table-item";
import {Round} from "../interfaces/round";


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

    @Input("round")
    round: Round;

    @ViewChild("editInputs")
    editInputsComponent: AudiotrackEditInputsComponent;

    @ViewChildren(AudiotrackEditControlsComponent)
    versionControls: AudiotrackEditControlsComponent[];

    @ViewChild("defaultAudio")
    private defaultAudio: ElementRef<HTMLAudioElement>;

    @Output() onDelete = new EventEmitter<AudioTrack>();
    @Output() onModeChange = new EventEmitter<string>();

    @Output()
    versionSelected: EventEmitter<RoundTableItem> = new EventEmitter<RoundTableItem>();


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
        let version = this.audioTrack.versions[i];
        version.inputsEditable = true;
        this.audioTrack.mode = mode;
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

        this.editInputsComponent.setValue('artist', this.audioTrack.artist);
        this.editInputsComponent.setValue('name', this.audioTrack.name);
    }

    onVersionSelected(version: RoundTableItem) {
        this.versionSelected.emit(version);
    }

    onSelectedChange($event: boolean, i: number) {
        let version = this.audioTrack.versions[i];
        version.inputsEditable = true;
        this.versionSelected.emit({
            audioFileId: this.audioTrack.id!,
            artist: this.audioTrack.artist,
            title: this.audioTrack.name,
            versionId: version.id!,
            startTime: version.startTime,
            endTime: version.endTime,
            duration: this.audioTrack.length,
            mode: $event ? 'selected' : 'select'
        });
    }
}
