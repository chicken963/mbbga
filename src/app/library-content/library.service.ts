import {Injectable} from "@angular/core";
import {AudioTrack} from "../interfaces/audiotrack";
import {LibraryLetter} from "../interfaces/library";
import {Subject} from "rxjs";

@Injectable({
    providedIn: 'root',
})
export class LibraryService {

    private libraryChangedEventSource = new Subject<AudioTrack>();

    event$ = this.libraryChangedEventSource.asObservable();

    emitLibraryChangedEvent(event: AudioTrack) {
        this.libraryChangedEventSource.next(event);
    }

    add(library: LibraryLetter[], audioTrack: AudioTrack) {
        let artist = audioTrack.artist;
        let targetLetter = library.find(libraryLetter => libraryLetter.letter === artist[0]);
        if (targetLetter) {
            let targetArtist = targetLetter.artists.find(artist => audioTrack.artist === artist.artistName);
            if (targetArtist) {
                targetArtist.audioTracks.push(audioTrack);
                return;
            }
            targetLetter.artists.push(
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
}