import {WinCondition} from "./win-condition";
import {RoundTableItem} from "./round-table-item";

export interface Round {
    rowsCount: number;
    columnsCount: number;
    name: string;
    winCriterion: string;
    winConditions: WinCondition[];
    tickets?: any;
    audioTracks: RoundTableItem[]
}