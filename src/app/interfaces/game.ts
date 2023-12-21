import {User} from "./user";

export interface Game {
    name: string;
    author: User;
    createdAt: string;
    lastContributor: User;
    modifiedAt: string;
}