import {Component, EventEmitter, Input, OnChanges, Output, SimpleChanges} from '@angular/core';
import {MatSliderModule} from "@angular/material/slider";
import {MatIconModule} from "@angular/material/icon";
import {AudioTrack} from "../interfaces/audiotrack";
import {FormsModule} from "@angular/forms";
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-range-slider',
  templateUrl: './range-slider.component.html',
  styleUrls: ['./range-slider.component.scss'],
  standalone: true,
  imports: [MatSliderModule, MatIconModule, FormsModule, NgIf]
})
export class RangeSliderComponent {

  @Input("audio-track")
  audioTrack: AudioTrack;

}
