import {AfterViewInit, Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges, ViewChild} from '@angular/core';
import {LibraryPlayerService} from "../audio-controls/library-player.service";
import {BehaviorSubject, Observable} from "rxjs";
import {LocalAudioTrack} from "../local-audio/local-audio-track";
import {RangeSliderComponent} from "../range-slider/range-slider.component";
import {ProgressService} from "../range-slider/progress.service";
import {HttpClient} from "@angular/common/http";

@Component({
    selector: 'app-audiotrack-edit-controls',
    templateUrl: './audiotrack-edit-controls.component.html',
    styleUrls: ['./audiotrack-edit-controls.component.scss']
})
export class AudiotrackEditControlsComponent implements OnInit, AfterViewInit, OnChanges {

    @Input("audio-track")
    audioTrack: LocalAudioTrack;

    @Input("mode")
    mode: string;

    @ViewChild("defaultAudio")
    private defaultAudio: ElementRef<HTMLAudioElement>;

    @ViewChild("rangeSlider")
    private rangeSlider: RangeSliderComponent;

    currentTrackIsPlaying: boolean = false;


    constructor(private libraryPlayerService: LibraryPlayerService,
                private progressService: ProgressService,
                private http: HttpClient) {
        this.libraryPlayerService.isPlaying().subscribe(value => {
            if (this.libraryPlayerService.currentTrack === this.audioTrack) {
                this.currentTrackIsPlaying = value;
            }
        })
    }

    ngOnChanges(changes: SimpleChanges) {

        if (changes.defaultAudio) {
            console.log("changed default audio")
        }
        // @ts-ignore
        if (changes.defaultAudio && changes.defaultAudio.nativeElement) {
            console.log("changed to " + this.audioTrack.url)
        }
    }

    ngOnInit(): void {
        this.audioTrack.progressInSeconds = 0;
    }

    ngAfterViewInit(): void {
        this.audioTrack.audioEl = this.defaultAudio.nativeElement;
    }

    play() {
        if (!this.audioTrack.url) {
            this.loadAudioFromRemote();
        }
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
            this.libraryPlayerService.setProgressPercentage(this.progressService.evaluateProgress(this.audioTrack));
        } else {
            this.rangeSlider.updateProgressSlider(this.progressService.evaluateProgress(this.audioTrack));
        }
    }

    forward5() {
        if (this.libraryPlayerService.currentTrack === this.audioTrack) {
            this.audioTrack.audioEl.currentTime += 5
            this.libraryPlayerService.setProgressPercentage(this.progressService.evaluateProgress(this.audioTrack));
        } else {
            this.audioTrack.audioEl.currentTime = Math.min(this.audioTrack.audioEl.currentTime + 5, this.audioTrack.endTime);
            this.audioTrack.progressInSeconds = this.audioTrack.audioEl.currentTime - this.audioTrack.startTime;
            this.rangeSlider.updateProgressSlider(this.progressService.evaluateProgress(this.audioTrack))
        }
    }

    getProgress(): Observable<number> {
        return this.audioTrack === this.libraryPlayerService.currentTrack
            ? this.libraryPlayerService.getProgressInSeconds()
            : new BehaviorSubject(this.audioTrack.progressInSeconds).asObservable();
    }

    private loadAudioFromRemote() {
        this.http.get(`audiotracks/binary?artist=${this.audioTrack.artist}&name=${this.audioTrack.name}&start=${this.audioTrack.startTime}&end=${this.audioTrack.endTime}`, {
            headers: {'Content-Type': 'audio/mpeg'},
            responseType: 'arraybuffer' as 'json'
        })
            .subscribe((response) => {
                let bufferedResponse: ArrayBuffer = response as ArrayBuffer;
                let blob = new Blob([bufferedResponse]);
                this.defaultAudio.nativeElement.src = URL.createObjectURL(blob);
                this.audioTrack.url = `audiotracks/binary?artist=${this.audioTrack.artist}&name=${this.audioTrack.name}&start=${this.audioTrack.startTime}&end=${this.audioTrack.endTime}`;
                this.defaultAudio.nativeElement.currentTime = 100;
                this.libraryPlayerService.play(this.audioTrack);
                // const audioContext = new (window.AudioContext)();
                // audioContext.decodeAudioData(bufferedResponse, (decodedData) => {
                //     this.audioTrack.url = `audiotracks/binary?artist=${this.audioTrack.artist}&name=${this.audioTrack.name}&start=${this.audioTrack.startTime}&end=${this.audioTrack.endTime}`;
                //     this.defaultAudio.nativeElement.play();
                // const source = audioContext.createBufferSource();
                // source.buffer = decodedData;
                //
                // const htmlElement = this.defaultAudio.nativeElement;
                // htmlElement.src = URL.createObjectURL(new Blob([bufferedResponse], {type: 'audio/mpeg'}));
                // htmlElement.play();
                // source.connect(audioContext.destination);
                // source.start(0);
                //     })
            }, error => {
                console.error('Error fetching media:', error);
            });
    }
}
