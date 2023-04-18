import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AudioTrack } from './models/audiotrack';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.css']
})

export class PlayerComponent {

  audiotracks: AudioTrack[] = [];

  constructor(private http: HttpClient) {
  }

  loadPlaylist() {
    this.http.get('http://localhost:8080/audiotracks/all').subscribe(
      (data: Object) => {
        this.audiotracks = data as AudioTrack[];
      },
      (error) => {
        console.error(error);
      }
    );
  }
}
