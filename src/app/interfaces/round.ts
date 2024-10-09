import {WinCondition} from "./win-condition";
import {RoundTableItem} from "./round-table-item";
import {StrikeCriterion} from "./blank/strike-criterion";

export interface Round {
    id?: string;
    rowsCount: number;
    columnsCount: number;
    indexInGame: number;
    name: string;
    strikeCriterion: StrikeCriterion;
    winConditions: WinCondition[];
    tickets?: any;
    audioTracks: RoundTableItem[]
}