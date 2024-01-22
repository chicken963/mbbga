import { Injectable } from '@angular/core';
import {AudioTrack} from "../interfaces/audio-track";
import {AudioTrackVersion} from "../interfaces/audio-track-version";
import {RoundTableItem} from "../interfaces/round-table-item";

@Injectable({
  providedIn: 'root'
})
export class ProgressService {

  evaluateProgress(audioTrack: AudioTrack, audioTrackVersion: AudioTrackVersion): number {
    return this.evaluateProgressFor(audioTrackVersion.startTime, audioTrack.audioEl.currentTime, audioTrackVersion.endTime);
  }

  evaluateProgressInRound(roundTableItem: RoundTableItem): number {
    return this.evaluateProgressFor(roundTableItem.startTime, roundTableItem.audioEl.currentTime, roundTableItem.endTime);
  }

  evaluateProgressFor(start: number, current: number, end: number): number {
    let calculatedProgress = (current - start) / (end - start) * 100;
    if (calculatedProgress > 100) return 100;
    if (calculatedProgress < 0) return 0;
    return calculatedProgress;
  }

}
