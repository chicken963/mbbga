import {Injectable} from '@angular/core';
import {BackgroundRectangle, BlankBackground} from "../interfaces/blank/background";
import {HttpClient} from "@angular/common/http";
import {AreaType} from "../blank/AreaType";
import {BehaviorSubject, Observable, ReplaySubject, Subject} from "rxjs";
import {GameBlankSet} from "../interfaces/blank/game-blank-set";

@Injectable({
    providedIn: 'root'
})
export class BackgroundService {

    private _defaultBackground: BlankBackground;

    backgroundAdded: Subject<BlankBackground> = new Subject<BlankBackground>();
    backgroundFetched: Subject<BlankBackground|null> = new Subject<BlankBackground|null>();

    currentBlankSet: BehaviorSubject<GameBlankSet|null> = new BehaviorSubject<GameBlankSet|null>(null);

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
        this.currentBlankSet.next(gameSet);
    }

    getCurrentGameSet(): BehaviorSubject<GameBlankSet|null> {
        return this.currentBlankSet;
    }
}
