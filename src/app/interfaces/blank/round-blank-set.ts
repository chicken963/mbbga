import {StrikeCriterion} from "./strike-criterion";
import {Blank} from "./blank";

export interface RoundBlankSet {
    id?: string;
    rowsCount: number;
    columnsCount: number;
    strikeCriterion: StrikeCriterion;
    round: { id: string };
    blanks: Blank[];
}