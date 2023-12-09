import {Component, EventEmitter, Input, OnChanges, Output, SimpleChanges} from '@angular/core';
import {AudioTrack} from "../interfaces/audiotrack";
import {TimeConversionService} from "../time-conversion.service";
import {LibraryPlayerService} from "../audio-controls/library-player.service";
import {ProgressService} from "../range-slider/progress.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AudiotrackValidateService} from "../audiotrack-validate.service";
import {LibraryService} from "../library-content/library.service";

@Component({
    selector: 'app-audiotrack-edit-inputs',
    templateUrl: './audiotrack-edit-inputs.component.html',
    styleUrls: ['./audiotrack-edit-inputs.component.scss']
})
export class AudiotrackEditInputsComponent implements OnChanges {

    @Input("audio-track")
    audioTrack: AudioTrack;

    audioInputs: FormGroup;

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
        if (changes.audioTrack && changes.audioTrack.currentValue) {
            this.audioInputs.patchValue({
                artist: changes.audioTrack.currentValue.artist,
                name: changes.audioTrack.currentValue.name
            });
        }
    }

    updateStartTime($event: any) {
        let newValue = this.timeConversionService.stringToSeconds($event.target.value);
        this.audioTrack.startTime = this.audiotrackValidateService.validateStartTime(this.audioTrack, newValue);
        if (this.libraryPlayerService.currentTrack === this.audioTrack) {
            this.libraryPlayerService.setStartTime(this.audioTrack.startTime);
        }
    }

    updateEndTime($event: any) {
        let newValue = this.timeConversionService.stringToSeconds($event.target.value);
        this.audioTrack.endTime = this.audiotrackValidateService.validateEndTime(this.audioTrack, newValue);
        if (this.libraryPlayerService.currentTrack === this.audioTrack) {
            this.libraryPlayerService.setEndTime(this.audioTrack.endTime);
        }
    }

    incrementStartTime() {
        this.audioTrack.startTime = this.audiotrackValidateService.validateStartTime(this.audioTrack, this.audioTrack.startTime + 0.1);
        if (this.libraryPlayerService.currentTrack === this.audioTrack) {
            this.libraryPlayerService.setStartTime(this.audioTrack.startTime);
        }
    }

    decrementStartTime() {
        this.audioTrack.startTime = this.audiotrackValidateService.validateStartTime(this.audioTrack, this.audioTrack.startTime - 0.1);
        if (this.libraryPlayerService.currentTrack === this.audioTrack) {
            this.libraryPlayerService.setStartTime(this.audioTrack.startTime);
        }
    }

    incrementEndTime() {
        this.audioTrack.endTime = this.audiotrackValidateService.validateEndTime(this.audioTrack, this.audioTrack.endTime + 0.1);
        if (this.libraryPlayerService.currentTrack === this.audioTrack) {
            this.libraryPlayerService.setEndTime(this.audioTrack.endTime);
        }
    }

    decrementEndTime() {
        this.audioTrack.endTime = this.audiotrackValidateService.validateEndTime(this.audioTrack, this.audioTrack.endTime - 0.1);
        if (this.libraryPlayerService.currentTrack === this.audioTrack) {
            this.libraryPlayerService.setEndTime(this.audioTrack.endTime);
        }
    }
}
