import {Component, Input} from '@angular/core';
import {AudioTrack} from "../interfaces/audiotrack";
import {TimeConversionService} from "../time-conversion.service";

@Component({
  selector: 'app-audiotrack-edit-inputs',
  templateUrl: './audiotrack-edit-inputs.component.html',
  styleUrls: ['./audiotrack-edit-inputs.component.css']
})
export class AudiotrackEditInputsComponent {

  @Input("audio-track")
  audioTrack: AudioTrack;

  constructor(private timeConversionService: TimeConversionService) {
  }

  updateStartTime($event: any, audiotrack: AudioTrack) {
    audiotrack.startTime = this.timeConversionService.stringToSeconds($event.target.value);
  }

  updateEndTime($event: any, audiotrack: AudioTrack) {
    audiotrack.endTime = this.timeConversionService.stringToSeconds($event.target.value);
  }

}
