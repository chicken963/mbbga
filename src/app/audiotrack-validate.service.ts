import { Injectable } from '@angular/core';
import {AudioTrack} from "./interfaces/audiotrack";

@Injectable({
    providedIn: 'root'
})
export class AudiotrackValidateService {

    constructor() { }

    validateEndTime(audioTrack: AudioTrack, endTime: number) : number {
        if (endTime > audioTrack.length) {
            return audioTrack.length;
        }
        if (endTime < audioTrack.startTime + 0.5) {
            return audioTrack.startTime + 0.5;
        }
        return endTime;
    }

    validateStartTime(audioTrack: AudioTrack, startTime: number) : number {
        if (startTime > audioTrack.endTime - 0.5) {
            return audioTrack.endTime - 0.5;
        }
        if (startTime < 0) {
            return 0;
        }
        return startTime;
    }
}