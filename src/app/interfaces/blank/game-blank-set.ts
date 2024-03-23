import {RoundBlankSet} from "./round-blank-set";
import {User} from "../user";

export interface GameBlankSet {
    id?: string;
    createdAt?: Date;
    name?: string;
    owner: User;
    isOwnedByCurrentUser?: boolean;
    game: {id: string };
    numberOfBlanks: number;
    roundBlankSets: RoundBlankSet[];
}