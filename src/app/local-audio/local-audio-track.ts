import {AudioTrack} from "../interfaces/audiotrack";

export interface LocalAudioTrack extends AudioTrack {
    audioEl: HTMLAudioElement,
    file: File,
    progressInSeconds: number,
    inputsAreValid: boolean
}