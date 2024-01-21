import {AudioTrack} from "./audio-track";


export interface LibraryLetter {
    letter: string;
    artists?: Artist[];
}

export interface Artist {
    id: string;
    artistName: string;
    audioTracks?: AudioTrack[];
}