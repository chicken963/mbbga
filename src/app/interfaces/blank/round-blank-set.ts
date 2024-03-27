import {StrikeCriterion} from "./strike-criterion";
import {Blank} from "./blank";
import {BlankBackground} from "./background";

export interface RoundBlankSet {
    id?: string;
    rowsCount: number;
    columnsCount: number;
    strikeCriterion: StrikeCriterion;
    blankBackground: BlankBackground;
    round: { id: string,
             name: string,
             index: number
    };
    blanks: Blank[];
}