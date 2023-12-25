import {Component, OnInit} from '@angular/core';
import {LibraryPlayerService} from "../audio-controls/library-player.service";
import {VolumeService} from "../services/volume.service";

@Component({
  selector: 'app-volume-slider',
  templateUrl: './volume-slider.component.html',
  styleUrls: ['./volume-slider.component.scss']
})
export class VolumeSliderComponent implements OnInit {

  constructor(private libraryPlayerService: LibraryPlayerService,
              private volumeService: VolumeService) {
  }

  ngOnInit(): void {
        this.volumeService.getVolume().subscribe((value) => {
          this.volume = value;
        })
    }

  volume: number = 100;

  formatLabel(value: number): string {
    return `${value}`;
  }

  setVolume() {
    this.volumeService.setVolume(this.volume);
  }
}
