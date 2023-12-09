import {ChangeDetectorRef, Component, EventEmitter, Input, Output, ViewChild} from '@angular/core';
import {LocalAudioTrack} from "../local-audio/local-audio-track";
import {AudiotrackEditInputsComponent} from "../audiotrack-edit-inputs/audiotrack-edit-inputs.component";
/*import {animate, style, transition, trigger} from "@angular/animations";


export const slideInOut = trigger('slideInOut', [
    transition(':enter', [
        style({ height: 0, opacity: 0 }),
        animate('300ms ease-out', style({ height: '*', opacity: 1 })),
    ]),
    transition(':leave', [
        animate('300ms ease-in', style({ height: 0, opacity: 0 })),
    ]),
]);*/

@Component({
    selector: 'app-audio-controls',
    templateUrl: './audio-controls.component.html',
    styleUrls: ['./audio-controls.component.scss']
})
export class AudioControlsComponent {

    @Input("audio-track")
    audioTrack: LocalAudioTrack;

    @ViewChild("editInputs")
    editInputsComponent: AudiotrackEditInputsComponent;

    @Output() onDelete = new EventEmitter<LocalAudioTrack>();
    @Output() onModeChange = new EventEmitter<string>();

    inputsAreValid: boolean = false;

    constructor(private cdr: ChangeDetectorRef) {
    }


    delete() {
        this.onDelete.emit(this.audioTrack);
    }

    setMode(mode: string) {
        this.audioTrack.mode = mode;
        this.onModeChange.emit(mode);
    }

    onFormValidityChanged(isValid: boolean) {
        this.audioTrack.inputsAreValid = isValid;
        this.cdr.detectChanges();
    }
}
