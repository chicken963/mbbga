import { Component } from '@angular/core';
import {LibraryPlayerService} from "../audio-controls/library-player.service";

@Component({
  selector: 'app-volume-slider',
  templateUrl: './volume-slider.component.html',
  styleUrls: ['./volume-slider.component.css']
})
export class VolumeSliderComponent {

  constructor(private libraryPlayerService: LibraryPlayerService) {
  }
  volume: number = 50;
  showSlider: boolean = false;

  formatLabel(value: number): string {
    return `${value}`;
  }
}
