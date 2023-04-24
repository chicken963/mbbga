import { AfterViewInit, Component, ViewChildren } from '@angular/core';
import { StreamState } from 'src/app/interfaces/stream-state';
import { AudioTrack } from 'src/app/interfaces/audiotrack';
import { AudioService } from 'src/app/services/audio.service';
import { CloudService } from 'src/app/services/cloud.service';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss']
})
export class PlayerComponent {
  files: Array<AudioTrack> = [];
  state: StreamState;
  currentFile: any = {};

  constructor(
    public audioService: AudioService,
    public cloudService: CloudService
  ) {
    // get media files
    cloudService.getFiles().subscribe(files => {
      this.files = files;
    });

    // listen to stream state
    this.audioService.getState().subscribe(state => {
      this.state = state;
    });
  }

  playStream(file : AudioTrack, index: number) {
    this.audioService.playStream(file).subscribe(events => {
      // listening for fun here
    });
  }

  isFirstPlaying() {
    return this.currentFile.index === 0;
  }

  isLastPlaying() {
    return this.currentFile.index === this.files.length - 1;
  }

  openFile(file: any, index: number) {
    this.currentFile = { index, file };
    this.audioService.stop(false);
    this.playStream(file, index);
  }

  onSliderChangeEnd(change: any) {
    this.audioService.seekTo(change.value);
  }

  onVolumeChanged(change: any) {
    this.audioService.setVolume(change.value);
  }

  previous() {
    const index = this.currentFile.index - 1;
    const file = this.files[index];
    this.openFile(file, index);
  }

  play() {
    this.audioService.play();
  }

  pause() {
    this.audioService.pause();
  }

  stop() {
    this.audioService.stop(true);
    this.state.playing = false;
  }

  next() {
    const index = this.currentFile.index + 1;
    const file = this.files[index];
    this.openFile(file, index);
  }
}