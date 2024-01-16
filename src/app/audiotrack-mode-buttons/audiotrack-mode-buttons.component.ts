import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {AudioTrack} from "../interfaces/audio-track";
import {FormGroup, NgForm} from "@angular/forms";
import {HttpClient} from "@angular/common/http";
import {NotificationService} from "../utils/notification.service";

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

  constructor(private http: HttpClient, private notificationService: NotificationService) {
  }

  ngOnInit() {
    this.snapshot = {
      artist: this.audioTrack.artist,
      name: this.audioTrack.name
    }
  }

  delete() {
    if (this.audioTrack.mode === 'view' || this.audioTrack.mode === 'edit') {
      this.http.delete(`/audio-tracks?id=${this.audioTrack.id}`)
          .subscribe(response => this.notificationService.pushNotification(`Audio track ${this.audioTrack.artist} - ${this.audioTrack.name} is successfully deleted from library.`))
    }
    this.onDelete.emit(this.audioTrack);
  }

  cancel() {
    this.audioTrack.artist = this.snapshot.artist;
    this.audioTrack.name = this.snapshot.name;
    this.switchMode();
  }

  reset() {
    this.audioTrack.artist = this.snapshot.artist;
    this.audioTrack.name = this.snapshot.name;
    this.onReset.emit(this.audioTrack);
  }

  switchMode() {
    if (this.audioTrack.mode === 'workbench_view') {
      this.audioTrack.mode = 'workbench_edit';
      this.audioTrack.versions.forEach(version => version.mode = 'workbench_edit');
      return;
    }
    if (this.audioTrack.mode === 'workbench_edit') {
      //TODO post single audioTrack
      this.audioTrack.mode = 'workbench_view';
      this.audioTrack.versions.forEach(version => version.mode = 'workbench_view');
      this.onSave.emit(this.audioTrack)
      return;
    }
    if (this.audioTrack.mode === 'edit') {
      this.http.put(`/audio-tracks/modify/inputs`, this.audioTrack)
          .subscribe(response => this.notificationService.pushNotification(`Audio track ${this.audioTrack.artist} - ${this.audioTrack.name} is successfully updated.`))
      this.audioTrack.mode = 'view';
      this.onSave.emit(this.audioTrack)
      return;
    }
    if (this.audioTrack.mode === 'view') {
      this.snapshot = {
        artist: this.audioTrack.artist,
        name: this.audioTrack.name
      }
      this.audioTrack.mode = 'edit';
    }
  }
}
