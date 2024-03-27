export interface BlankBackground {
    id?: string,
    areas: BackgroundRectangle[]
}

export interface BackgroundRectangle {
    backgroundAreaType: "BLANK_NAME" | "BLANK_NUMBER" | "BLANK_ITEMS",
    startX: number,
    startY: number,
    width: number,
    height: number
}

export const defaultBackground : BlankBackground = {
    areas: [
        {
            backgroundAreaType: "BLANK_NAME",
            startX: 30,
            startY: 100,
            width: 200,
            height: 50
        },
        {
            backgroundAreaType: "BLANK_NUMBER",
            startX: 318,
            startY: 30,
            width: 60,
            height: 30
        },
        {
            backgroundAreaType: "BLANK_ITEMS",
            startX: 10,
            startY: 216,
            width: 380,
            height: 380
        }
    ]
}