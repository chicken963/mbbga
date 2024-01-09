import {Injectable} from '@angular/core';
import {Observable, Subject} from "rxjs";
import {RoundTableItem} from "../interfaces/round-table-item";

@Injectable({
    providedIn: 'root'
})
export class AddAudioToRoundService {

    private setAudioListToRound$: Subject<RoundTableItem[]> = new Subject<RoundTableItem[]>();

    constructor() {
    }

    setAudioTracks(audioTracksInitialSnapshot: RoundTableItem[]) {
        this.setAudioListToRound$.next(audioTracksInitialSnapshot);
    }

    getAudioTracks(): Observable<RoundTableItem[]> {
        return this.setAudioListToRound$.asObservable();
    }
}
