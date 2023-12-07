import {Component, Input, OnChanges, SimpleChanges} from '@angular/core';
import {AudioTrack} from "../interfaces/audiotrack";
import {TimeConversionService} from "../time-conversion.service";
import {LibraryPlayerService} from "../audio-controls/library-player.service";
import {ProgressService} from "../range-slider/progress.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";

@Component({
    selector: 'app-audiotrack-edit-inputs',
    templateUrl: './audiotrack-edit-inputs.component.html',
    styleUrls: ['./audiotrack-edit-inputs.component.scss']
})
export class AudiotrackEditInputsComponent implements OnChanges {

    @Input("audio-track")
    audioTrack: AudioTrack;

    audioInputs: FormGroup;

    constructor(private timeConversionService: TimeConversionService,
                private libraryPlayerService: LibraryPlayerService,
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
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.audioTrack && changes.audioTrack.currentValue) {
            this.audioInputs.patchValue({
                artist: changes.audioTrack.currentValue.artist,
                name: changes.audioTrack.currentValue.name
            });
        }
    }

    updateStartTime($event: any, audiotrack: AudioTrack) {
        audiotrack.startTime = this.timeConversionService.stringToSeconds($event.target.value);
        if (this.libraryPlayerService.currentTrack === this.audioTrack) {
            this.libraryPlayerService.setStartTime(this.audioTrack.startTime);
        }
    }

    updateEndTime($event: any, audiotrack: AudioTrack) {
        audiotrack.endTime = this.timeConversionService.stringToSeconds($event.target.value);
        if (this.libraryPlayerService.currentTrack === this.audioTrack) {
            this.libraryPlayerService.setEndTime(this.audioTrack.endTime);
        }
    }

    incrementStartTime() {
        this.audioTrack.startTime += 0.1;
        if (this.libraryPlayerService.currentTrack === this.audioTrack) {
            this.libraryPlayerService.setStartTime(this.audioTrack.startTime);
        }
        console.log(this.audioTrack.artist)
    }

    decrementStartTime() {
        this.audioTrack.startTime -= 0.1;
        if (this.libraryPlayerService.currentTrack === this.audioTrack) {
            this.libraryPlayerService.setStartTime(this.audioTrack.startTime);
        }
    }

    incrementEndTime() {
        this.audioTrack.endTime += 0.1;
        this.libraryPlayerService.setEndTime(this.audioTrack.endTime);
    }

    decrementEndTime() {
        this.audioTrack.endTime -= 0.1;
        this.libraryPlayerService.setEndTime(this.audioTrack.endTime);
    }

    isValid() {
        return this.audioInputs.valid;
    }
}
