import {User} from "./user";
import {Round} from "./round";

export interface Game {
    name: string;
    author: User;
    createdAt: string;
    lastContributor?: User;
    modifiedAt?: string;
    numberOfTickets: number;
    rounds: Round[];
}