import {WinCondition} from "./win-condition";
import {RoundTableItem} from "./round-table-item";

export interface Round {
    fieldSize: [number, number];
    name: string;
    winConditions: WinCondition[];
    tickets?: any;
    audioTracks: RoundTableItem[]
}