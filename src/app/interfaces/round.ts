import {WinCondition} from "./win-condition";
import {AudioTrack} from "./audio-track";

export interface Round {
    fieldSize: [number, number];
    name: string;
    winConditions: WinCondition[];
    tickets?: any;
    audioTracks: AudioTrack[]
}