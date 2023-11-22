import {AudioTrack} from "./audiotrack";

export interface LibraryLetter {
    letter: string;
    artists: Artist[];
}

export interface Artist {
    artistName: string;
    audioTracks: AudioTrack[];
}