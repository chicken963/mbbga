import {Component, Input, SimpleChanges, ViewChild} from '@angular/core';
import {Round} from "../interfaces/round";
import {RoundPlaylistComponent} from "../round-playlist/round-playlist.component";
import {RoundPlayerComponent} from "../round-player/round-player.component";
import {RoundTableItem} from "../interfaces/round-table-item";
import {SwitchPlayMode} from "../enums/enums";

@Component({
  selector: 'app-round-player-with-playlist',
  templateUrl: './round-player-with-playlist.component.html',
  styleUrls: ['./round-player-with-playlist.component.css']
})
export class RoundPlayerWithPlaylistComponent {

  @Input("round")
  round: Round;

  @Input("mode")
  mode: "create" | "play";

  @ViewChild(RoundPlaylistComponent)
  roundPlayList: RoundPlaylistComponent;

  @ViewChild(RoundPlayerComponent)
  roundPlayer: RoundPlayerComponent

  nextExists: boolean;
  previousExists: boolean = false;

  playedItem: RoundTableItem | null;

  ngOnChanges(changes: SimpleChanges) {
    if (changes.round) {
      this.nextExists = this.round.audioTracks.length > 1;
      if (this.roundPlayer) {
        this.roundPlayer.nextExists = this.round.audioTracks.length > 1;
      }
    }
  }

  refreshTable() {
    this.roundPlayList.refresh();
  }

  onPlayedItemChanged($event: RoundTableItem | null) {
    this.playedItem = $event;
    if (this.playedItem && !this.playedItem.progressInSeconds) {
        this.playedItem.progressInSeconds = 0;
    }
    if (this.roundPlayList) {
      this.nextExists = this.roundPlayList.nextItem !== undefined;
      this.previousExists = this.roundPlayList.previousItem !== undefined;
    }
  }

  play($event: RoundTableItem) {
    this.roundPlayList.play($event, false, SwitchPlayMode.FROM_PLAY_BUTTON);
    this.nextExists = this.roundPlayList?.nextItem !== undefined;
    this.previousExists = this.roundPlayList?.previousItem !== undefined;
  }

  pause($event: RoundTableItem) {
    this.roundPlayList._pause()
  }

  stop($event: RoundTableItem) {
    this.roundPlayList.stop()
  }

  onPauseClicked() {
    this.roundPlayer.isPlaying = false;
  }

  onPlayNext() {
    this.roundPlayList.playNext(SwitchPlayMode.FROM_NEXT_BUTTON);
  }

  onPlayPrevious() {
    this.roundPlayList.playPrevious();
  }

  onPreviousItemChanged($event: RoundTableItem | undefined) {
    this.previousExists = !!$event;
  }

  onNextItemChanged($event: RoundTableItem | undefined) {
    this.nextExists = !!$event;
  }

  onPlayStatusChange($event: boolean) {
    if (this.roundPlayer) {
      this.roundPlayer.isPlaying = $event;
    }
  }
}
