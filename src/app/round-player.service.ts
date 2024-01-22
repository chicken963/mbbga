import {Injectable} from '@angular/core';
import {RoundTableItem} from "./interfaces/round-table-item";

@Injectable({
    providedIn: 'root'
})
export class RoundPlayerService {

    currentItem: RoundTableItem;


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




}
