import {Component, Input} from '@angular/core';
import {AudioTrackVersion} from "../interfaces/audio-track-version";
import {AudioTrack} from "../interfaces/audio-track";
import {LibraryPlayerService} from "../audio-controls/library-player.service";
import {ProgressService} from "../range-slider/progress.service";
import {AuthService} from "../services/auth.service";
import {DownloadRemoteAudioService} from "../services/download-remote-audio.service";
import {RangeSliderComponent} from "../range-slider/range-slider.component";

@Component({
    selector: 'app-audiotrack-version-playback-buttons',
    templateUrl: './audiotrack-version-playback-buttons.component.html',
    styleUrls: ['./audiotrack-version-playback-buttons.component.scss']
})
export class AudiotrackVersionPlaybackButtonsComponent {

    @Input("version")
    version: AudioTrackVersion;

    @Input("audio-track")
    audioTrack: AudioTrack;

    @Input("range-slider")
    rangeSlider: RangeSliderComponent;

    currentVersionIsPlaying: boolean;
    trackIsLoading: boolean;
    loadPercents: number = 0;

  constructor(private libraryPlayerService: LibraryPlayerService,
              private progressService: ProgressService,
              private authService: AuthService,
              private downloadService: DownloadRemoteAudioService) {
    this.libraryPlayerService.isPlaying().subscribe(value => {
      if (this.libraryPlayerService.activeVersion === this.version) {
        this.currentVersionIsPlaying = value;
      }
    })
  }

  play() {
    if (!this.audioTrack.url && this.audioTrack.id) {
      this.trackIsLoading = true;
      this.downloadService.loadAudioFromRemote(this.audioTrack.id).subscribe(result => {
        if (typeof result === 'number') {
          this.loadPercents = result;
        } else if (typeof result === 'string') {
          this.audioTrack.audioEl.src = result;
          this.audioTrack.url = `audio-tracks/binary?id=${this.audioTrack.id}`;
          this.libraryPlayerService.play(this.audioTrack, this.version);
          this.trackIsLoading = false;
        }
      })
      return;
    }
    this.libraryPlayerService.play(this.audioTrack, this.version);
  }

  pause() {
    this.libraryPlayerService.pause();
  }

  stop() {
    if (this.version === this.libraryPlayerService.activeVersion) {
      this.libraryPlayerService.stop();
    } else {
      this.audioTrack.audioEl.currentTime = this.version.startTime;
      this.version.progressInSeconds = 0;
      this.rangeSlider.updateProgressSlider(0);
    }

  }

  replay5() {
    this.audioTrack.audioEl.currentTime = Math.max(this.audioTrack.audioEl.currentTime - 5, this.version.startTime);
    this.version.progressInSeconds = this.audioTrack.audioEl.currentTime - this.version.startTime;
    if (this.libraryPlayerService.activeVersion === this.version) {
      this.libraryPlayerService.setProgressPercentage(this.progressService.evaluateProgress(this.audioTrack, this.version));
    } else {
      this.rangeSlider.updateProgressSlider(this.progressService.evaluateProgress(this.audioTrack, this.version));
    }
  }

  forward5() {
    if (this.libraryPlayerService.activeVersion === this.version) {
      this.audioTrack.audioEl.currentTime += 5
      this.libraryPlayerService.setProgressPercentage(this.progressService.evaluateProgress(this.audioTrack, this.version));
    } else {
      this.audioTrack.audioEl.currentTime = Math.min(this.audioTrack.audioEl.currentTime + 5, this.version.endTime);
      this.version.progressInSeconds = this.audioTrack.audioEl.currentTime - this.version.startTime;
      this.rangeSlider.updateProgressSlider(this.progressService.evaluateProgress(this.audioTrack, this.version))
    }
  }
}
