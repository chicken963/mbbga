import { Injectable } from '@angular/core';
import {LocalAudioTrack} from "../local-audio/local-audio-track";

@Injectable({
  providedIn: 'root'
})
export class ProgressService {

  evaluateProgressFor(start: number, current: number, end: number): number {
    let calculatedProgress = (current - start) / (end - start) * 100;
    if (calculatedProgress > 100) return 100;
    if (calculatedProgress < 0) return 0;
    return calculatedProgress;
  }

  evaluateProgress(audioTrack: LocalAudioTrack): number {
    return this.evaluateProgressFor(audioTrack.startTime, audioTrack.audioEl.currentTime, audioTrack.endTime);
  }

}
