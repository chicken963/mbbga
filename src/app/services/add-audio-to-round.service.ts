import {Injectable} from '@angular/core';
import {Observable, Subject} from "rxjs";
import {RoundTableItem} from "../interfaces/round-table-item";

@Injectable({
    providedIn: 'root'
})
export class AddAudioToRoundService {

    private setAudioListToRound$: Subject<RoundTableItem[]> = new Subject<RoundTableItem[]>();
    private addAudioToRound$: Subject<RoundTableItem> = new Subject<RoundTableItem>();
    private removeAudioFromRound$: Subject<RoundTableItem> = new Subject<RoundTableItem>();

    constructor() {
    }

    addAudioToRound(item: RoundTableItem) {
        this.addAudioToRound$.next(item);
    }

    getAudioTrackToAddToTable(): Observable<RoundTableItem> {
        return this.addAudioToRound$.asObservable();
    }

    removeAudioFromRound(item: RoundTableItem) {
        this.removeAudioFromRound$.next(item);
    }

    getAudioTrackToRemoveFromTable(): Observable<RoundTableItem> {
        return this.removeAudioFromRound$.asObservable();
    }

    setAudioTracks(audioTracksInitialSnapshot: RoundTableItem[]) {
        this.setAudioListToRound$.next(audioTracksInitialSnapshot);
    }

    getAudioTracks(): Observable<RoundTableItem[]> {
        return this.setAudioListToRound$.asObservable();
    }
}
