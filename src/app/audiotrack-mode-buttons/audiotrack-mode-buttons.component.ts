import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {AudioTrack} from "../interfaces/audio-track";
import {FormGroup, NgForm} from "@angular/forms";

@Component({
  selector: 'app-audiotrack-mode-buttons',
  templateUrl: './audiotrack-mode-buttons.component.html',
  styleUrls: ['./audiotrack-mode-buttons.component.css', './../audiotrack-version-mode-buttons/audiotrack-version-mode-buttons.component.scss']
})
export class AudiotrackModeButtonsComponent implements OnInit{

  @Input("audio-track")
  audioTrack: AudioTrack;

  @Input("show-revert")
  showRevert: boolean;

  @Output() onDelete = new EventEmitter<AudioTrack>();
  @Output() onReset = new EventEmitter<AudioTrack>();
  @Output() onSave = new EventEmitter<AudioTrack>();

  snapshot: any;

  ngOnInit() {
    this.snapshot = {
      artist: this.audioTrack.artist,
      name: this.audioTrack.name
    }
  }

  setMode(value: string) {
    if (value === 'edit') {
      this.snapshot = {
        artist: this.audioTrack.artist,
        name: this.audioTrack.name
      }
    }
    this.audioTrack.mode = value;
  }

  delete() {
    this.onDelete.emit(this.audioTrack);
  }

  cancel() {
    this.audioTrack.artist = this.snapshot.artist;
    this.audioTrack.name = this.snapshot.name;
    this.setMode('view');
  }

  reset() {
    this.audioTrack.artist = this.snapshot.artist;
    this.audioTrack.name = this.snapshot.name;
    this.onReset.emit(this.audioTrack);
  }
}
