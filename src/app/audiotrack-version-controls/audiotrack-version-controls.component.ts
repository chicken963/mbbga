import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {LibraryPlayerService} from "../audio-controls/library-player.service";
import {BehaviorSubject, Observable} from "rxjs";
import {RangeSliderComponent} from "../range-slider/range-slider.component";
import {ProgressService} from "../range-slider/progress.service";
import {AudioTrackVersion} from "../interfaces/audio-track-version";
import {AudioTrack} from "../interfaces/audio-track";
import {Round} from "../interfaces/round";
import {AuthService} from "../services/auth.service";

@Component({
    selector: 'app-audiotrack-version-controls',
    templateUrl: './audiotrack-version-controls.component.html',
    styleUrls: ['./audiotrack-version-controls.component.scss']
})
export class AudiotrackVersionControlsComponent implements OnInit {

    @Input("version")
    audioTrackVersion: AudioTrackVersion;

    @Input("audio-track")
    audioTrack: AudioTrack;

    @Input("round")
    round: Round;

    @Input("disableControls")
    disableControls: boolean;

    selected?: boolean;

    @Output() selectedChange: EventEmitter<boolean> = new EventEmitter<boolean>();
    @Output() onCancelChanges = new EventEmitter<any>();
    @Output() onDeleteVersion = new EventEmitter<AudioTrackVersion>();

    @ViewChild("rangeSlider")
    rangeSlider: RangeSliderComponent;

    private audioSnapshot: { artist: string, name: string, startTime: number, endTime: number };

    currentVersionIsPlaying: boolean = false;
    audioTrackId?: string;
    trackIsLoading: boolean = false;

    isOwner: boolean;
    otherVersionSelected: boolean;

    constructor(private libraryPlayerService: LibraryPlayerService,
                private progressService: ProgressService,
                private authService: AuthService) {}


    ngOnInit(): void {
        this.audioTrackId = this.audioTrack.id
        this.audioTrackVersion.progressInSeconds = 0;
        this.selected = this.getSelected();
        this.isOwner = this.audioTrackVersion.createdByCurrentUser || this.authService.isAdmin;
    }


    private getSelected() {
        if (!this.round) {
            return undefined;
        }
        return !!this.round.audioTracks.find(roundItem => roundItem.versionId === this.audioTrackVersion.id);
    }

    getProgress(): Observable<number> {
        return this.audioTrackVersion === this.libraryPlayerService.activeVersion
            ? this.libraryPlayerService.getProgressInSeconds()
            : new BehaviorSubject(this.audioTrackVersion.progressInSeconds).asObservable();
    }

    setMode(value: string) {
        if (value === 'edit') {
            this.audioSnapshot = {
                artist: this.audioTrack.artist.slice(),
                name: this.audioTrack.name.slice(),
                startTime: this.audioTrackVersion.startTime,
                endTime: this.audioTrackVersion.endTime
            };
        }
        this.audioTrack.mode = value;
    }

    cancel() {
        this.onCancelChanges.emit(this.audioSnapshot);
    }

    delete() {
        this.onDeleteVersion.emit(this.audioTrackVersion);
    }

    isSelectRelated(): boolean {
        return this.selected !== undefined;
    }

    addAudioTrackToRoundTable() {
        this.selected = true;
        this.selectedChange.emit(true);
    }

    removeAudioTrackFromRoundTable() {
        this.selected = false;
        this.selectedChange.emit(false);
    }

    saveVersion() {
        this.otherVersionSelected = !!this.audioTrack.versions.find(version => version.selected);
    }
}
