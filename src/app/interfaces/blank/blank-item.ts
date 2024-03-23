import {AudioTrackVersion} from "../audio-track-version";

export interface BlankItem {
    id: string;
    rowIndex: number;
    columnIndex: number;
    stroke: boolean;
    audioTrackVersion: AudioTrackVersion;
}