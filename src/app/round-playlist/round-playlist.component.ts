import {
    ChangeDetectorRef,
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
import {MatRadioButton} from "@angular/material/radio";
import {NotificationService} from "../utils/notification.service";
import {SwitchPlayMode} from "../enums/enums";

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

    playbackStarted: boolean;

    @ViewChildren("defaultAudio")
    defaultAudio: QueryList<ElementRef<HTMLAudioElement>>

    @ViewChildren(MatRadioButton, { read: ElementRef })
    radioButtons: ElementRef[];


    @ViewChildren(MatRow, {read: ElementRef}) rowElements: QueryList<ElementRef>;
    @Output() playedItemChanged = new EventEmitter<RoundTableItem | null>();
    @Output() previousItemChanged = new EventEmitter<RoundTableItem | undefined>();
    @Output() nextItemChanged = new EventEmitter<RoundTableItem | undefined>();
    @Output() pause = new EventEmitter<RoundTableItem>();
    @Output() playStatusChange = new EventEmitter<boolean>();

    displayedColumns: string[];
    private setAudioTracksSubscription: Subscription;
    isPlaying: boolean = false;
    trackIsLoading: boolean;
    loadPercents: number = 0;
    downloadedNextItem: RoundTableItem | null;

    downloadMap: Map<number, Subscription> = new Map();

    private progressSubscription: Subscription;
    private updatePeriod: number = 100;
    private rowElement: any;

    constructor(private addAudioToRoundService: AddAudioToRoundService,
                private downloadService: DownloadRemoteAudioService,
                private roundPlayerService: RoundPlayerService,
                private progressService: ProgressService,
                private changeDetectorRef: ChangeDetectorRef,
                private notificationService: NotificationService,
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
        if (this.round.audioTracks.length > 0) {
            this.nextItem = this.dataSource.data[0];

            this.nextItem.status = 'preloading';
            let downloadSubscription = this.downloadAudioFileForItem({...this.nextItem});
            this.downloadMap.set(0, downloadSubscription);
            this.nextItem.progressInSeconds = 0;
            this.playedItemChanged.emit(this.nextItem);
            this.nextItemChanged.emit(this.nextItem);
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
            this.playStatusChange.emit(false);
        }
        if (index !== -1) {
            this.round.audioTracks.splice(index, 1);
        }
        this.refresh();
    }

    refresh() {
        this.dataSource.data = this.round.audioTracks;
    }

    play(item: RoundTableItem, rollback?: boolean, switchPlayMode?: SwitchPlayMode) {
        let index = this.round.audioTracks.indexOf(item);
        let neighborItem: RoundTableItem | undefined;
        if (switchPlayMode === SwitchPlayMode.FROM_PREVIOUS_BUTTON) {
            let previousItemIndex = this.itemsIndexesHistory[this.itemsIndexesHistory.length - 1];
            this.previousItem = this.dataSource.data[previousItemIndex];
        }
        this.previousItemChanged.next(this.previousItem);
        if (!this.playbackStarted) {
            this.playedItem = this.nextItem!;
        }
        if (switchPlayMode === SwitchPlayMode.ON_SNIPPET_END && this.downloadedNextItem && this.downloadedNextItem !== this.nextItem) {
            this.notificationService.pushNotification(`${this.downloadedNextItem.artist} - ${this.downloadedNextItem.artist} was not downloaded during pre-loading phase. It will take some time to finish download. Please consider the opportunity to change next track.`)
            let downloadedItemIndex = this.dataSource.data.indexOf(this.downloadedNextItem);
            this.itemsIndexesHistory.push(downloadedItemIndex);
            this.nextItem = this.downloadedNextItem;

        } else {
            this.nextItem = this.findNextItemInTable(index, switchPlayMode);
            this.nextItemChanged.next(this.nextItem);
        }
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
        if (!this.playbackStarted) {
            this.playbackStarted = true;
        }
    }

    private findNextItemInTable(playedItemIndex: number, switchPlayMode?: SwitchPlayMode): RoundTableItem | undefined {
        if (this.nextItem && switchPlayMode === SwitchPlayMode.FROM_NEXT_BUTTON) {
            let nextItemIndex =  Math.min(...[...Array(this.dataSource.data.length).keys()]
                .filter(n => !this.itemsIndexesHistory.includes(n) && n > playedItemIndex));
            let nextItem = this.dataSource.data[nextItemIndex];
            if (nextItem) {
                return nextItem;
            }
        }
        let nextItemIndex =  Math.min(...[...Array(this.dataSource.data.length).keys()]
            .filter(n => !this.itemsIndexesHistory.includes(n) && n !== playedItemIndex));
        return nextItemIndex !== undefined ? this.dataSource.data[nextItemIndex] : undefined;
    }

    private preloadNextPlayedItem(item: RoundTableItem) {
        let index = this.dataSource.data.indexOf(item);
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

    private cancelDownloadForAll() {
        const keysToCancelDownload: number[] = Array.from(this.downloadMap.keys());
        keysToCancelDownload.forEach(indexToCancelLoad => this.cancelDownload(indexToCancelLoad));
    }

    private setPlayingState(item: RoundTableItem, index: number, rollback?: boolean) {
        this.roundPlayerService.play(item);
        this.rowElement = this.rowElements.get(index);
        if (this.playedItem && !rollback) {
            this.itemsIndexesHistory.push(index);
            this.previousItem = this.playedItem;
        }
        this.playedItem = item;
        this.playedItemChanged.emit(this.playedItem);
        this.playStatusChange.emit(true);
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
                    this.playNext(SwitchPlayMode.ON_SNIPPET_END);
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

    playNext(switchPlayMode: SwitchPlayMode) {
        this.play(this.nextItem!, false, switchPlayMode);
    }

    playPrevious() {
        this.itemsIndexesHistory.splice(-1);
        if (this.previousItem) {
            this.play(this.previousItem, true, SwitchPlayMode.FROM_PREVIOUS_BUTTON);
        }
    }

    private downloadAudioFileForItem(item: RoundTableItem, rollback?: boolean): Subscription {
        let itemWithSameId = this.dataSource.data.find(dataItem => dataItem.audioFileId === item.audioFileId)!;
        let index = this.round.audioTracks.indexOf(itemWithSameId);
        this.downloadedNextItem = itemWithSameId;
        return this.downloadService.loadAudioFromRemote(item.audioFileId).subscribe(result => {
            if (typeof result === 'number') {
                this.loadPercents = result;
            } else if (typeof result === 'string') {
                itemWithSameId.audioEl = this.defaultAudio.get(index)!.nativeElement;
                itemWithSameId.audioEl.src = result;
                itemWithSameId.url = `audio-tracks/binary?id=${item.audioFileId}`;
                if (itemWithSameId.status === 'loading') {
                    this.setPlayingState(itemWithSameId, index, rollback);
                }
                itemWithSameId.status = 'loaded';
                itemWithSameId.progressInSeconds = 0;
                this.downloadedNextItem = null;
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
        if (this.playedItem) {
            this.cancelDownloadForAllExceptCurrent(this.playedItem);
        } else {
            this.radioButtons.forEach(rb => {
                if (rb.nativeElement.classList.contains("mat-mdc-radio-checked")) {
                    this.renderer.removeClass(rb.nativeElement, 'mat-mdc-radio-checked');
                }
                this.changeDetectorRef.detectChanges();
            })
            this.cancelDownloadForAll();
        }
        this.preloadNextPlayedItem(item);
        if (!this.playbackStarted) {
            this.playedItemChanged.emit(item);
            this.nextItem = this.findNextItemInTable(this.dataSource.data.indexOf(item));
            this.nextItemChanged.next(this.nextItem);
        }
    }

    isPlayed(item: RoundTableItem) {
        let index = this.dataSource.data.indexOf(item);
        return this.mode === 'play' && this.itemsIndexesHistory.includes(index);
    }
}
