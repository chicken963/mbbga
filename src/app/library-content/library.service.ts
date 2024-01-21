import {Injectable} from "@angular/core";
import {Artist, LibraryLetter} from "../interfaces/library";
import {Observable, Subject} from "rxjs";
import {AudioTrack} from "../interfaces/audio-track";
import {HttpClient} from "@angular/common/http";

@Injectable({
    providedIn: 'root',
})
export class LibraryService {

    private addedToLibraryEventSource = new Subject<AudioTrack>();
    private inputsValiditySubject: Subject<boolean> = new Subject<boolean>();

    addedToLibraryTrackList$ = this.addedToLibraryEventSource.asObservable();

    constructor(private http: HttpClient) {
    }

    addToLibrary(event: AudioTrack) {
        this.addedToLibraryEventSource.next(event);
    }

    audioTrackInputsAreValid(): Observable<boolean> {
        return this.inputsValiditySubject.asObservable();
    }

    setAudioTrackInputsValidity(value: boolean): void {
        return this.inputsValiditySubject.next(value);
    }
}