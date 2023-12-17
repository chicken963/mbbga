import {AudioTrackVersion} from "./audio-track-version";

export interface AudioTrack {
    id?: string;
    audioEl: HTMLAudioElement,
    file: File,
    url:string;
    length: number;
    name: string;
    artist: string;
    inputsAreValid: boolean,
    mode: string;
    versions: AudioTrackVersion[];
}