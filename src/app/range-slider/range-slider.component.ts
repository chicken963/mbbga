import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {MatSliderModule} from "@angular/material/slider";
import {MatIconModule} from "@angular/material/icon";
import {AudioTrack} from "../interfaces/audiotrack";
import {FormsModule} from "@angular/forms";
import {NgIf} from "@angular/common";
import {BehaviorSubject, Observable} from "rxjs";
import {RangeSliderService} from "../range-slider.service";

@Component({
  selector: 'app-range-slider',
  templateUrl: './range-slider.component.html',
  styleUrls: ['./range-slider.component.scss'],
  standalone: true,
  imports: [MatSliderModule, MatIconModule, FormsModule, NgIf]
})
export class RangeSliderComponent {

  startTime: number;
  endTime: number;

  constructor(private rangeSliderService: RangeSliderService) {
  }

  @Input("audio-track")
  audioTrack: AudioTrack;

  setStartTime() {
    this.rangeSliderService.setStartTime(this.audioTrack, this.startTime);
  }

  setEndTime() {
    this.rangeSliderService.setEndTime(this.audioTrack, this.endTime);
  }

}
