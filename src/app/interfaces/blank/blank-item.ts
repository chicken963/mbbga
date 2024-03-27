import {RoundTableItem} from "../round-table-item";

export interface BlankItem {
    id: string;
    rowIndex: number;
    columnIndex: number;
    stroke: boolean;
    audioTrack: RoundTableItem;
}