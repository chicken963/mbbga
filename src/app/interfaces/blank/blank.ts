import {BlankItem} from "./blank-item";

export interface Blank {
    id: string;
    number: string;
    s3Location: string;
    valid: boolean;
    rowsCount: number;
    columnsCount: number;
    items: BlankItem[];
}