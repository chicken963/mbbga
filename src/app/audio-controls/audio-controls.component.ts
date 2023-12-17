import {
    AfterViewInit,
    ChangeDetectorRef,
    Component,
    ElementRef,
    EventEmitter,
    Input,
    Output,
    ViewChild
} from '@angular/core';
import {AudiotrackEditInputsComponent} from "../audiotrack-edit-inputs/audiotrack-edit-inputs.component";
import {AudioTrack} from "../interfaces/audio-track";
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
export class AudioControlsComponent implements AfterViewInit {

    @Input("audio-track")
    audioTrack: AudioTrack;

    @ViewChild("editInputs")
    editInputsComponent: AudiotrackEditInputsComponent;

    @ViewChild("defaultAudio")
    private defaultAudio: ElementRef<HTMLAudioElement>;

    @Output() onDelete = new EventEmitter<AudioTrack>();
    @Output() onModeChange = new EventEmitter<string>();


    constructor(private cdr: ChangeDetectorRef) {
    }

    ngAfterViewInit(): void {
        this.audioTrack.audioEl = this.defaultAudio.nativeElement;
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

    updateUrl(value: string) {
        this.audioTrack.url = value;
    }
}
