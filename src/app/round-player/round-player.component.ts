import {Component, EventEmitter, Input, Output, SimpleChanges} from '@angular/core';
import {RoundTableItem} from "../interfaces/round-table-item";

@Component({
    selector: 'app-round-player',
    templateUrl: './round-player.component.html',
    styleUrls: ['./round-player.component.css']
})
export class RoundPlayerComponent {

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

    isPlaying: boolean;

}
