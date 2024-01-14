import {Component, EventEmitter, Input, OnChanges, Output, SimpleChanges} from '@angular/core';
import {AudioTrack} from "../interfaces/audio-track";
import {FormBuilder, FormGroup, NgForm, Validators} from "@angular/forms";
import {LibraryService} from "../library-content/library.service";

@Component({
    selector: 'app-audiotrack-edit-inputs',
    templateUrl: './audiotrack-edit-inputs.component.html',
    styleUrls: ['./audiotrack-edit-inputs.component.scss', './../common-styles/arrow-buttons.scss']
})
export class AudiotrackEditInputsComponent implements OnChanges {

    @Input("audio-track")
    audioTrack: AudioTrack;

    audioInputs: FormGroup;

    numericArrowThreshold: number = 78;

    @Output()
    inputsValidityChanged = new EventEmitter<boolean>();

    constructor(private libraryService: LibraryService,
                private fb: FormBuilder) {
        this.audioInputs = this.fb.group({
            artist: [this.audioTrack?.artist, Validators.required],
            name: [this.audioTrack?.name, Validators.required]
        });
        this.audioInputs.get('artist')?.valueChanges.subscribe(value => {
            this.audioTrack.artist = value;
        });
        this.audioInputs.get('name')?.valueChanges.subscribe(value => {
            this.audioTrack.name = value;
        });

        this.audioInputs.valueChanges.subscribe(() => {
            this.inputsValidityChanged.emit(this.audioInputs.valid);
            this.libraryService.setAudioTrackInputsValidity(this.audioInputs.valid);
        });
    }

    ngOnChanges(changes: SimpleChanges) {
        //on version change?
        if (changes.audioTrack && changes.audioTrack.currentValue) {
            this.audioInputs.patchValue({
                artist: changes.audioTrack.currentValue.artist,
                name: changes.audioTrack.currentValue.name
            });
        }
    }

    setValue(control: string, value: string) {
        this.audioInputs.get(control)?.setValue(value);
    }

    submitArtistAndName() {

    }
}
