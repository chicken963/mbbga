import {AfterViewInit, Component, ElementRef, Input, OnChanges, Renderer2} from '@angular/core';
import {MatSliderModule} from "@angular/material/slider";
import {MatIconModule} from "@angular/material/icon";
import {FormsModule} from "@angular/forms";
import {NgIf} from "@angular/common";
import {Observable, Subscription} from "rxjs";
import {RangeSliderService} from "../range-slider.service";
import {LibraryPlayerService} from "../audio-controls/library-player.service";
import {LocalAudioTrack} from "../local-audio/local-audio-track";

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
                private renderer: Renderer2,
                private el: ElementRef) {
    }

    @Input("audio-track")
    audioTrack: LocalAudioTrack;

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

        this.getCurrentTrack().subscribe(audioTrack => {
            if (audioTrack === this.audioTrack) {
                this.progressPercentageSubscription = this.getProgressPercentage().subscribe(value => {
                    console.log(value);
                    this.updateProgressSlider(value);
                })
            } else {
                this.progressPercentageSubscription?.unsubscribe();
            }
        })
    }

    onStartTimeChanged() {
        if (this.playerService.currentTrack === this.audioTrack) {
            this.playerService.setStartTime(this.audioTrack.startTime);
        }
    }

    onEndTimeChanged() {
        if (this.playerService.currentTrack === this.audioTrack) {
            this.playerService.setEndTime(this.audioTrack.endTime);
        }
    }

    updateProgressSlider(percent: number) {
        this.renderer.setStyle(
            this.sliderElement,
            'background',
            `linear-gradient(90deg, rgba(9,121,82,1) ${percent}%, rgba(194,24,91,1) ${percent}%)`
        );
    }

    getCurrentTrack(): Observable<LocalAudioTrack> {
        return this.playerService.getCurrentTrack();
    }

    private getProgressPercentage() {
        return this.playerService.getProgressPercentage();
    }
}
