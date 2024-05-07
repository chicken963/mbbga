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
  audioTracksTable: RoundPlaylistComponent;

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
    this.audioTracksTable.refresh();
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
