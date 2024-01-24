import {ChangeDetectorRef, Component, EventEmitter, Input, Output, SimpleChanges} from '@angular/core';
import {RoundPlayerService} from "../round-player.service";
import {RoundTableItem} from "../interfaces/round-table-item";
import {Round} from "../interfaces/round";

@Component({
    selector: 'app-round-playback-buttons',
    templateUrl: './round-playback-buttons.component.html',
    styleUrls: ['./round-playback-buttons.component.scss']
})
export class RoundPlaybackButtonsComponent {

    @Input("isPlaying")
    isPlaying: boolean = false;

    @Input("round-item")
    playedItem: RoundTableItem | null;

    @Input("previous-exists")
    previousExists: boolean;

    @Input("next-exists")
    nextExists: boolean;

    @Output() playPrevious: EventEmitter<any> = new EventEmitter<any>();
    @Output() playNext: EventEmitter<any> = new EventEmitter<any>();
    @Output() play: EventEmitter<RoundTableItem> = new EventEmitter<RoundTableItem>();
    @Output() stop: EventEmitter<RoundTableItem> = new EventEmitter<RoundTableItem>();
    @Output() pause: EventEmitter<RoundTableItem> = new EventEmitter<RoundTableItem>();

    constructor(private roundPlayerService: RoundPlayerService, private cdr: ChangeDetectorRef) {
    }

    ngAfterViewInit() {
        this.cdr.markForCheck();
    }


    _play() {
        if (this.playedItem) {
            this.isPlaying = true;
            this.play.emit(this.playedItem);
        }
    }

    _pause() {
        if (this.playedItem) {
            this.isPlaying = false;
            this.pause.emit(this.playedItem);
        }
    }

    _stop() {
        if (this.playedItem) {
            this.stop.emit(this.playedItem);
        }
    }

    _nextTrack() {
        this.playNext.emit(this.playedItem);
    }

    _previousTrack() {
        this.playPrevious.emit(this.playedItem);
    }
}
