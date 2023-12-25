import {AfterViewInit, Component, ElementRef, Input, OnChanges, Renderer2} from '@angular/core';
import {MatSliderModule} from "@angular/material/slider";
import {MatIconModule} from "@angular/material/icon";
import {FormsModule} from "@angular/forms";
import {NgIf} from "@angular/common";
import {Observable, Subscription} from "rxjs";
import {RangeSliderService} from "../services/range-slider.service";
import {LibraryPlayerService} from "../audio-controls/library-player.service";
import {AudiotrackValidateService} from "../audiotrack-validate.service";
import {AudioTrackVersion} from "../interfaces/audio-track-version";
import {AudioTrack} from "../interfaces/audio-track";

@Component({
    selector: 'app-range-slider',
    templateUrl: './range-slider.component.html',
    styleUrls: ['./range-slider.component.scss'],
    standalone: true,
    imports: [MatSliderModule, MatIconModule, FormsModule, NgIf]
})
export class RangeSliderComponent implements AfterViewInit {

    startTime: number;
    endTime: number;
    sliderElement: any;
    progressPercentageSubscription: Subscription;

    constructor(private rangeSliderService: RangeSliderService,
                private playerService: LibraryPlayerService,
                private audioTrackValidateService: AudiotrackValidateService,
                private renderer: Renderer2,
                private el: ElementRef) {
    }

    @Input("audio-track")
    audioTrack: AudioTrack;

    @Input("version")
    audioTrackVersion: AudioTrackVersion;

    @Input("mode")
    mode: string;

    ngAfterViewInit() {
        this.sliderElement = this.el.nativeElement.querySelector('.mdc-slider__track--active_fill');

        this.renderer.setStyle(
            this.sliderElement,
            'border-color',
            'transparent'
        );

        this.renderer.setStyle(
            this.sliderElement,
            'border-width',
            '4px'
        );

        this.updateProgressSlider(0);

        this.getCurrentVersion().subscribe(audioTrackVersion => {
            if (audioTrackVersion === this.audioTrackVersion) {
                this.progressPercentageSubscription = this.getProgressPercentage().subscribe(value => {
                    this.updateProgressSlider(value);
                })
            } else {
                this.progressPercentageSubscription?.unsubscribe();
            }
        })
    }

    onStartTimeChanged(event: any) {
        this.audioTrackVersion.startTime = this.audioTrackValidateService.validateStartTime(this.audioTrackVersion, event.target.value);
        if (this.playerService.activeVersion === this.audioTrackVersion) {
            this.playerService.setStartTime(this.audioTrackVersion.startTime);
        }
    }

    onEndTimeChanged(event: any) {
        this.audioTrackVersion.endTime = this.audioTrackValidateService.validateEndTime(this.audioTrack, this.audioTrackVersion, event.target.value);
        if (this.playerService.activeVersion === this.audioTrackVersion) {
            this.playerService.setEndTime(this.audioTrackVersion.endTime);
        }
    }

    updateProgressSlider(percent: number) {
        this.renderer.setStyle(
            this.sliderElement,
            'background',
            `linear-gradient(90deg, rgba(73,156,84,1) ${percent}%, rgba(194,24,91,1) ${percent}%)`
        );
    }

    getCurrentVersion(): Observable<AudioTrackVersion> {
        return this.playerService.getCurrentVersion();
    }

    private getProgressPercentage() {
        return this.playerService.getProgressPercentage();
    }
}
