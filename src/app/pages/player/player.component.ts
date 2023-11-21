import { AfterViewInit, Component, ViewChildren } from '@angular/core';
import { AudioTrack } from 'src/app/interfaces/audiotrack';
import { CloudService } from 'src/app/services/cloud.service';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss']
})
export class PlayerComponent {
  files: Array<AudioTrack> = [];
  currentFile: any = {};

  constructor(
    public cloudService: CloudService
  ) {
    // localStorage.setItem("mbbg_token", "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJhZG1pbiIsImV4cCI6MTY5OTQ3MzYxNSwiaWF0IjoxNjk5Mzg3MjE1fQ.kJUbv1cg7WIB9lDE0ilLjZNGG0rWpBUlWOZCDGD6KCA")
  }

}