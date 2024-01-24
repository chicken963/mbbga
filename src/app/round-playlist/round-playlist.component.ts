import {
    Component,
    ElementRef, EventEmitter,
    Input,
    OnDestroy,
    OnInit, Output,
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
    playedItem: RoundTableItem | null;
    nextItem?: RoundTableItem;
    itemsHistory: RoundTableItem[] = [];

    @Input("round")
    round: Round;

    @Input("preload-by-default")
    preloadByDefault: boolean = false;

    @ViewChildren("defaultAudio")
    defaultAudio: QueryList<ElementRef<HTMLAudioElement>>


    @ViewChildren(MatRow, {read: ElementRef}) rowElements: QueryList<ElementRef>;
    @Output() playedItemChanged = new EventEmitter<RoundTableItem | null>();
    @Output() pause = new EventEmitter<RoundTableItem>();
    @Output() nextTrackDownload = new EventEmitter<boolean>();

    displayedColumns: string[] = ['position', 'play', 'artist', 'title', 'duration', 'remove'];
    private setAudioTracksSubscription: Subscription;
    isPlaying: boolean = false;
    trackIsLoading: boolean;
    loadPercents: number = 0;
    loadedItem: RoundTableItem | null;

    downloadSubscription: Subscription;
    nextFileDownloadSubscription: Subscription;

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
        this.roundPlayerService.getPreviousItem().subscribe(item => this.playPrevious());
        this.roundPlayerService.getNextItem().subscribe(item => this.playNext());
        if (this.round.audioTracks.length > 0) {
            this.playedItem = this.dataSource.data[0];
            if (this.preloadByDefault) {
                this.loadedItem = this.playedItem;
                this.downloadSubscription = this.downloadAudioFileForItem(this.playedItem, () => {
                    this.loadedItem = null
                });
            }

            this.playedItemChanged.emit(this.playedItem);
            this.playedItem.progressInSeconds = 0;

            if (this.round.audioTracks.length > 1) {
                this.nextItem = this.dataSource.data[1];
                if (this.preloadByDefault) {
                    this.nextFileDownloadSubscription = this.downloadAudioFileForItem(this.nextItem);
                }
            }
        }
        this.roundPlayerService.setNextItemExist({round: this.round, value: !!this.nextItem});
        this.roundPlayerService.setPreviousItemExist({round: this.round, value: this.itemsHistory.length > 0});
    }

    ngOnDestroy(): void {
        this.setAudioTracksSubscription?.unsubscribe();
        this.progressSubscription?.unsubscribe();
        this.downloadSubscription?.unsubscribe();
        this.nextFileDownloadSubscription?.unsubscribe();
    }


    private addToTable(item: RoundTableItem) {
        let audioTrackWithTheSameId = this.round.audioTracks.find(audiotrack => audiotrack.audioFileId === item.audioFileId);
        if (!audioTrackWithTheSameId) {
            this.round.audioTracks?.push(item);
        }
        this.refresh();
    }

    removeFromTable(item: RoundTableItem) {
        if (item === this.loadedItem) {
            this.downloadSubscription?.unsubscribe();
            this.loadedItem = null;
        }
        if (item === this.playedItem) {
            this.progressSubscription?.unsubscribe();
            this.playedItem = null;
            this.playedItemChanged.emit(this.playedItem);
        }
        let index = this.round.audioTracks.indexOf(item);
        if (index !== -1) {
            this.round.audioTracks.splice(index, 1);
        }
        this.refresh();
    }

    refresh() {
        this.dataSource.data = this.round.audioTracks;
    }

    play(item: RoundTableItem, rollback?: boolean) {
        let index = this.round.audioTracks.indexOf(item);
        if (this.loadedItem) {
            if (this.loadedItem === item) {
                while (this.loadedItem === item) {
                }
            } else {
                this.downloadSubscription?.unsubscribe();
                this.loadedItem = null;
            }
        }
        if (!item.url) {
            this.loadedItem = item;
            this.downloadSubscription?.unsubscribe();
            this.downloadSubscription = this.downloadAudioFileForItem(item, () => {
                this.loadedItem = null;
                this.setPlayingState(item, index, rollback)
            });
            return;
        } else {
            this.setPlayingState(item, index, rollback);
        }
        this.nextItem = this.dataSource.data[index + 1];
        if (this.nextItem && !this.nextItem.url) {
            this.nextTrackDownload.emit(true);
            this.nextFileDownloadSubscription?.unsubscribe();
            this.nextFileDownloadSubscription = this.downloadAudioFileForItem(this.nextItem, () => {
                this.nextTrackDownload.emit(false);
            });
        }
    }

    private setPlayingState(item: RoundTableItem, index: number, rollback?: boolean) {
        this.roundPlayerService.play(item);
        this.rowElement = this.rowElements.get(index);
        if (this.playedItem && !rollback) {
            this.itemsHistory.push(this.playedItem);
        }
        this.playedItem = item;
        this.playedItemChanged.emit(this.playedItem);
        this.isPlaying = true;
        this.progressSubscription = interval(this.updatePeriod).subscribe(() => {
            this.updateProgress(this.updatePeriod);
        });
        this.downloadSubscription?.unsubscribe();
    }

    _pause() {
        this.isPlaying = false;
        this.roundPlayerService.pause();
        this.progressSubscription?.unsubscribe();
        this.pause.emit(this.playedItem!);
    }

    stop() {
        this.roundPlayerService.stop();
    }


    private updateProgress(period: number) {
        if (this.playedItem) {
            const currentTime = this.playedItem.audioEl?.currentTime;
            this.playedItem.progressInSeconds = currentTime - this.playedItem.startTime;
            this.setProgressPercentage(this.progressService.evaluateProgressInRound(this.playedItem));
            if (currentTime >= this.playedItem.endTime - period / 1000) {
                this.setProgressPercentage(100);
                if (this.nextItem) {
                    this.playNext();
                } else {
                    this._pause();
                }
            }
        }
    }

    private setProgressPercentage(percent: number) {
        this.renderer.setStyle(
            this.rowElement.nativeElement,
            'background',
            `linear-gradient(90deg, rgba(73,156,84,0.5) ${percent}%, rgba(194,24,91,0.5) ${percent}%)`
        );
    }

    playNext() {
        this.play(this.nextItem!);
        this.roundPlayerService.setNextItemExist({round: this.round, value: !!this.nextItem});
    }

    playPrevious() {
        let previousItem: RoundTableItem = this.itemsHistory.slice(-1)[0];
        this.itemsHistory.splice(-1);
        this.play(previousItem, true);
        this.roundPlayerService.setPreviousItemExist({round: this.round, value: this.itemsHistory.length > 0});
    }

    private downloadAudioFileForItem(item: RoundTableItem, callback?: () => void): Subscription {
        let index = this.round.audioTracks.indexOf(item);
        return this.downloadService.loadAudioFromRemote(item.audioFileId).subscribe(result => {
            if (typeof result === 'number') {
                this.loadPercents = result;
            } else if (typeof result === 'string') {
                item.audioEl = this.defaultAudio.get(index)!.nativeElement;
                item.audioEl.src = result;
                item.url = `audio-tracks/binary?id=${item.audioFileId}`;
                if (callback) {
                    callback();
                }
            }
        })
    }
}
