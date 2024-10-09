import {RoundTableItem} from "../round-table-item";

export interface AudioTrackStatus {
    id: string;
    audioTrack: RoundTableItem;
    indexInHistory: number;
}