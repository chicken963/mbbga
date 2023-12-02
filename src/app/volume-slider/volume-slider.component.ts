import { Component } from '@angular/core';
import {LibraryPlayerService} from "../audio-controls/library-player.service";
import {VolumeService} from "../volume.service";

@Component({
  selector: 'app-volume-slider',
  templateUrl: './volume-slider.component.html',
  styleUrls: ['./volume-slider.component.scss']
})
export class VolumeSliderComponent {

  constructor(private libraryPlayerService: LibraryPlayerService,
              private volumeService: VolumeService) {
  }
  volume: number = 100;

  formatLabel(value: number): string {
    return `${value}`;
  }

  setVolume() {
    this.volumeService.setVolume(this.volume);
  }
}
