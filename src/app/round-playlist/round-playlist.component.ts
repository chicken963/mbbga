import {
    Component,
    ElementRef,
    Input,
    OnDestroy,
    OnInit,
    QueryList, Renderer2, ViewChild,
    ViewChildren
} from '@angular/core';
import {AddAudioToRoundService} from "../services/add-audio-to-round.service";
import {RoundTableItem} from "../interfaces/round-table-item";
import {interval, Subscription} from "rxjs";
import {Round} from "../interfaces/round";
import {MatRow, MatTableDataSource} from "@angular/material/table";
import {DownloadRemoteAudioService} from "../services/download-remote-audio.service";
import {RoundPlayerService} from "../round-player.service";
import {ProgressService} from "../range-slider/progress.service";

@Component({
    selector: 'app-round-playlist',
    templateUrl: './round-playlist.component.html',
    styleUrls: ['./round-playlist.component.scss']
})
export class RoundPlaylistComponent implements OnInit, OnDestroy {

    dataSource: MatTableDataSource<RoundTableItem>;
    playedItem: RoundTableItem;

    @Input("round")
    round: Round;

    @ViewChildren("defaultAudio")
    defaultAudio: QueryList<ElementRef<HTMLAudioElement>>


    @ViewChildren(MatRow, { read: ElementRef }) rowElements: QueryList<ElementRef>;

    displayedColumns: string[] = ['position', 'play', 'artist', 'title', 'duration', 'remove'];
    private setAudioTracksSubscription: Subscription;
    isPlaying: boolean = false;
    trackIsLoading: boolean;
    loadPercents: number = 0;
    loadedItem: RoundTableItem | null;

    downloadSubscription: Subscription;

    private progressSubscription: Subscription;
    private updatePeriod: number = 100;
    private rowElement: any;

    constructor(private addAudioToRoundService: AddAudioToRoundService,
                private downloadService: DownloadRemoteAudioService,
                private roundPlayerService: RoundPlayerService,
                private progressService: ProgressService,
                private renderer: Renderer2) {
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

    play(item: RoundTableItem) {
        let index = this.round.audioTracks.indexOf(item);
        if (this.loadedItem) {
            this.downloadSubscription?.unsubscribe();
            this.loadedItem = null;
        }
        if (!item.url) {
            this.loadedItem = item;
            this.downloadSubscription = this.downloadService.loadAudioFromRemote(item.audioFileId).subscribe(result => {
                if (typeof result === 'number') {
                    this.loadPercents = result;
                } else if (typeof result === 'string') {
                    item.audioEl = this.defaultAudio.get(index)!.nativeElement;
                    item.audioEl.src = result;
                    item.url = `audio-tracks/binary?id=${item.audioFileId}`;
                    this.loadedItem = null;
                    this.setPlayingState(item, index);
                }
            })
            return;
        } else {
            this.setPlayingState(item, index);
        }
    }

    private setPlayingState(item: RoundTableItem, index: number) {
        this.roundPlayerService.play(item);
        this.rowElement = this.rowElements.get(index);
        this.playedItem = item;
        this.isPlaying = true;
        this.progressSubscription = interval(this.updatePeriod).subscribe(() => {
            this.updateProgress(this.updatePeriod);
        });
        this.downloadSubscription?.unsubscribe();
    }

    pause() {
        this.isPlaying = false;
        this.roundPlayerService.pause();
        this.progressSubscription?.unsubscribe();
    }


    private updateProgress(period: number) {
        const currentTime = this.playedItem.audioEl?.currentTime;
        this.playedItem.progressInSeconds = currentTime - this.playedItem.startTime;
        this.setProgressPercentage(this.progressService.evaluateProgressInRound(this.playedItem));
        if (currentTime >= this.playedItem.endTime - period / 1000) {
            this.pause();
            this.setProgressPercentage(100);
        }
    }

    private setProgressPercentage(percent: number) {
        this.renderer.setStyle(
            this.rowElement.nativeElement,
            'background',
            `linear-gradient(90deg, rgba(73,156,84,1) ${percent}%, rgba(194,24,91,1) ${percent}%)`
        );
    }
}
