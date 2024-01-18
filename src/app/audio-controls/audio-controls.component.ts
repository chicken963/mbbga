import {
    AfterViewInit,
    ChangeDetectorRef,
    Component,
    ElementRef,
    EventEmitter,
    Input,
    OnInit,
    Output,
    ViewChild,
    ViewChildren
} from '@angular/core';
import {AudioTrack} from "../interfaces/audio-track";
import {AudiotrackVersionControlsComponent} from "../audiotrack-version-controls/audiotrack-version-controls.component";
import {RoundTableItem} from "../interfaces/round-table-item";
import {Round} from "../interfaces/round";
import {FormGroup} from "@angular/forms";
import {AudiotrackModeButtonsComponent} from "../audiotrack-mode-buttons/audiotrack-mode-buttons.component";
import {BehaviorSubject, Observable} from "rxjs";
import {LibraryPlayerService} from "./library-player.service";


@Component({
    selector: 'app-audio-controls',
    templateUrl: './audio-controls.component.html',
    styleUrls: ['./audio-controls.component.scss']
})
export class AudioControlsComponent implements OnInit, AfterViewInit {

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

    @ViewChild("defaultAudio")
    private defaultAudio: ElementRef<HTMLAudioElement>;

    @Output() onDelete = new EventEmitter<AudioTrack>();
    @Output() onModeChange = new EventEmitter<string>();

    @Output()
    versionSelected: EventEmitter<RoundTableItem> = new EventEmitter<RoundTableItem>();

    @Input("audioInputs")
    audioInputs: FormGroup;
    inputsChanged: boolean = false;


    constructor(private cdr: ChangeDetectorRef, private libraryPlayerService: LibraryPlayerService) {
    }

    ngOnInit() {
        this.audioTrack.mode = this.mode;
        this.audioTrack.versions.forEach(version => version.mode = this.mode);
    }

    ngAfterViewInit(): void {
        this.audioTrack.audioEl = this.defaultAudio.nativeElement;
    }

    onVersionModeChange(mode: string, i: number) {
        this.audioTrack.mode = mode;
        this.onModeChange.emit(mode);
    }

    onFormValidityChanged(isValid: boolean) {
        this.audioTrack.inputsAreValid = isValid;
        this.inputsChanged = !!this.audioInputs?.dirty;
        this.cdr.detectChanges();
    }

    updateUrl(value: string) {
        this.audioTrack.url = value;
    }

    onVersionSelected(version: RoundTableItem) {
        this.versionControls.filter(versionControl => versionControl.audioTrackVersion.id !== version.versionId)
            .forEach(versionControl => versionControl.otherVersionSelected = true);
        this.versionSelected.emit(version);
    }

    onSelectedChange($event: boolean, i: number) {
        let version = this.audioTrack.versions[i];
        this.versionSelected.emit({
            audioFileId: this.audioTrack.id!,
            artist: this.audioTrack.artist,
            title: this.audioTrack.name,
            versionId: version.id!,
            startTime: version.startTime,
            endTime: version.endTime,
            duration: this.audioTrack.length,
            selected: $event
        });
        version.selected = $event;
        if ($event) {
            this.versionControls.filter(versionControl => versionControl.audioTrackVersion.id !== version.id)
                .forEach(versionControl => versionControl.otherVersionSelected = true);
        } else {
            this.versionControls.forEach(versionControl => versionControl.otherVersionSelected = false);
        }
    }

    saveAudioTrack() {
        this.onModeChange.emit("view")
    }

    showRevertButton($event: boolean) {
        this.modeButtonsComponent.showRevert = $event;
    }

    getProgress(): Observable<number> {
        return this.audioTrack.versions[0] === this.libraryPlayerService.activeVersion
            ? this.libraryPlayerService.getProgressInSeconds()
            : new BehaviorSubject(this.audioTrack.versions[0].progressInSeconds).asObservable();
    }
}
