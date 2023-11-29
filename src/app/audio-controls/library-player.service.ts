import {Injectable} from "@angular/core";
import {AudioTrack} from "../interfaces/audiotrack";

@Injectable({
    providedIn: "root"
})
export class LibraryPlayerService {
    isPlaying: boolean = false;
    currentTrack: AudioTrack;
    volume: number = 1;

    isPlayingNow(audioTrack: AudioTrack): boolean {
        return this.isPlaying && this.currentTrack === audioTrack;
    }
}