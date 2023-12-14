import {LocalAudioTrack} from "../local-audio/local-audio-track";

export interface LibraryLetter {
    letter: string;
    artists?: Artist[];
}

export interface Artist {
    artistName: string;
    audioTracks?: LocalAudioTrack[];
}