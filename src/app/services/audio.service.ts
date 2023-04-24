import { ChangeDetectorRef, ElementRef, Injectable } from "@angular/core";
import { Observable, BehaviorSubject, Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import * as moment from "moment";
import { StreamState } from "../interfaces/stream-state";

@Injectable({
  providedIn: "root"
})
export class AudioService {

  private stop$ = new Subject();
  private audioObj = new ElementRef<HTMLAudioElement>(new Audio());
  private volume = 1;
  private startTime = 0;
  private wasInitiatedStartTime: boolean = false;
  audioEvents = [
    "ended",
    "error",
    "play",
    "playing",
    "pause",
    "timeupdate",
    "volumechange",
    "canplay",
    "loadedmetadata",
    "loadstart"
  ];
  

  private state: StreamState = {
    playing: false,
    readableCurrentTime: '',
    readableDuration: '',
    duration: undefined,
    currentTime: undefined,
    startTime: undefined,
    endTime: undefined,
    canplay: false,
    volume: 1,
    error: false,
  };

  private stateChange: BehaviorSubject<StreamState> = new BehaviorSubject(
    this.state
  );

  private updateStateEvents(event: Event): void {
    switch (event.type) {
      case "canplay":
        this.state.duration = this.audioObj.nativeElement.duration;
        this.state.readableDuration = this.formatTime(this.state.duration);
        this.state.canplay = true;
        this.wasInitiatedStartTime = true;
        break;
      case "playing":
        this.state.playing = true;
        break;
      case "pause":
        this.state.playing = false;
        break;
      case "timeupdate":
        this.state.currentTime = +this.audioObj.nativeElement.currentTime;
        if (this.state.currentTime >= (this.state.endTime as number)) {
          this.stop(false);
        }
        this.state.readableCurrentTime = this.formatTime(
          this.state.currentTime
        );
        break;
      case "volumechange":
        this.state.volume = this.audioObj.nativeElement.volume;
        break;
      case "error":
        this.resetState();
        this.state.error = true;
        break;
    }
    this.stateChange.next(this.state);
  }

  private streamObservable(file: any) {
    return new Observable(observer => {
      // Play audio
      this.audioObj.nativeElement.src = file.url;
      this.audioObj.nativeElement.volume = this.volume;
      this.state.startTime = file.startTime;
      this.startTime = file.startTime;
      this.state.endTime = file.endTime;
      this.audioObj.nativeElement.load();
      this.audioObj.nativeElement.play();
  
      const handler = (event: Event) => {
        this.updateStateEvents(event);
        observer.next(event);
      };
  
      this.addEvents(this.audioObj.nativeElement, this.audioEvents, handler);
      return () => {
        // Stop Playing
        this.audioObj.nativeElement.pause();
        this.audioObj.nativeElement.currentTime = this.state.startTime ? this.state.startTime : 0;
        // remove event listeners
        this.removeEvents(this.audioObj.nativeElement, this.audioEvents, handler);
        // reset state
        this.resetState();
      };
    });
  }

  private addEvents(obj: HTMLAudioElement, events: any[], handler: (event: Event) => void) {
    events.forEach((event: any) => {
      obj.addEventListener(event, handler);
    });
  }

  private removeEvents(obj: HTMLAudioElement, events: any[], handler: (event: Event) => void) {
    events.forEach((event: any) => {
      obj.removeEventListener(event, handler);
    });
  }

  playStream(file: any) {
    return this.streamObservable(file).pipe(takeUntil(this.stop$));
  }

  play() {
    this.audioObj.nativeElement.play();
  }

  pause() {
    this.audioObj.nativeElement.pause();
  }

  stop(manual: boolean) {
    if (manual) {
      this.audioObj.nativeElement.pause();
      this.audioObj.nativeElement.currentTime = this.state.startTime ? this.state.startTime : 0;
    } else {
      this.stop$.next(this.audioObj);
    }
  
  }

  seekTo(seconds: number) {
    this.audioObj.nativeElement.currentTime = seconds;
  }

  setVolume(value: number) {
    this.volume = value;
    this.audioObj.nativeElement.volume = this.volume;
  }

  formatTime(time: number, format: string = "HH:mm:ss") {
    const momentTime = time * 1000;
    return moment.utc(momentTime).format(format);
  }

  private resetState() {
    this.state = {
      playing: false,
      readableCurrentTime: '',
      readableDuration: '',
      duration: undefined,
      volume: 1,
      currentTime: undefined,
      startTime: undefined,
      endTime: undefined,
      canplay: false,
      error: false
    };
  }

  getState(): Observable<StreamState> {
    return this.stateChange.asObservable();
  }
}