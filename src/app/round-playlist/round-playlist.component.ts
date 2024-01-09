import {Component, Input, OnDestroy, OnInit} from '@angular/core';
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

    audioTracks: RoundTableItem[];
    dataSource: MatTableDataSource<RoundTableItem>;

    @Input("round")
    round: Round;

    displayedColumns: string[] = ['position', 'artist', 'title', 'duration', 'remove'];
    addToTableSubscription: Subscription;
    removeFromTableSubscription: Subscription;
    private setAudioTracksSubscription: Subscription;

    constructor(private addAudioToRoundService: AddAudioToRoundService) {
    }

    ngOnInit(): void {
        this.audioTracks = this.round.audioTracks;
        this.dataSource = new MatTableDataSource(this.audioTracks);
        this.addToTableSubscription = this.addAudioToRoundService
            .getAudioTrackToAddToTable()
            .subscribe(item => this.addToTable(item));
        this.removeFromTableSubscription = this.addAudioToRoundService
            .getAudioTrackToRemoveFromTable()
            .subscribe(item => this.removeFromTable(item));
        this.setAudioTracksSubscription = this.addAudioToRoundService.getAudioTracks().subscribe(
            itemList => {
                this.audioTracks.forEach(item => this.removeFromTable(item));
                itemList.forEach(item => this.addToTable(item));
            }
        )
    }

    ngOnDestroy(): void {
        this.addToTableSubscription?.unsubscribe();
        this.removeFromTableSubscription?.unsubscribe();
        this.setAudioTracksSubscription?.unsubscribe();
    }


    private addToTable(item: RoundTableItem) {
        let audioTrackWithTheSameId = this.audioTracks.find(audiotrack => audiotrack.audioFileId === item.audioFileId);
        if (!audioTrackWithTheSameId) {
            this.audioTracks?.push(item);
        }
        this.dataSource.data = this.audioTracks;
    }

    removeFromTable(item: RoundTableItem) {
        let index = this.audioTracks.indexOf(item);
        if (index !== -1) {
            let index = this.audioTracks.indexOf(item);
            this.audioTracks.splice(index, 1);
        }
        this.dataSource.data = this.audioTracks;
    }
}
