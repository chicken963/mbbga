import {Component, Input, OnChanges, SimpleChanges} from '@angular/core';
import {Artist, LibraryLetter} from "../interfaces/library";
import {NotificationService} from "../utils/notification.service";
import {HttpClient} from "@angular/common/http";

@Component({
    selector: 'app-library-content',
    templateUrl: './library-content.component.html',
    styleUrls: ['./library-content.component.css',
        '../common-styles/scrollbar.css']
})
export class LibraryContentComponent implements OnChanges {

    constructor(private notificationService: NotificationService, private http: HttpClient) {
    }

    private latinRegex = /^[a-zA-Z]$/;
    private cyrillicRegex = /^[а-яА-Я]$/;
    artistsAreLoading: boolean = false;

    @Input("content")
    content: LibraryLetter[];

    @Input("mode")
    mode: string;

    slavicContent: LibraryLetter[];
    latinContent: LibraryLetter[];
    otherContent: LibraryLetter[];

    private latinGroupLabel = new GroupLabel("A-Z");
    private slavicGroupLabel = new GroupLabel("А-Я");
    private otherGroupLabel = new GroupLabel("0-9!@#$%^&*():\"?<>|\\,.");

    contentGroups: Map<GroupLabel, LibraryLetter[]> = new Map<GroupLabel, LibraryLetter[]>();

    @Input("expanded")
    expanded: boolean;

    @Input("searchQuery")
    searchQuery: string;

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
                    letter.artists = (result as string[]).map(artist => ({artistName: artist, audioTracks: []}));
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
                    return;
                }
            })
        })
    }
}

class GroupLabel {
    label: string;

    constructor(label: string) {
        this.label = label;
    }
}
