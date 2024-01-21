import {Component, Input} from '@angular/core';
import {AudioTrackVersion} from "../interfaces/audio-track-version";
import {TimeConversionService} from "../services/time-conversion.service";
import {AudiotrackValidateService} from "../audiotrack-validate.service";
import {LibraryPlayerService} from "../audio-controls/library-player.service";
import {AudioTrack} from "../interfaces/audio-track";
import {BehaviorSubject, Observable} from "rxjs";

@Component({
  selector: 'app-audiotrack-version-edit-inputs',
  templateUrl: './audiotrack-version-edit-inputs.component.html',
  styleUrls: ['./audiotrack-version-edit-inputs.component.scss', './../common-styles/arrow-buttons.scss']
})
export class AudiotrackVersionEditInputsComponent {

  @Input("version")
  audioTrackVersion: AudioTrackVersion;

  @Input("disabled")
  disabled: boolean;

  @Input("audioTrack")
  audioTrack: AudioTrack;
  numericArrowThreshold: number = 78;

  versionInputs: any;

  constructor(private timeConversionService: TimeConversionService,
              private libraryPlayerService: LibraryPlayerService,
              private audiotrackValidateService: AudiotrackValidateService){

  }

  getProgress(): Observable<number> {
    return this.audioTrackVersion === this.libraryPlayerService.activeVersion
        ? this.libraryPlayerService.getProgressInSeconds()
        : new BehaviorSubject(this.audioTrackVersion.progressInSeconds).asObservable();
  }

  updateStartTime($event: any) {
    let newValue = this.timeConversionService.stringToSeconds($event.target.value);
    this.audioTrackVersion.startTime = this.audiotrackValidateService.validateStartTime(this.audioTrackVersion, newValue);
    if (this.libraryPlayerService.currentTrack === this.audioTrack) {
      this.libraryPlayerService.setStartTime(this.audioTrackVersion.startTime);
    }
  }

  updateEndTime($event: any) {
    let newValue = this.timeConversionService.stringToSeconds($event.target.value);
    this.audioTrackVersion.endTime = this.audiotrackValidateService.validateEndTime(this.audioTrack, this.audioTrackVersion, newValue);
    if (this.libraryPlayerService.currentTrack === this.audioTrack) {
      this.libraryPlayerService.setEndTime(this.audioTrackVersion.endTime);
    }
  }

  incrementStartTime() {
    this.audioTrackVersion.startTime = this.audiotrackValidateService.validateStartTime(this.audioTrackVersion, this.audioTrackVersion.startTime + 0.1);
    if (this.libraryPlayerService.currentTrack === this.audioTrack) {
      this.libraryPlayerService.setStartTime(this.audioTrackVersion.startTime);
    }
  }

  decrementStartTime() {
    this.audioTrackVersion.startTime = this.audiotrackValidateService.validateStartTime(this.audioTrackVersion, this.audioTrackVersion.startTime - 0.1);
    if (this.libraryPlayerService.currentTrack === this.audioTrack) {
      this.libraryPlayerService.setStartTime(this.audioTrackVersion.startTime);
    }
  }

  incrementEndTime() {
    this.audioTrackVersion.endTime = this.audiotrackValidateService.validateEndTime(this.audioTrack, this.audioTrackVersion, this.audioTrackVersion.endTime + 0.1);
    if (this.libraryPlayerService.currentTrack === this.audioTrack) {
      this.libraryPlayerService.setEndTime(this.audioTrackVersion.endTime);
    }
  }

  decrementEndTime() {
    this.audioTrackVersion.endTime = this.audiotrackValidateService.validateEndTime(this.audioTrack, this.audioTrackVersion, this.audioTrackVersion.endTime - 0.1);
    if (this.libraryPlayerService.currentTrack === this.audioTrack) {
      this.libraryPlayerService.setEndTime(this.audioTrackVersion.endTime);
    }
  }
}
