import {Component, Input} from '@angular/core';
import {AudioTrack} from "../interfaces/audiotrack";
import {TimeConversionService} from "../time-conversion.service";
import {LibraryPlayerService} from "../audio-controls/library-player.service";
import {ProgressService} from "../range-slider/progress.service";

@Component({
    selector: 'app-audiotrack-edit-inputs',
    templateUrl: './audiotrack-edit-inputs.component.html',
    styleUrls: ['./audiotrack-edit-inputs.component.scss']
})
export class AudiotrackEditInputsComponent {

    @Input("audio-track")
    audioTrack: AudioTrack;


    constructor(private timeConversionService: TimeConversionService,
                private libraryPlayerService: LibraryPlayerService,
                private progressService: ProgressService) {
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
}
