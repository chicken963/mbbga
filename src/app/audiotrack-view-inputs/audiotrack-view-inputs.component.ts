import {Component, Input} from '@angular/core';
import {AudioTrack} from "../interfaces/audiotrack";

@Component({
  selector: 'app-audiotrack-view-inputs',
  templateUrl: './audiotrack-view-inputs.component.html',
  styleUrls: ['./audiotrack-view-inputs.component.css']
})
export class AudiotrackViewInputsComponent {

  @Input("audio-track")
  audioTrack: AudioTrack;
}
