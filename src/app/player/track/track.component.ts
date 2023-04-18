import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { AudioTrack } from '../models/audiotrack';

@Component({
  selector: 'app-track',
  templateUrl: './track.component.html',
  styleUrls: ['./track.component.css']
})
export class TrackComponent implements OnInit {

  @Input()
  audiotrack!: AudioTrack;

  @ViewChild('audioId') audio: HTMLAudioElement;

  ngOnInit(): void {
    var _me = this;
    console.log(this.audio);
    console.log(this.audiotrack);
    this.audio.currentTime = this.audiotrack.startTime;
    this.audio.addEventListener("timeupdate", function () {
      if (_me.audio.currentTime >= _me.audiotrack.endTime) {
        _me.audio.pause();
      }
    });
  }

}
