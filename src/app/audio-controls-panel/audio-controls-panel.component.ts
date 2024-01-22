import {Component, ElementRef, EventEmitter, Input, Output, ViewChild, ViewChildren} from '@angular/core';
import {AudioTrack} from "../interfaces/audio-track";
import {Round} from "../interfaces/round";
import {AudiotrackModeButtonsComponent} from "../audiotrack-mode-buttons/audiotrack-mode-buttons.component";
import {AudiotrackVersionControlsComponent} from "../audiotrack-version-controls/audiotrack-version-controls.component";
import {RoundTableItem} from "../interfaces/round-table-item";
import {BehaviorSubject, Observable} from "rxjs";
import {LibraryPlayerService} from "../audio-controls/library-player.service";

@Component({
  selector: 'app-audio-controls-panel',
  templateUrl: './audio-controls-panel.component.html',
  styleUrls: ['./audio-controls-panel.component.scss']
})
export class AudioControlsPanelComponent {
  @Input("audio-track")
  audioTrack: AudioTrack;

  @Input("searchQuery")
  searchQuery: string;

  @Input("mode")
  mode: string;

  @Input("round")
  round: Round;

  @ViewChild(AudiotrackModeButtonsComponent)
  modeButtonsComponent: AudiotrackModeButtonsComponent;

  @ViewChildren(AudiotrackVersionControlsComponent)
  versionControls: AudiotrackVersionControlsComponent[];

  @Output() onDelete = new EventEmitter<AudioTrack>();
  @Output() onModeChange = new EventEmitter<string>();

  @Output()
  versionSelected: EventEmitter<RoundTableItem> = new EventEmitter<RoundTableItem>();

  constructor(private libraryPlayerService: LibraryPlayerService) {
  }


  getProgress(): Observable<number> {
    return this.audioTrack.versions[0] === this.libraryPlayerService.activeVersion
        ? this.libraryPlayerService.getProgressInSeconds()
        : new BehaviorSubject(this.audioTrack.versions[0].progressInSeconds ? this.audioTrack.versions[0].progressInSeconds : 0).asObservable();
  }

  deleteFromLibrary($event: AudioTrack) {
    this.onDelete.emit($event);
  }

  onVersionSelected($event: RoundTableItem) {
    this.versionSelected.emit($event);
  }
}
