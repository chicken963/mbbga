import {Component, Input} from '@angular/core';
import {AudioTrack} from "../interfaces/audio-track";

@Component({
  selector: 'app-round-playlist',
  templateUrl: './round-playlist.component.html',
  styleUrls: ['./round-playlist.component.css']
})
export class RoundPlaylistComponent {

  @Input("audio-tracks")
  audioTracks: AudioTrack[];

  displayedColumns: string[] = ['position', 'artist', 'title', 'duration'];

}
