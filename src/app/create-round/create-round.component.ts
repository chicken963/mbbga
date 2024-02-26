import {Component, Input, OnInit, SimpleChanges, ViewChild} from '@angular/core';
import {Round} from "../interfaces/round";
import {FormBuilder, FormGroup} from "@angular/forms";
import {MatDialog, MatDialogRef} from "@angular/material/dialog";
import {RoundAudiotracksWorkbenchComponent} from "../round-audiotracks-workbench/round-audiotracks-workbench.component";
import {CreateRoundCloseService} from "../services/create-round-close.service";
import {RoundPlaylistComponent} from "../round-playlist/round-playlist.component";
import {RoundTableItem} from "../interfaces/round-table-item";
import {RoundPlayerComponent} from "../round-player/round-player.component";

@Component({
    selector: 'app-create-round',
    templateUrl: './create-round.component.html',
    styleUrls: ['./create-round.component.scss',
        './../common-styles/scrollbar.css',
        './../common-styles/inputs.scss',
        './../common-styles/round-workbench-groups.scss']
})
export class CreateRoundComponent implements OnInit {

    @Input("round")
    round: Round;

    @ViewChild(RoundPlaylistComponent)
    audioTracksTable: RoundPlaylistComponent;

    @ViewChild(RoundPlayerComponent)
    roundPlayer: RoundPlayerComponent

    roundForm: FormGroup;

    winConditionForm: FormGroup;
    fieldSizeForm: FormGroup;

    playedItem: RoundTableItem | null;

    private workbenchPopupDialogRef: MatDialogRef<RoundAudiotracksWorkbenchComponent>;

    nextExists: boolean;
    previousExists: boolean = false;

    constructor(private fb: FormBuilder,
                private dialog: MatDialog,
                private createRoundCloseService: CreateRoundCloseService) {
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.round) {
            this.nextExists = this.round.audioTracks.length > 1;
            if (this.roundPlayer) {
                console.log("changing round player value")
                this.roundPlayer.nextExists = this.round.audioTracks.length > 1;
            }

        }
    }

    ngOnInit() {
        this.winConditionForm = this.fb.group({
            criterion: [this.round.winCriterion],
            winConditionFormItems: this.fb.array([])
        });
        this.fieldSizeForm = this.fb.group({})
        this.roundForm = this.fb.group({
            name: [this.round.name],
            fieldSizeForm: this.fieldSizeForm,
            winConditionsForm: this.winConditionForm
        });

        this.subscribeToRoundFormChanges();

        this.createRoundCloseService.getCloseRoundPopupState().subscribe(state => {
            if (state) {
                this.workbenchPopupDialogRef?.close();
                this.audioTracksTable.refresh();
            }
        })
    }


    subscribeToRoundFormChanges(): void {
        this.roundForm.get('name')?.valueChanges.subscribe(newValue => {
            this.round.name = newValue;
        });
        this.winConditionForm.get('criterion')?.valueChanges.subscribe(newValue => {
            this.round.winCriterion = newValue;
        })
    }

    openLibrary() {
        this.workbenchPopupDialogRef = this.dialog.open(RoundAudiotracksWorkbenchComponent, {
            disableClose: true,
            width: '90%',
            data: {
                round: this.round,
                audioTracksInitialSnapshot: [...this.round.audioTracks]
            }
        })
    }

    onPlayedItemChanged($event: RoundTableItem | null) {
        this.playedItem = $event;
        if (this.roundPlayer) {
            this.roundPlayer.isPlaying = true;
        }
        if (this.audioTracksTable) {
            this.nextExists = this.audioTracksTable.nextItem !== undefined;
            this.previousExists = this.audioTracksTable.itemsIndexesHistory.length > 0;
        }
    }

    play($event: RoundTableItem) {
        this.audioTracksTable.play($event)
    }

    pause($event: RoundTableItem) {
        this.audioTracksTable._pause()
    }

    stop($event: RoundTableItem) {
        this.audioTracksTable.stop()
    }

    previousTrack($event: RoundTableItem) {
        this.audioTracksTable.playNext();
    }

    nextTrack($event: RoundTableItem) {
        this.audioTracksTable.playPrevious();
    }

    onPauseClicked() {
        this.roundPlayer.isPlaying = false;
    }

    onPlayNext() {
        this.audioTracksTable.playNext();
        this.nextExists = this.audioTracksTable?.nextItem !== undefined;
    }

    onPlayPrevious() {
        this.audioTracksTable.playPrevious();
        this.previousExists = this.audioTracksTable?.itemsIndexesHistory !== undefined &&
            this.audioTracksTable?.itemsIndexesHistory.length > 0;
    }
}
