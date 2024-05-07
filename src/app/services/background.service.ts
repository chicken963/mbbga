import {Injectable} from '@angular/core';
import {BackgroundRectangle, BlankBackground} from "../interfaces/blank/background";
import {HttpClient} from "@angular/common/http";
import {AreaType} from "../blank/AreaType";
import {BehaviorSubject, Observable, ReplaySubject, Subject} from "rxjs";
import {GameBlankSet} from "../interfaces/blank/game-blank-set";
import {RoundBlankSet} from "../interfaces/blank/round-blank-set";
import {Game} from "../interfaces/game";

@Injectable({
    providedIn: 'root'
})
export class BackgroundService {

    private _defaultBackground: BlankBackground;

    backgroundAdded: Subject<BlankBackground> = new Subject<BlankBackground>();
    backgroundFetched: Subject<BlankBackground|null> = new Subject<BlankBackground|null>();

    private roundBlanksScreenshotsFinished: Subject<RoundBlankSet> = new Subject<RoundBlankSet>();
    private roundBlankSetComponentRendered: Subject<RoundBlankSet> = new Subject<RoundBlankSet>();
    private imageZipped: Subject<boolean> = new Subject<boolean>();

    navigationToGameBlankSetCreationFromBackgroundSelect: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);



    constructor(private http: HttpClient) {
        this._defaultBackground = this.generateDefaultBackground();
        this.fetchDefaultImage();
    }

    generateDefaultBackground(): BlankBackground {
        return {
            name: 'default',
            fontSize: 18,
            areas: [
                {
                    backgroundAreaType: AreaType.ROUND_NAME,
                    startX: 50,
                    startY: 100,
                    width: 500,
                    height: 90,
                    font: 'Arial',
                    fontSize: 18
                },
                {
                    backgroundAreaType: AreaType.BLANK_NUMBER,
                    startX: 662,
                    startY: 45,
                    width: 150,
                    height: 72,
                    font: 'Arial',
                    fontSize: 18
                },
                {
                    backgroundAreaType: AreaType.ITEMS_FIELD,
                    startX: 36,
                    startY: 486,
                    width: 790,
                    height: 790,
                    font: 'Arial',
                    fontSize: 18
                }
            ]
        }
    }


    fetchDefaultImage() {
        const imagePath = 'assets/template.png';
        this.http.get(imagePath, {responseType: 'blob'}).subscribe(blob => {
            const reader = new FileReader();
            reader.onload = (event) => {
                this._defaultBackground.image = reader.result as string;
            };
            reader.readAsDataURL(blob);
        });
    }


    fetchImage(background: BlankBackground) {
        this.http.get(`/backgrounds/image?background-id=${background.id}`, {responseType: 'blob'})
            .subscribe((blob: Blob) => {
                const reader = new FileReader();
                reader.onload = () => {
                    background.image = reader.result as string;
                    this.backgroundFetched.next(background);
                };
                reader.readAsDataURL(blob);
            },
            () => this.backgroundFetched.next(null));
    }

    bindBackgroundsToBlankSet(backgrounds: BlankBackground[], gameBlankSet: GameBlankSet) {
        backgrounds
            .filter(background => background)
            .forEach(background => {
                gameBlankSet.roundBlankSets.forEach(roundBlankSet => {
                    if (roundBlankSet.blankBackground && roundBlankSet.blankBackground.id === background.id) {
                        roundBlankSet.blankBackground = background;
                    }
                    if (!roundBlankSet.blankBackground) {
                        roundBlankSet.blankBackground = this.defaultBackground;
                    }
                })
            });
    }

    get defaultBackground(): BlankBackground {
        return this._defaultBackground;
    }

    getBackgroundAdded(): Observable<BlankBackground> {
        return this.backgroundAdded.asObservable();
    }

    setBackgroundAdded(background: BlankBackground) {
        this.backgroundAdded.next(background);
    }

    getBackgroundFetched(): Observable<BlankBackground|null> {
        return this.backgroundFetched.asObservable();
    }

    setCurrentGameSet(gameSet: GameBlankSet) {
        sessionStorage.setItem('gameBlankSet', JSON.stringify(gameSet));
    }

    getCachedCurrentGameSet(): GameBlankSet | null {
        if (sessionStorage.getItem("gameBlankSet") != null) {
            let gameBlankSetAsString: string = sessionStorage.getItem("gameBlankSet")!;
            return JSON.parse(gameBlankSetAsString) as GameBlankSet;
        }
        return null;
    }

    setRoundBlanksScreenshotsFinished(roundBlankSet: RoundBlankSet) {
        this.roundBlanksScreenshotsFinished.next(roundBlankSet);
    }

    getRoundBlanksScreenshotsFinished(): Observable<RoundBlankSet> {
        return this.roundBlanksScreenshotsFinished.asObservable();
    }

    setRoundBlankSetComponentRendered(roundBlankSet: RoundBlankSet) {
        this.roundBlankSetComponentRendered.next(roundBlankSet);
    }

    getRoundBlankSetComponentRendered(): Observable<RoundBlankSet> {
        return this.roundBlankSetComponentRendered.asObservable();
    }

    setImageZipped(value: boolean) {
        this.imageZipped.next(value);
    }

    getImageZipped(): Observable<boolean> {
        return this.imageZipped.asObservable();
    }

    getRbsIndex(): number {
        let gameBlankSetAsString: string = sessionStorage.getItem("roundBlankSetIndex")!;
        return JSON.parse(gameBlankSetAsString) as number;
    }

    cacheGame(game: Game) {
        sessionStorage.setItem("game", JSON.stringify(game));
    }

    getCachedGame(): Game {
        let game: string = sessionStorage.getItem("game")!;
        return JSON.parse(game) as Game;
    }

    clearCachedGame() {
        sessionStorage.removeItem("game");
    }

    clearCachedGameBlankSet() {
        sessionStorage.removeItem("gameBlankSet");
    }

    clearRoundBlankSetIndex() {
        sessionStorage.removeItem("roundBlankSetIndex");
    }
}
