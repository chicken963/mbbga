import { Injectable } from '@angular/core';
import {AudioTrack} from "./interfaces/audio-track";
import {AudioTrackVersion} from "./interfaces/audio-track-version";

@Injectable({
    providedIn: 'root'
})
export class AudiotrackValidateService {

    constructor() { }

    validateEndTime(audioTrack: AudioTrack, audioTrackVersion: AudioTrackVersion, endTime: number) : number {
        if (endTime > audioTrack.length) {
            return audioTrack.length;
        }
        if (endTime < audioTrackVersion.startTime + 0.5) {
            return audioTrackVersion.startTime + 0.5;
        }
        return endTime;
    }

    validateStartTime(audioTrackVersion: AudioTrackVersion, startTime: number) : number {
        if (startTime > audioTrackVersion.endTime - 0.5) {
            return audioTrackVersion.endTime - 0.5;
        }
        if (startTime < 0) {
            return 0;
        }
        return startTime;
    }
}