import {Component, ElementRef, Input, ViewChild} from '@angular/core';
import {AudioTrack} from "../interfaces/audiotrack";
import {TimeConversionService} from "../time-conversion.service";
import {LibraryPlayerService} from "./library-player.service";
import {LocalAudioTrack} from "../local-audio/local-audio-track";

@Component({
    selector: 'app-audio-controls',
    templateUrl: './audio-controls.component.html',
    styleUrls: ['./audio-controls.component.scss']
})
export class AudioControlsComponent {

    @Input("mode")
    mode: string;

    @Input("audio-track")
    audioTrack: LocalAudioTrack;

}

export interface UpdatePlayState {
    isPlayed: boolean,
    audioTrack: LocalAudioTrack;
}
