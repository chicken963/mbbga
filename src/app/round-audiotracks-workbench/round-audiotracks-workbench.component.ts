import {Component, Inject, ViewChild} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {Round} from "../interfaces/round";
import {CreateRoundCloseService} from "../services/create-round-close.service";
import {RoundTableItem} from "../interfaces/round-table-item";
import {AddAudioToRoundService} from "../services/add-audio-to-round.service";
import {RoundPlaylistComponent} from "../round-playlist/round-playlist.component";

@Component({
  selector: 'app-round-audiotracks-workbench',
  templateUrl: './round-audiotracks-workbench.component.html',
  styleUrls: ['./round-audiotracks-workbench.component.css']
})
export class RoundAudiotracksWorkbenchComponent {

  round: Round;
  private audioTracksInitialSnapshot: RoundTableItem[];

  @ViewChild(RoundPlaylistComponent)
  roundPlaylist: RoundPlaylistComponent;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
              private createRoundCloseService: CreateRoundCloseService,
              private addAudioToRoundService: AddAudioToRoundService,
              private dialogRef: MatDialogRef<RoundAudiotracksWorkbenchComponent>) {
    this.round = data.round;
    this.audioTracksInitialSnapshot = data.audioTracksInitialSnapshot;
  }

  openConfirmationDialog() {
    this.addAudioToRoundService.setAudioTracks(this.audioTracksInitialSnapshot);
    this.createRoundCloseService.setCloseRoundPopupState(true);
  }

  saveRoundTracks() {
    this.createRoundCloseService.setCloseRoundPopupState(true);
    this.dialogRef.close();
  }

  onVersionSelected(item: RoundTableItem) {
    if (item.mode === 'select') {
      let index = this.round.audioTracks.indexOf(item);
      this.round.audioTracks.splice(index, 1);
    } else if (item.mode === 'selected') {
      this.round.audioTracks.push(item)
    }
    this.roundPlaylist.refresh();
  }

}
