import {EventEmitter, Injectable, Output} from '@angular/core';
import {RoundTableItem} from "./interfaces/round-table-item";
import {Observable, Subject} from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class RoundPlayerService {

    currentItem: RoundTableItem;
    nextItemChanged: Subject<RoundTableItem> = new Subject<RoundTableItem>();
    previousItemChanged: Subject<RoundTableItem> = new Subject<RoundTableItem>();

    nextItemExistChange: Subject<boolean> = new Subject<boolean>();
    previousItemExistChange: Subject<boolean> = new Subject<boolean>();


    play(item: RoundTableItem) {
        if (!this.currentItem) {
            this.currentItem = item;
            this.currentItem!.audioEl!.currentTime = item.startTime;
        }
        if (this.currentItem !== item) {
            this.currentItem!.audioEl!.pause();
            this.currentItem = item;
            this.currentItem!.audioEl!.currentTime = item.startTime;
        } else {
            this.resetIfPlayedToTheEnd();
        }
        this.currentItem?.audioEl.play();
    }

    pause() {
        this.currentItem.audioEl.pause();
    }

    private resetIfPlayedToTheEnd() {
        if (this.currentItem.audioEl.currentTime >= this.currentItem.endTime - 0.1) {
            this.currentItem.audioEl.currentTime = this.currentItem.startTime;
        }
    }


    stop() {
        this.pause();
        this.currentItem.audioEl.currentTime = this.currentItem.startTime;
    }

    getNextItem(): Observable<RoundTableItem> {
        return this.nextItemChanged.asObservable();
    }

    getPreviousItem(): Observable<RoundTableItem> {
        return this.previousItemChanged.asObservable();
    }

    setNextItem(item: RoundTableItem) {
        this.nextItemChanged.next(item);
    }

    setPreviousItem(item: RoundTableItem) {
        this.previousItemChanged.next(item);
    }

    getNextItemExist(): Observable<any> {
        return this.nextItemExistChange.asObservable();
    }

    getPreviousItemExist(): Observable<any> {
        return this.previousItemExistChange.asObservable();
    }

    setNextItemExist(value: any) {
        this.nextItemExistChange.next(value);
    }

    setPreviousItemExist(value: any) {
        this.previousItemExistChange.next(value);
    }
}
