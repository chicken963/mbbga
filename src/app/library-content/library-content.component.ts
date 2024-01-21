import {Component, EventEmitter, Input, OnChanges, Output, SimpleChanges} from '@angular/core';
import {Artist, LibraryLetter} from "../interfaces/library";
import {NotificationService} from "../utils/notification.service";
import {HttpClient} from "@angular/common/http";
import {RoundTableItem} from "../interfaces/round-table-item";
import {Round} from "../interfaces/round";
import {LibraryService} from "./library.service";
import {AudioTrack} from "../interfaces/audio-track";

@Component({
    selector: 'app-library-content',
    templateUrl: './library-content.component.html',
    styleUrls: ['./library-content.component.css',
        '../common-styles/scrollbar.css']
})
export class LibraryContentComponent implements OnChanges {

    constructor(private notificationService: NotificationService, private http: HttpClient,
                private libraryService: LibraryService) {
        this.libraryService.addedToLibraryTrackList$.subscribe((audioTrack: AudioTrack) => {
            this.addNewStateToLibrary(audioTrack);
        });
        this.libraryService.artistModified$.subscribe(states => this.moveToNewArtist(states))
    }

    private latinRegex = /^[a-zA-Z]$/;
    private cyrillicRegex = /^[а-яА-Я]$/;
    artistsAreLoading: boolean = false;

    @Input("content")
    content: LibraryLetter[];

    @Input("round")
    round: Round;

    @Input("expanded")
    expanded: boolean;

    @Input("searchQuery")
    searchQuery: string;

    @Output()
    versionSelected: EventEmitter<RoundTableItem> = new EventEmitter<RoundTableItem>();

    slavicContent: LibraryLetter[];
    latinContent: LibraryLetter[];
    otherContent: LibraryLetter[];

    private latinGroupLabel = new GroupLabel("A-Z");
    private slavicGroupLabel = new GroupLabel("А-Я");
    private otherGroupLabel = new GroupLabel("0-9!@#$%^&*():\"?<>|\\,.");

    contentGroups: Map<GroupLabel, LibraryLetter[]> = new Map<GroupLabel, LibraryLetter[]>();

    ngOnChanges(changes: SimpleChanges): void {
        this.slavicContent = this.content?.filter(libraryLetter => this.cyrillicRegex.test(libraryLetter.letter));
        this.latinContent = this.content?.filter(libraryLetter => this.latinRegex.test(libraryLetter.letter));
        this.otherContent = this.content?.filter(libraryLetter =>
            !this.latinRegex.test(libraryLetter.letter) && !this.cyrillicRegex.test(libraryLetter.letter)
        );
        if (this.content) {
            this.contentGroups.set(this.latinGroupLabel, this.latinContent);
            this.contentGroups.set(this.slavicGroupLabel, this.slavicContent);
            this.contentGroups.set(this.otherGroupLabel, this.otherContent);
        }
    }

    loadLetterArtists(letter: LibraryLetter) {
        if (!letter.artists || letter.artists.length === 0) {
            this.artistsAreLoading = true;
            this.http.get(`/library/letters?value=${letter.letter}`)
                .subscribe(result => {
                    letter.artists = (result as any[]).map(dto => ({
                        id: dto.id,
                        artistName: dto.artist,
                        audioTracks: []
                    }));
                    this.artistsAreLoading = false;
                })
        }

    }

    onVersionSelected(version: RoundTableItem) {
        this.versionSelected.emit(version);
    }

    private moveToNewArtist(states: any) {
        let oldState = states.old;
        let newState = states.new as AudioTrack;
        if (oldState.artist !== newState.artist) {
            this.removeOldStateFromLibrary(oldState);
            this.addNewStateToLibrary(newState);
        } else {
            let oldLetter = oldState.artist[0];
            let contentGroup = this.findContentGroupByLetter(oldLetter);
            let oldLetterLibrary = contentGroup.find(libraryLetter => libraryLetter.letter === oldLetter)!;
            let oldArtistLibrary = oldLetterLibrary.artists?.find(artist => artist.artistName === oldState.artist)!;
            oldArtistLibrary.audioTracks?.sort((a, b) => a.name.localeCompare(b.name));
        }
    }

    private addNewStateToLibrary(newState: AudioTrack) {
        let newLetter = newState.artist[0];
        let contentGroup = this.findContentGroupByLetter(newLetter);
        let newLetterLibrary = contentGroup.find(libraryLetter => libraryLetter.letter === newLetter);
        if (!newLetterLibrary) {
            newLetterLibrary = {letter: newLetter, artists: []};
            contentGroup.push(newLetterLibrary);
            contentGroup.sort((a, b) => a.letter.localeCompare(b.letter));
        }
        let newArtistLibrary = newLetterLibrary.artists!.find(artist => artist.artistName === newState.artist);
        if (!newArtistLibrary) {
            this.http.get<any>(`/artists?name=${newState.artist}`).subscribe(artist => {
                newArtistLibrary = {
                    id: artist.id,
                    artistName: artist.artist,
                    audioTracks: [newState]
                };
                newLetterLibrary!.artists!.push(newArtistLibrary);
                newLetterLibrary!.artists?.sort((a, b) => a.artistName.localeCompare(b.artistName));
            });
        } else {
            newArtistLibrary.audioTracks?.push(newState);
            newArtistLibrary.audioTracks?.sort((a, b) => a.name.localeCompare(b.name));
        }
    }

    removeOldStateFromLibrary(oldState: any) {
        let oldLetter = oldState.artist[0];
        let contentGroup = this.findContentGroupByLetter(oldLetter);
        let oldLetterLibrary = contentGroup.find(libraryLetter => libraryLetter.letter === oldLetter)!;
        let oldArtistLibrary = oldLetterLibrary.artists?.find(artist => artist.artistName === oldState.artist)!;
        let oldAudioTrack = oldArtistLibrary.audioTracks?.find(audioTrack => audioTrack.name === oldState.name);
        if (oldAudioTrack) {
            let index = oldArtistLibrary.audioTracks!.indexOf(oldAudioTrack);
            if (index !== -1) {
                oldArtistLibrary.audioTracks!.splice(index, 1);
            }

            if (oldArtistLibrary.audioTracks!.length === 0) {
                this.http.delete(`/artists?name=${oldState.artist}`, { responseType: 'text' }).subscribe(() => {
                    let artistInLibrary = oldLetterLibrary.artists?.find(artist => artist.artistName === oldState.artist)!;
                    const artistIndex = oldLetterLibrary.artists!.indexOf(artistInLibrary);
                    if (artistIndex !== -1) {
                        oldLetterLibrary.artists?.splice(artistIndex, 1);
                    }
                    if (oldLetterLibrary.artists?.length === 0) {
                        let contentGroup = this.findContentGroupByLetter(oldLetterLibrary.letter);
                        let letterIndex = contentGroup.indexOf(oldLetterLibrary);
                        if (letterIndex !== -1) {
                            contentGroup.splice(letterIndex, 1);
                        }

                        let globalContentIndex = this.content.indexOf(oldLetterLibrary);
                        if (globalContentIndex !== -1) {
                            this.content.splice(globalContentIndex, 1);
                        }
                    }
                })
            }
        }
        return contentGroup;
    }

    private findContentGroupByLetter(letter: string): LibraryLetter[] {
        if (this.latinRegex.test(letter)) {
            return this.latinContent;
        } else if (this.cyrillicRegex.test(letter)) {
            return this.slavicContent;
        } else {
            return this.otherContent;
        }
    }
}

class GroupLabel {
    label: string;

    constructor(label: string) {
        this.label = label;
    }
}
