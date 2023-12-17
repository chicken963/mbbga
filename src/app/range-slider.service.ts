import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable, Subject} from "rxjs";
import {AudioTrackVersion} from "./interfaces/audio-track-version";

@Injectable({
  providedIn: 'root'
})
export class RangeSliderService {

  private subjectMap = new Map<AudioTrackVersion, Subject<number>[]>();

  constructor() { }

  setStartTime(audioTrack: AudioTrackVersion, startTime: number) {
    this.startObservingTrackIfNotExists(audioTrack);
    this.getStartTimeSubject(audioTrack).next(startTime);
  }

  getStartTime(audioTrack: AudioTrackVersion): Observable<number> {
    this.startObservingTrackIfNotExists(audioTrack);
    return this.getStartTimeSubject(audioTrack).asObservable();
  }

  setEndTime(audioTrack: AudioTrackVersion, endTime: number) {
    this.startObservingTrackIfNotExists(audioTrack);
    this.getEndTimeSubject(audioTrack).next(endTime);
  }

  getEndTime(audioTrack: AudioTrackVersion): Observable<number> {
    this.startObservingTrackIfNotExists(audioTrack);
    return this.getEndTimeSubject(audioTrack).asObservable();
  }

  private startObservingTrackIfNotExists(audioTrack: AudioTrackVersion) {
    if (!this.subjectMap.has(audioTrack)) {
      this.subjectMap.set(audioTrack, [new BehaviorSubject<number>(audioTrack.startTime), new BehaviorSubject<number>(audioTrack.endTime)])
    }
  }

  private getStartTimeSubject(audioTrack: AudioTrackVersion): Subject<number>  {
    return this.subjectMap.get(audioTrack)![0]
  }

  private getEndTimeSubject(audioTrack: AudioTrackVersion): Subject<number>  {
    return this.subjectMap.get(audioTrack)![1]
  }
}
