import {Component, EventEmitter, Input, OnChanges, Output, SimpleChanges} from '@angular/core';
import {AudioTrack} from "../interfaces/audio-track";
import {TimeConversionService} from "../services/time-conversion.service";
import {LibraryPlayerService} from "../audio-controls/library-player.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AudiotrackValidateService} from "../audiotrack-validate.service";
import {LibraryService} from "../library-content/library.service";
import {AudioTrackVersion} from "../interfaces/audio-track-version";

@Component({
    selector: 'app-audiotrack-edit-inputs',
    templateUrl: './audiotrack-edit-inputs.component.html',
    styleUrls: ['./audiotrack-edit-inputs.component.scss', './../common-styles/arrow-buttons.scss']
})
export class AudiotrackEditInputsComponent implements OnChanges {

    @Input("audio-track")
    audioTrack: AudioTrack;

    audioInputs: FormGroup;

    activeVersion: AudioTrackVersion;

    numericArrowThreshold: number = 78;

    @Output()
    inputsValidityChanged = new EventEmitter<boolean>();

    constructor(private timeConversionService: TimeConversionService,
                private libraryPlayerService: LibraryPlayerService,
                private audiotrackValidateService: AudiotrackValidateService,
                private libraryService: LibraryService,
                private fb: FormBuilder) {
        this.audioInputs = this.fb.group({
            artist: [this.audioTrack?.artist, Validators.required],
            name: [this.audioTrack?.name, Validators.required]
        });
        this.audioInputs.get('artist')?.valueChanges.subscribe(value => {
            this.audioTrack.artist = value;
        });
        this.audioInputs.get('name')?.valueChanges.subscribe(value => {
            this.audioTrack.name = value;
        });

        this.audioInputs.valueChanges.subscribe(() => {
            this.inputsValidityChanged.emit(this.audioInputs.valid);
            this.libraryService.setAudioTrackInputsValidity(this.audioInputs.valid);
        });
    }

    ngOnChanges(changes: SimpleChanges) {
        //on version change?
        if (changes.audioTrack && changes.audioTrack.currentValue) {
            this.audioInputs.patchValue({
                artist: changes.audioTrack.currentValue.artist,
                name: changes.audioTrack.currentValue.name
            });
            this.activeVersion = changes.audioTrack.currentValue.versions.find((version: AudioTrackVersion) => version.inputsEditable);
        }
    }

    updateStartTime($event: any) {
        let newValue = this.timeConversionService.stringToSeconds($event.target.value);
        this.activeVersion.startTime = this.audiotrackValidateService.validateStartTime(this.activeVersion, newValue);
        if (this.libraryPlayerService.currentTrack === this.audioTrack) {
            this.libraryPlayerService.setStartTime(this.activeVersion.startTime);
        }
    }

    updateEndTime($event: any) {
        let newValue = this.timeConversionService.stringToSeconds($event.target.value);
        this.activeVersion.endTime = this.audiotrackValidateService.validateEndTime(this.audioTrack, this.activeVersion, newValue);
        if (this.libraryPlayerService.currentTrack === this.audioTrack) {
            this.libraryPlayerService.setEndTime(this.activeVersion.endTime);
        }
    }

    incrementStartTime() {
        this.activeVersion.startTime = this.audiotrackValidateService.validateStartTime(this.activeVersion, this.activeVersion.startTime + 0.1);
        if (this.libraryPlayerService.currentTrack === this.audioTrack) {
            this.libraryPlayerService.setStartTime(this.activeVersion.startTime);
        }
    }

    decrementStartTime() {
        this.activeVersion.startTime = this.audiotrackValidateService.validateStartTime(this.activeVersion, this.activeVersion.startTime - 0.1);
        if (this.libraryPlayerService.currentTrack === this.audioTrack) {
            this.libraryPlayerService.setStartTime(this.activeVersion.startTime);
        }
    }

    incrementEndTime() {
        this.activeVersion.endTime = this.audiotrackValidateService.validateEndTime(this.audioTrack, this.activeVersion, this.activeVersion.endTime + 0.1);
        if (this.libraryPlayerService.currentTrack === this.audioTrack) {
            this.libraryPlayerService.setEndTime(this.activeVersion.endTime);
        }
    }

    decrementEndTime() {
        this.activeVersion.endTime = this.audiotrackValidateService.validateEndTime(this.audioTrack, this.activeVersion, this.activeVersion.endTime - 0.1);
        if (this.libraryPlayerService.currentTrack === this.audioTrack) {
            this.libraryPlayerService.setEndTime(this.activeVersion.endTime);
        }
    }

    setValue(control: string, value: string) {
        this.audioInputs.get(control)?.setValue(value);
    }
}
