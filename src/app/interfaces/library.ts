import {AudioTrack} from "./audio-track";


export interface LibraryLetter {
    letter: string;
    artists?: Artist[];
}

export interface Artist {
    artistName: string;
    audioTracks?: AudioTrack[];
}