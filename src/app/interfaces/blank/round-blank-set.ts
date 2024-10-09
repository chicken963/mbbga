import {StrikeCriterion} from "./strike-criterion";
import {Blank} from "./blank";
import {BlankBackground} from "./background";
import {RoundMetadata} from "../round-metadata";

export interface RoundBlankSet {
    id?: string;
    rowsCount: number;
    columnsCount: number;
    strikeCriterion: StrikeCriterion;
    blankBackground: BlankBackground;
    round: RoundMetadata;
    blanks: Blank[];
}