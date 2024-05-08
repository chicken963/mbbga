import {Component, Input, SimpleChanges, ViewChild} from '@angular/core';
import {Round} from "../interfaces/round";
import {RoundPlaylistComponent} from "../round-playlist/round-playlist.component";
import {RoundPlayerComponent} from "../round-player/round-player.component";
import {RoundTableItem} from "../interfaces/round-table-item";

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
    if (this.roundPlayer) {
      this.roundPlayer.isPlaying = true;
    }
    if (this.roundPlayList) {
      this.nextExists = this.roundPlayList.nextItem !== undefined;
      this.previousExists = this.roundPlayList.previousItem !== undefined;
    }
  }

  play($event: RoundTableItem) {
    this.roundPlayList.play($event);
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
    this.roundPlayList.playNext();
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
}
