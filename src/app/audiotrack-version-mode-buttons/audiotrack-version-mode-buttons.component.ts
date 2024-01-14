import {Component, EventEmitter, Input, Output} from '@angular/core';
import {AudioTrackVersion} from "../interfaces/audio-track-version";
import {AudioTrack} from "../interfaces/audio-track";

@Component({
  selector: 'app-audiotrack-version-mode-buttons',
  templateUrl: './audiotrack-version-mode-buttons.component.html',
  styleUrls: ['./audiotrack-version-mode-buttons.component.scss']
})
export class AudiotrackVersionModeButtonsComponent {

  @Input("version")
  version: AudioTrackVersion;

  @Input("audio-track")
  audioTrack: AudioTrack;

  @Output() onDelete = new EventEmitter<AudioTrackVersion>();
  @Output() onReset = new EventEmitter<AudioTrackVersion>();

  snapshot: any;

  setMode(value: string) {
    if (value === 'edit') {
      this.snapshot = {
        startTime: this.version.startTime,
        endTime: this.version.endTime
      }
    }
    this.version.mode = value;
  }

  delete() {
    this.onDelete.emit(this.version);
  }

  cancel() {
    this.version.startTime = this.snapshot.startTime;
    this.version.endTime = this.snapshot.endTime;
    this.setMode('view');
  }

  reset() {
    this.version.startTime = this.snapshot.startTime;
    this.version.endTime = this.snapshot.endTime;
    this.onReset.emit(this.version);
  }
}
