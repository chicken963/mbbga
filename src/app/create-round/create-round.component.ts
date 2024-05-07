import {Component, Input, OnInit, SimpleChanges, ViewChild} from '@angular/core';
import {Round} from "../interfaces/round";
import {FormBuilder, FormGroup} from "@angular/forms";
import {MatDialog, MatDialogRef} from "@angular/material/dialog";
import {RoundAudiotracksWorkbenchComponent} from "../round-audiotracks-workbench/round-audiotracks-workbench.component";
import {CreateRoundCloseService} from "../services/create-round-close.service";
import {RoundPlaylistComponent} from "../round-playlist/round-playlist.component";
import {RoundTableItem} from "../interfaces/round-table-item";
import {RoundPlayerComponent} from "../round-player/round-player.component";
import {RoundPlayerWithPlaylistComponent} from "../round-player-with-playlist/round-player-with-playlist.component";

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

    @ViewChild(RoundPlayerWithPlaylistComponent)
    roundPlayerWithPlaylistComponent: RoundPlayerWithPlaylistComponent;

    roundForm: FormGroup;

    winConditionForm: FormGroup;
    fieldSizeForm: FormGroup;

    private workbenchPopupDialogRef: MatDialogRef<RoundAudiotracksWorkbenchComponent>;

    constructor(private fb: FormBuilder,
                private dialog: MatDialog,
                private createRoundCloseService: CreateRoundCloseService) {
    }



    ngOnInit() {
        this.winConditionForm = this.fb.group({
            criterion: [this.round.strikeCriterion],
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
                this.roundPlayerWithPlaylistComponent.refreshTable();
            }
        })
    }


    subscribeToRoundFormChanges(): void {
        this.roundForm.get('name')?.valueChanges.subscribe(newValue => {
            this.round.name = newValue;
        });
        this.winConditionForm.get('criterion')?.valueChanges.subscribe(newValue => {
            this.round.strikeCriterion = newValue;
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
}
