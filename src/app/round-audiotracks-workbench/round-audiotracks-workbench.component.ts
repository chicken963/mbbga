import {Component, Inject, ViewChild} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {Round} from "../interfaces/round";
import {CreateRoundCloseService} from "../services/create-round-close.service";
import {RoundTableItem} from "../interfaces/round-table-item";
import {AddAudioToRoundService} from "../services/add-audio-to-round.service";
import {RoundPlaylistComponent} from "../round-playlist/round-playlist.component";
import {DialogService} from "../utils/dialog.service";

@Component({
    selector: 'app-round-audiotracks-workbench',
    templateUrl: './round-audiotracks-workbench.component.html',
    styleUrls: ['./round-audiotracks-workbench.component.scss', './../common-styles/scrollbar.css']
})
export class RoundAudiotracksWorkbenchComponent {

    round: Round;
    private audioTracksInitialSnapshot: RoundTableItem[];

    @ViewChild(RoundPlaylistComponent)
    roundPlaylist: RoundPlaylistComponent;

    constructor(@Inject(MAT_DIALOG_DATA) public data: any,
                private createRoundCloseService: CreateRoundCloseService,
                private addAudioToRoundService: AddAudioToRoundService,
                private dialogService: DialogService,
                private dialogRef: MatDialogRef<RoundAudiotracksWorkbenchComponent>) {
        this.round = data.round;
        this.audioTracksInitialSnapshot = data.audioTracksInitialSnapshot;
    }

    openConfirmationDialog() {
        this.dialogService.openYesNoPopup("Are you sure you want to interrupt round playlist editing? All changes will be lost",
            (confirmed: boolean) => {
                if (confirmed) {
                    this.addAudioToRoundService.setAudioTracks(this.audioTracksInitialSnapshot);
                    this.createRoundCloseService.setCloseRoundPopupState(true);
                }
            })
    }

    saveRoundTracks() {
        this.createRoundCloseService.setCloseRoundPopupState(true);
        this.dialogRef.close();
    }

    onVersionSelected(item: RoundTableItem) {
        if (!item.selected) {
            let index = this.round.audioTracks.indexOf(item);
            this.round.audioTracks.splice(index, 1);
        } else {
            this.round.audioTracks.push(item)
        }
        this.roundPlaylist.refresh();
    }

}
