import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {LibraryPlayerService} from "../audio-controls/library-player.service";
import {BehaviorSubject, Observable} from "rxjs";
import {RangeSliderComponent} from "../range-slider/range-slider.component";
import {ProgressService} from "../range-slider/progress.service";
import {AudioTrackVersion} from "../interfaces/audio-track-version";
import {AudioTrack} from "../interfaces/audio-track";
import {DownloadRemoteAudioService} from "../services/download-remote-audio.service";

@Component({
    selector: 'app-audiotrack-edit-controls',
    templateUrl: './audiotrack-edit-controls.component.html',
    styleUrls: ['./audiotrack-edit-controls.component.scss']
})
export class AudiotrackEditControlsComponent implements OnInit {

    @Input("version")
    audioTrackVersion: AudioTrackVersion;

    @Input("audio-track")
    audioTrack: AudioTrack;

    @Input("mode")
    mode: string;

    @Output() modeChange: EventEmitter<string> = new EventEmitter<string>();
    @Output() onCancelChanges = new EventEmitter<any>();
    @Output() onDeleteVersion = new EventEmitter<AudioTrackVersion>();

    @ViewChild("rangeSlider")
    private rangeSlider: RangeSliderComponent;

    private audioSnapshot: { artist: string, name: string, startTime: number, endTime: number };

    currentVersionIsPlaying: boolean = false;
    audioTrackId?: string;
    trackIsLoading: boolean = false;
    loadPercents: number = 0;


    constructor(private libraryPlayerService: LibraryPlayerService,
                private progressService: ProgressService,
                private downloadService: DownloadRemoteAudioService) {
        this.libraryPlayerService.isPlaying().subscribe(value => {
            if (this.libraryPlayerService.activeVersion === this.audioTrackVersion) {
                this.currentVersionIsPlaying = value;
            }
        })
    }

    ngOnInit(): void {
        this.audioTrackId = this.audioTrack.id
        this.audioTrackVersion.progressInSeconds = 0;
    }

    play() {
        if (!this.audioTrack.url && this.audioTrackId) {
            this.trackIsLoading = true;
            this.downloadService.loadAudioFromRemote(this.audioTrackId).subscribe(result => {
                if (typeof result === 'number') {
                    this.loadPercents = result;
                } else if (typeof result === 'string') {
                    this.audioTrack.audioEl.src = result;
                    this.audioTrack.url = `audio-tracks/binary?id=${this.audioTrackId}`;
                    this.libraryPlayerService.play(this.audioTrack, this.audioTrackVersion);
                    this.trackIsLoading = false;
                }
            })
            return;
        }
        this.libraryPlayerService.play(this.audioTrack, this.audioTrackVersion);
    }

    pause() {
        this.libraryPlayerService.pause();
    }

    stop() {
        if (this.audioTrackVersion === this.libraryPlayerService.activeVersion) {
            this.libraryPlayerService.stop();
        } else {
            this.audioTrack.audioEl.currentTime = this.audioTrackVersion.startTime;
            this.audioTrackVersion.progressInSeconds = 0;
            this.rangeSlider.updateProgressSlider(0);
        }

    }

    replay5() {
        this.audioTrack.audioEl.currentTime = Math.max(this.audioTrack.audioEl.currentTime - 5, this.audioTrackVersion.startTime);
        this.audioTrackVersion.progressInSeconds = this.audioTrack.audioEl.currentTime - this.audioTrackVersion.startTime;
        if (this.libraryPlayerService.activeVersion === this.audioTrackVersion) {
            this.libraryPlayerService.setProgressPercentage(this.progressService.evaluateProgress(this.audioTrack, this.audioTrackVersion));
        } else {
            this.rangeSlider.updateProgressSlider(this.progressService.evaluateProgress(this.audioTrack, this.audioTrackVersion));
        }
    }

    forward5() {
        if (this.libraryPlayerService.activeVersion === this.audioTrackVersion) {
            this.audioTrack.audioEl.currentTime += 5
            this.libraryPlayerService.setProgressPercentage(this.progressService.evaluateProgress(this.audioTrack, this.audioTrackVersion));
        } else {
            this.audioTrack.audioEl.currentTime = Math.min(this.audioTrack.audioEl.currentTime + 5, this.audioTrackVersion.endTime);
            this.audioTrackVersion.progressInSeconds = this.audioTrack.audioEl.currentTime - this.audioTrackVersion.startTime;
            this.rangeSlider.updateProgressSlider(this.progressService.evaluateProgress(this.audioTrack, this.audioTrackVersion))
        }
    }

    getProgress(): Observable<number> {
        return this.audioTrackVersion === this.libraryPlayerService.activeVersion
            ? this.libraryPlayerService.getProgressInSeconds()
            : new BehaviorSubject(this.audioTrackVersion.progressInSeconds).asObservable();
    }

    setMode(value: string) {
        this.audioSnapshot = {
            artist: this.audioTrack.artist,
            name: this.audioTrack.name,
            startTime: this.audioTrackVersion.startTime,
            endTime: this.audioTrackVersion.endTime
        };
        this.modeChange.emit(value)
    }

    cancel() {
        this.onCancelChanges.emit(this.audioSnapshot);
    }

    delete() {
        this.onDeleteVersion.emit(this.audioTrackVersion);
    }
}
