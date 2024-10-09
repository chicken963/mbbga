export interface BlankStatus {
    id: string;
    blank: {id: string};
    strokeBlankItems: {id: string}[];
    currentProgress: number;
    nextProgress: number;
}