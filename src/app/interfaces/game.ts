import {User} from "./user";
import {Round} from "./round";

export interface Game {
    id: string;
    name: string;
    mode: string;
    author: User;
    createdAt: string;
    lastContributor?: User;
    modifiedAt?: string;
    rounds: Round[];
}