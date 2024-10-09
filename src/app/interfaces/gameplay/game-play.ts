import {User} from "../user";
import {RoundPlay} from "./round-play";

export interface GamePlay {
    id: string;
    owner: User;
    startedAt: string;
    roundPlays: RoundPlay[];
    gameBlankSet: {
        id: string;
        name: string;
    }
}