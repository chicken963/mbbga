import {Injectable} from "@angular/core";
import {LibraryLetter} from "../interfaces/library";
import {Observable, Subject} from "rxjs";
import {LocalAudioTrack} from "../local-audio/local-audio-track";

@Injectable({
    providedIn: 'root',
})
export class LibraryService {

    private libraryChangedEventSource = new Subject<LocalAudioTrack>();
    private inputsValiditySubject: Subject<boolean> = new Subject<boolean>();

    event$ = this.libraryChangedEventSource.asObservable();

    emitLibraryChangedEvent(event: LocalAudioTrack) {
        this.libraryChangedEventSource.next(event);
    }

    add(library: LibraryLetter[], audioTrack: LocalAudioTrack) {
        let artist = audioTrack.artist;
        let targetLetter = library.find(libraryLetter => libraryLetter.letter === artist[0]);
        if (targetLetter) {
            let targetArtist = targetLetter.artists?.find(artist => audioTrack.artist === artist.artistName);
            if (targetArtist) {
                targetArtist.audioTracks?.push(audioTrack);
                return;
            }
            targetLetter.artists?.push(
                {
                    artistName: audioTrack.artist,
                    audioTracks: [audioTrack]
                });
            return;
        }
        library.push({
            letter: audioTrack.artist[0],
            artists: [
                {
                    artistName: audioTrack.artist,
                    audioTracks: [audioTrack]
                }]
        });
    }


    audioTrackInputsAreValid(): Observable<boolean> {
        return this.inputsValiditySubject.asObservable();
    }

    setAudioTrackInputsValidity(value: boolean): void {
        return this.inputsValiditySubject.next(value);
    }
}