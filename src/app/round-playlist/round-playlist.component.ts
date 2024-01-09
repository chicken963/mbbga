import {ChangeDetectorRef, Component, Input, OnDestroy, OnInit} from '@angular/core';
import {AddAudioToRoundService} from "../services/add-audio-to-round.service";
import {RoundTableItem} from "../interfaces/round-table-item";
import {Subscription} from "rxjs";
import {Round} from "../interfaces/round";
import {MatTableDataSource} from "@angular/material/table";

@Component({
    selector: 'app-round-playlist',
    templateUrl: './round-playlist.component.html',
    styleUrls: ['./round-playlist.component.css']
})
export class RoundPlaylistComponent implements OnInit, OnDestroy {

    dataSource: MatTableDataSource<RoundTableItem>;

    @Input("round")
    round: Round;

    displayedColumns: string[] = ['position', 'artist', 'title', 'duration', 'remove'];
    private setAudioTracksSubscription: Subscription;

    constructor(private addAudioToRoundService: AddAudioToRoundService) {
    }

    ngOnInit(): void {
        this.dataSource = new MatTableDataSource(this.round.audioTracks);
        this.setAudioTracksSubscription = this.addAudioToRoundService.getAudioTracks().subscribe(
            itemList => {
                this.round.audioTracks.forEach(item => this.removeFromTable(item));
                itemList.forEach(item => this.addToTable(item));
            }
        )
    }

    ngOnDestroy(): void {
        this.setAudioTracksSubscription?.unsubscribe();
    }


    private addToTable(item: RoundTableItem) {
        let audioTrackWithTheSameId = this.round.audioTracks.find(audiotrack => audiotrack.audioFileId === item.audioFileId);
        if (!audioTrackWithTheSameId) {
            this.round.audioTracks?.push(item);
        }
        this.refresh();
    }

    removeFromTable(item: RoundTableItem) {
        let index = this.round.audioTracks.indexOf(item);
        if (index !== -1) {
            this.round.audioTracks.splice(index, 1);
        }
        this.refresh();
    }

    refresh() {
        this.dataSource.data = this.round.audioTracks;
    }
}
