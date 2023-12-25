import {WinCondition} from "./win-condition";
import {AudioTrack} from "./audio-track";

export interface Round {
    name: string;
    winConditions: WinCondition[];
    tickets?: any;
    audioTracks: AudioTrack[]
}