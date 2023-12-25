export enum WinConditionType {
    LINES = "Lines strike",
    FULL = "Full field"
}

export class WinCondition {
    type: WinConditionType;
    weight: number;
}