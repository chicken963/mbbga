import {Component, ElementRef, Input, ViewChild} from '@angular/core';
import {AudioTrack} from "../interfaces/audiotrack";
import {TimeConversionService} from "../time-conversion.service";
import {LibraryPlayerService} from "./library-player.service";

@Component({
    selector: 'app-audio-controls',
    templateUrl: './audio-controls.component.html',
    styleUrls: ['./audio-controls.component.scss']
})
export class AudioControlsComponent {

    constructor(private timeConversionService: TimeConversionService,
                private libraryPlayerService: LibraryPlayerService) {
    }

    @Input("mode")
    mode: string;

    @Input("audio-track")
    audioTrack: AudioTrack;

    @ViewChild("defaultAudio")
    private defaultAudio: ElementRef;

    rangeValues: number[] = [20, 80]; // Initial range values
    minValue = 0;
    maxValue = 100;


    updateStartTime($event: any, audiotrack: AudioTrack) {
        audiotrack.startTime = this.timeConversionService.stringToSeconds($event.target.value);
    }

    updateEndTime($event: any, audiotrack: AudioTrack) {
        audiotrack.endTime = this.timeConversionService.stringToSeconds($event.target.value);
    }

    play() {
        this.libraryPlayerService.isPlaying = true;
        let switchedFromAnotherTrack: boolean = this.libraryPlayerService.currentTrack === this.audioTrack;
        if (switchedFromAnotherTrack) {
            this.libraryPlayerService.currentTrack = this.audioTrack;
            this.defaultAudio.nativeElement.volume = this.libraryPlayerService.volume;
            this.defaultAudio.nativeElement.currentTime = this.audioTrack.startTime;
        }
        this.defaultAudio.nativeElement.play();
    }

    pause() {
        this.libraryPlayerService.isPlaying = false;
        this.defaultAudio.nativeElement.pause();
    }

    isPlaying(): boolean {
        return this.libraryPlayerService.isPlayingNow(this.audioTrack);
    }

    stop() {
        this.libraryPlayerService.isPlaying = false;
        this.defaultAudio.nativeElement.pause();
        this.defaultAudio.nativeElement.currentTime = 0;
    }

    replay5() {
        this.defaultAudio.nativeElement.currentTime -= 5;
    }

    forward5() {
        this.defaultAudio.nativeElement.currentTime += 5;
    }
}
