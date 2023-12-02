import {AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {AudioTrack} from "../interfaces/audiotrack";
import {LibraryPlayerService} from "../audio-controls/library-player.service";
import {VolumeService} from "../volume.service";

@Component({
  selector: 'app-audiotrack-edit-controls',
  templateUrl: './audiotrack-edit-controls.component.html',
  styleUrls: ['./audiotrack-edit-controls.component.scss']
})
export class AudiotrackEditControlsComponent implements AfterViewInit{

  @Input("audio-track")
  audioTrack: AudioTrack;

  @ViewChild("defaultAudio")
  private defaultAudio: ElementRef;

  rangeValues: number[] = [20, 80]; // Initial range values
  minValue = 0;
  maxValue = 100;

  constructor(private libraryPlayerService: LibraryPlayerService,
              private volumeService: VolumeService) {
  }

  ngAfterViewInit(): void {
    this.volumeService.getVolume().subscribe((volume) => {
      this.defaultAudio.nativeElement.volume = volume;
    });
  }

  play() {
    this.libraryPlayerService.isPlaying = true;
    let switchedFromAnotherTrack: boolean = this.libraryPlayerService.currentTrack === this.audioTrack;
    if (switchedFromAnotherTrack) {
      this.libraryPlayerService.currentTrack = this.audioTrack;
      this.defaultAudio.nativeElement.volume = this.libraryPlayerService.volume;
      this.defaultAudio.nativeElement.currentTime = this.audioTrack.startTime;
    }
    this.defaultAudio.nativeElement.play();
  }

  pause() {
    this.libraryPlayerService.isPlaying = false;
    this.defaultAudio.nativeElement.pause();
  }

  isPlaying(): boolean {
    return this.libraryPlayerService.isPlayingNow(this.audioTrack);
  }

  stop() {
    this.libraryPlayerService.isPlaying = false;
    this.defaultAudio.nativeElement.pause();
    this.defaultAudio.nativeElement.currentTime = 0;
  }

  replay5() {
    this.defaultAudio.nativeElement.currentTime -= 5;
  }

  forward5() {
    this.defaultAudio.nativeElement.currentTime += 5;
  }

}
