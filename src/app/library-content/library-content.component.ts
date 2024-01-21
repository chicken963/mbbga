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
            this.add(audioTrack);
        });
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

    removeArtist($event: Artist) {
        Array.from(this.contentGroups.values()).forEach(contentGroup => {
            contentGroup.forEach(libraryLetter => {
                if (libraryLetter.artists?.includes($event)) {
                    const index = libraryLetter.artists?.indexOf($event, 0);
                    libraryLetter.artists?.splice(index, 1);
                    if (libraryLetter.artists?.length === 0) {
                        let letterIndex = contentGroup.indexOf(libraryLetter);
                        contentGroup.splice(letterIndex, 1);

                        let globalLetterIndex = this.content.indexOf(libraryLetter);
                        this.content.splice(globalLetterIndex, 1);
                    }
                    return;
                }
            })
        })
    }

    onVersionSelected(version: RoundTableItem) {
        this.versionSelected.emit(version);
    }

    add(audioTrack: AudioTrack) {
        let artist = audioTrack.artist;
        let targetLetter = this.content.find(libraryLetter => libraryLetter.letter === artist[0]);
        let targetArtist = targetLetter?.artists?.find(artist => audioTrack.artist === artist.artistName);
        if (!targetArtist) {
            this.http.get<Artist>(`/artists?name=${audioTrack.artist}`).subscribe(artist => {
                targetArtist = artist;
                targetArtist.audioTracks?.push(audioTrack);
                if (!targetLetter) {
                    targetLetter = {
                        letter: audioTrack.artist[0],
                        artists: [targetArtist]
                    }
                    this.content.push(targetLetter);
                    if (this.latinRegex.test(targetLetter.letter)) {
                        this.latinContent.push(targetLetter);
                        this.latinContent.sort((a, b) => a.letter.localeCompare(b.letter));
                    } else if (this.cyrillicRegex.test(targetLetter.letter)) {
                        this.slavicContent.push(targetLetter);
                        this.slavicContent.sort((a, b) => a.letter.localeCompare(b.letter));
                    } else {
                        this.otherContent.push(targetLetter);
                        this.otherContent.sort((a, b) => a.letter.localeCompare(b.letter));
                    }
                    this.content.sort((a, b) => a.letter.localeCompare(b.letter));
                }
                targetLetter.artists?.push(targetArtist);
                targetLetter.artists?.sort((a, b) => a.artistName.localeCompare(b.artistName));
            })
        } else {
            targetArtist.audioTracks?.push(audioTrack);
        }
    }
}

class GroupLabel {
    label: string;

    constructor(label: string) {
        this.label = label;
    }
}
