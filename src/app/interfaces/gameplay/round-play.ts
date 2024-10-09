import {AudioTrackStatus} from "./audio-track-status";
import {WinCondition} from "../win-condition";
import {BlankStatus} from "./blank-status";
import {RoundMetadata} from "../round-metadata";

export interface RoundPlay {
    id: string;
    status: string;
    round: RoundMetadata;
    audioTrackHistory: AudioTrackStatus[];
    winCondition: WinCondition;
    nextTrack: AudioTrackStatus;
    blankStatuses: BlankStatus[];
}