import {User} from "../user";
import {AreaType} from "../../blank/AreaType";

export interface BlankBackground {
    id?: string;
    createdAt?: Date;
    name?: string;
    owner?: User;
    isOwnedByCurrentUser?: boolean;
    image?: string | ArrayBuffer;
    fontSize?: number;
    areas: BackgroundRectangle[];
}

export interface BackgroundRectangle {
    id?: string;
    backgroundAreaType: AreaType,
    startX: number,
    startY: number,
    width: number,
    height: number,
    font: string,
    fontSize: number
}