import {
    Component,
    ElementRef,
    EventEmitter,
    Input,
    OnDestroy,
    OnInit,
    Output,
    QueryList,
    Renderer2,
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
    previousItem?: RoundTableItem;
    itemsIndexesHistory: number[] = [];

    @Input("round")
    round: Round;

    @Input("mode")
    mode: "create" | "play";

    @Input("preload-by-default")
    preloadByDefault: boolean = false;

    @ViewChildren("defaultAudio")
    defaultAudio: QueryList<ElementRef<HTMLAudioElement>>


    @ViewChildren(MatRow, {read: ElementRef}) rowElements: QueryList<ElementRef>;
    @Output() playedItemChanged = new EventEmitter<RoundTableItem | null>();
    @Output() previousItemChanged = new EventEmitter<RoundTableItem | undefined>();
    @Output() nextItemChanged = new EventEmitter<RoundTableItem | undefined>();
    @Output() pause = new EventEmitter<RoundTableItem>();

    displayedColumns: string[];
    private setAudioTracksSubscription: Subscription;
    isPlaying: boolean = false;
    trackIsLoading: boolean;
    loadPercents: number = 0;

    downloadMap: Map<number, Subscription> = new Map();

    private progressSubscription: Subscription;
    private updatePeriod: number = 100;
    private rowElement: any;

    constructor(private addAudioToRoundService: AddAudioToRoundService,
                private downloadService: DownloadRemoteAudioService,
                private roundPlayerService: RoundPlayerService,
                private progressService: ProgressService,
                private renderer: Renderer2) {
    }

    //TODO handle bug with rollback from the last track (there is a jump from -1-2 to -3-4)
    ngOnInit(): void {
        this.displayedColumns = this.mode === 'play'
            ? ['position', 'isNext', 'artist', 'title', 'duration']
            : ['position', 'play', 'artist', 'title', 'duration', 'remove'];
        this.dataSource = new MatTableDataSource(this.round.audioTracks);
        this.dataSource.data.forEach(item => item.status = 'not loaded');
        this.subscribeToDataSourceChanges();
        this.roundPlayerService.getPreviousItem().subscribe(item => this.playPrevious());
        this.roundPlayerService.getNextItem().subscribe(item => this.playNext());
        if (this.round.audioTracks.length > 0) {
            this.playedItem = this.dataSource.data[0];
            if (this.preloadByDefault) {
                this.playedItem.status = 'loading';
                let downloadSubscription = this.downloadAudioFileForItem({...this.playedItem});
                this.downloadMap.set(0, downloadSubscription);
            }

            this.playedItemChanged.emit(this.playedItem);
            this.playedItem.progressInSeconds = 0;

            if (this.round.audioTracks.length > 1) {
                this.nextItem = this.dataSource.data[1];
                this.nextItemChanged.next(this.nextItem);
                if (this.preloadByDefault) {
                    this.nextItem.status = 'preloading';
                    let nextFileDownloadSubscription = this.downloadAudioFileForItem({...this.nextItem});
                    this.downloadMap.set(1, nextFileDownloadSubscription);
                }
            }
        }
    }

    private subscribeToDataSourceChanges() {
        this.setAudioTracksSubscription = this.addAudioToRoundService.getAudioTracks().subscribe(
            itemList => {
                this.round.audioTracks.forEach(item => this.removeFromTable(item));
                itemList.forEach(item => this.addToTable(item));
            }
        )
    }

    ngOnDestroy(): void {
        this.setAudioTracksSubscription?.unsubscribe();
        this.progressSubscription?.unsubscribe();
        this.downloadMap.forEach(value => value?.unsubscribe());
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
        if (item.status === 'loading') {
            this.cancelDownload(index);
        }
        if (item.audioFileId === this.playedItem?.audioFileId) {
            this.progressSubscription?.unsubscribe();
            this.playedItem = null;
            this.playedItemChanged.emit(this.playedItem);
        }
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
        let neighborItem: RoundTableItem | undefined;
        this.previousItem = index >= 1 ? this.dataSource.data[index - 1] : undefined;
        this.previousItemChanged.next(this.previousItem);
        this.nextItem = index < this.dataSource.data.length - 1 ? this.dataSource.data[index + 1] : undefined;
        this.nextItemChanged.next(this.nextItem);
        if (rollback) {
            this.cancelDownloadForAllExceptCurrentAndPrevious(item, this.previousItem);
            neighborItem = this.previousItem;
        } else {
            this.cancelDownloadForAllExceptCurrentAndNext(item, this.nextItem);
            neighborItem = this.nextItem;
        }
        this.downloadCurrentItemIfNeededAndPlay(index, item, rollback);
        if (neighborItem) {
            this.preloadNextPlayedItem(neighborItem);
        }
    }

    private preloadNextPlayedItem(item: RoundTableItem) {
        let index = this.dataSource.data.indexOf(item);
        console.log(index)
        if (item && item.status !== 'loaded') {
            if (item.status === 'not loaded') {
                this.downloadMap.set(index, this.downloadAudioFileForItem(item));
            }
            this.dataSource.data[index].status = 'preloading';
        }
    }

    private downloadCurrentItemIfNeededAndPlay(index: number, item: RoundTableItem, rollback?: boolean) {
        if (this.itemIsCurrentlyLoaded(index)) {
            this.dataSource.data[index].status = 'loading';
        } else if (item.status === 'not loaded') {
            this.dataSource.data[index].status = 'loading';
            this.downloadMap.set(index, this.downloadAudioFileForItem(item, rollback));
        } else if (item.status === 'loaded') {
            this.setPlayingState(item, index, rollback);
        }
    }

    private itemIsCurrentlyLoaded(index: number): boolean {
        return !!this.downloadMap.get(index);
    }

    private cancelDownloadForAllExceptCurrentAndPrevious(currentItem: RoundTableItem, previousItem?: RoundTableItem) {
        this.cancelDownloadForAllExceptCurrentAndNeighbour(currentItem, previousItem);
    }

    private cancelDownloadForAllExceptCurrentAndNext(currentItem: RoundTableItem, nextItem?: RoundTableItem) {
        this.cancelDownloadForAllExceptCurrentAndNeighbour(currentItem, nextItem);
    }

    private cancelDownloadForAllExceptCurrentAndNeighbour(currentItem: RoundTableItem, neighbourItem?: RoundTableItem) {
        let toCancelDownloadCondition = (value: RoundTableItem) =>
            value.audioFileId !== currentItem.audioFileId && value.audioFileId !== neighbourItem?.audioFileId;
        const keysToCancelDownload: number[] = Array.from(this.downloadMap.keys())
            .filter(key => toCancelDownloadCondition(this.round.audioTracks[key]));
        keysToCancelDownload.forEach(indexToCancelLoad => this.cancelDownload(indexToCancelLoad));
    }

    private cancelDownloadForAllExceptCurrent(currentItem: RoundTableItem | null) {
        let toCancelDownloadCondition = (value: RoundTableItem) => currentItem === null || value.audioFileId !== currentItem.audioFileId;
        const keysToCancelDownload: number[] = Array.from(this.downloadMap.keys())
            .filter(key => toCancelDownloadCondition(this.round.audioTracks[key]));
        keysToCancelDownload.forEach(indexToCancelLoad => this.cancelDownload(indexToCancelLoad));
    }

    private setPlayingState(item: RoundTableItem, index: number, rollback?: boolean) {
        this.roundPlayerService.play(item);
        this.rowElement = this.rowElements.get(index);
        if (this.playedItem && !rollback) {
            this.itemsIndexesHistory.push(index);
        }
        this.playedItem = item;
        this.playedItemChanged.emit(this.playedItem);
        this.isPlaying = true;
        this.progressSubscription = interval(this.updatePeriod).subscribe(() => {
            this.updateProgress(this.updatePeriod);
        });
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
        if (this.playedItem?.audioEl) {
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
            `linear-gradient(90deg, rgba(244, 67, 54,0.5) ${percent}%, rgba(66,66,66,0.5) ${percent}%)`
        );
    }

    playNext() {
        this.play(this.nextItem!);
    }

    playPrevious() {
        this.itemsIndexesHistory.splice(-1);
        if (this.previousItem) {
            this.play(this.previousItem, true);
        }
    }

    private downloadAudioFileForItem(item: RoundTableItem, rollback?: boolean): Subscription {
        let index = this.round.audioTracks.indexOf(item);
        return this.downloadService.loadAudioFromRemote(item.audioFileId).subscribe(result => {
            if (typeof result === 'number') {
                this.loadPercents = result;
            } else if (typeof result === 'string') {
                item.audioEl = this.defaultAudio.get(index)!.nativeElement;
                item.audioEl.src = result;
                item.url = `audio-tracks/binary?id=${item.audioFileId}`;
                if (item.status === 'loading') {
                    this.setPlayingState(item, index, rollback);
                }
                item.status = 'loaded';
                this.downloadMap.delete(index);
            }
        })
    }

    private cancelDownload(index: number) {
        this.downloadMap.get(index)?.unsubscribe();
        this.downloadMap.delete(index);
        this.dataSource.data[index].status = 'not loaded';
    }

    onNextItemChanged(item: RoundTableItem) {
        this.cancelDownloadForAllExceptCurrent(this.playedItem);
        this.preloadNextPlayedItem(item);

    }
}
