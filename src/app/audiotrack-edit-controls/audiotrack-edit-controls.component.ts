import {
    AfterViewInit,
    Component,
    ElementRef, EventEmitter,
    Input,
    OnChanges,
    OnInit,
    Output,
    SimpleChanges,
    ViewChild
} from '@angular/core';
import {LibraryPlayerService} from "../audio-controls/library-player.service";
import {BehaviorSubject, Observable} from "rxjs";
import {RangeSliderComponent} from "../range-slider/range-slider.component";
import {ProgressService} from "../range-slider/progress.service";
import {HttpClient} from "@angular/common/http";
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

    @ViewChild("rangeSlider")
    private rangeSlider: RangeSliderComponent;

    currentVersionIsPlaying: boolean = false;
    audioTrackId?: string;
    trackIsLoading: boolean = false;


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
            this.downloadService.loadAudioFromRemote(this.audioTrackId, this.audioTrack.audioEl, () => this.onDownload())
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

    onDownload() {
        this.audioTrack.url = `audio-tracks/binary?id=${this.audioTrackId}`;
        this.libraryPlayerService.play(this.audioTrack, this.audioTrackVersion);
        this.trackIsLoading = false;
    }
}
