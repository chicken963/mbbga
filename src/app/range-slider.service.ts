import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable, Subject} from "rxjs";
import {AudioTrack} from "./interfaces/audiotrack";

@Injectable({
  providedIn: 'root'
})
export class RangeSliderService {

  private subjectMap = new Map<AudioTrack, Subject<number>[]>();

  constructor() { }

  setStartTime(audioTrack: AudioTrack, startTime: number) {
    this.startObservingTrackIfNotExists(audioTrack);
    this.getStartTimeSubject(audioTrack).next(startTime);
  }

  getStartTime(audioTrack: AudioTrack): Observable<number> {
    this.startObservingTrackIfNotExists(audioTrack);
    return this.getStartTimeSubject(audioTrack).asObservable();
  }

  setEndTime(audioTrack: AudioTrack, endTime: number) {
    this.startObservingTrackIfNotExists(audioTrack);
    this.getEndTimeSubject(audioTrack).next(endTime);
  }

  getEndTime(audioTrack: AudioTrack): Observable<number> {
    this.startObservingTrackIfNotExists(audioTrack);
    return this.getEndTimeSubject(audioTrack).asObservable();
  }

  private startObservingTrackIfNotExists(audioTrack: AudioTrack) {
    if (!this.subjectMap.has(audioTrack)) {
      this.subjectMap.set(audioTrack, [new BehaviorSubject<number>(audioTrack.startTime), new BehaviorSubject<number>(audioTrack.endTime)])
    }
  }

  private getStartTimeSubject(audioTrack: AudioTrack): Subject<number>  {
    return this.subjectMap.get(audioTrack)![0]
  }

  private getEndTimeSubject(audioTrack: AudioTrack): Subject<number>  {
    return this.subjectMap.get(audioTrack)![1]
  }
}
