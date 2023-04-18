import { Component, Input  } from '@angular/core';
import { AudioTrack } from '../models/audiotrack';

@Component({
  selector: 'app-playlist',
  templateUrl: './playlist.component.html',
  styleUrls: ['./playlist.component.css']
})
export class PlaylistComponent {
  @Input() audiotracks: AudioTrack[];
}
