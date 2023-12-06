import {AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {LibraryPlayerService} from "../audio-controls/library-player.service";
import {BehaviorSubject, Observable} from "rxjs";
import {LocalAudioTrack} from "../local-audio/local-audio-track";
import {RangeSliderComponent} from "../range-slider/range-slider.component";
import {ProgressService} from "../range-slider/progress.service";

@Component({
    selector: 'app-audiotrack-edit-controls',
    templateUrl: './audiotrack-edit-controls.component.html',
    styleUrls: ['./audiotrack-edit-controls.component.scss']
})
export class AudiotrackEditControlsComponent implements OnInit, AfterViewInit {

    @Input("audio-track")
    audioTrack: LocalAudioTrack;

    @ViewChild("defaultAudio")
    private defaultAudio: ElementRef<HTMLAudioElement>;

    @ViewChild("rangeSlider")
    private rangeSlider: RangeSliderComponent;

    currentTrackIsPlaying: boolean = false;


    constructor(private libraryPlayerService: LibraryPlayerService, private progressService: ProgressService) {
      this.libraryPlayerService.isPlaying().subscribe(value => {
        if (this.libraryPlayerService.currentTrack === this.audioTrack) {
          this.currentTrackIsPlaying = value;
        }
      })
    }

    ngOnInit(): void {
        this.audioTrack.progressInSeconds = 0;
    }

    ngAfterViewInit(): void {
        this.audioTrack.audioEl = this.defaultAudio.nativeElement;
    }

    play() {
        this.libraryPlayerService.play(this.audioTrack);
    }

    pause() {
        this.libraryPlayerService.pause();
    }


    stop() {
        if (this.audioTrack === this.libraryPlayerService.currentTrack) {
            this.libraryPlayerService.stop();
        } else {
            this.audioTrack.audioEl.currentTime = this.audioTrack.startTime;
            this.audioTrack.progressInSeconds = 0;
            this.rangeSlider.updateProgressSlider(0);
        }

    }

    replay5() {
        this.audioTrack.audioEl.currentTime = Math.max(this.audioTrack.audioEl.currentTime - 5, this.audioTrack.startTime);
        this.audioTrack.progressInSeconds = this.audioTrack.audioEl.currentTime - this.audioTrack.startTime;
        if (this.libraryPlayerService.currentTrack === this.audioTrack) {
            this.libraryPlayerService.setProgressPercentage(this.audioTrack.audioEl.currentTime);
        } else {
            this.rangeSlider.updateProgressSlider(this.progressService.evaluateProgress(this.audioTrack.startTime, this.audioTrack.audioEl.currentTime, this.audioTrack.endTime));
        }
    }

    forward5() {
        if (this.libraryPlayerService.currentTrack === this.audioTrack) {
            this.libraryPlayerService.setProgressPercentage(this.audioTrack.audioEl.currentTime += 5);
        } else {
            this.audioTrack.audioEl.currentTime = Math.min(this.audioTrack.audioEl.currentTime + 5, this.audioTrack.endTime);
            this.audioTrack.progressInSeconds = this.audioTrack.audioEl.currentTime - this.audioTrack.startTime;
            this.rangeSlider.updateProgressSlider(this.progressService.evaluateProgress(this.audioTrack.startTime, this.audioTrack.audioEl.currentTime, this.audioTrack.endTime))
        }
    }

    getProgress(): Observable<number> {
        return this.audioTrack === this.libraryPlayerService.currentTrack
            ? this.libraryPlayerService.getProgressInSeconds()
            : new BehaviorSubject(this.audioTrack.progressInSeconds).asObservable();
    }
}
