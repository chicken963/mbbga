import {Component, Input, OnChanges, SimpleChanges} from '@angular/core';
import {LibraryLetter} from "../interfaces/library";
import {NotificationService} from "../utils/notification.service";
import {HttpClient} from "@angular/common/http";

@Component({
  selector: 'app-library-content',
  templateUrl: './library-content.component.html',
  styleUrls: ['./library-content.component.css']
})
export class LibraryContentComponent implements OnChanges {

  constructor(private notificationService: NotificationService, private http: HttpClient) {
  }
  private latinRegex = /^[a-zA-Z]$/;
  private cyrillicRegex = /^[а-яА-Я]$/;
  artistsAreLoading: boolean = false;

  @Input("content")
  content: LibraryLetter[];

  slavicContent: LibraryLetter[];
  latinContent: LibraryLetter[];
  otherContent: LibraryLetter[];

  contentGroups: Map<GroupLabel, LibraryLetter[]> = new Map<GroupLabel, LibraryLetter[]>();

  ngOnChanges(changes: SimpleChanges): void {
    this.slavicContent = this.content?.filter(libraryLetter => this.cyrillicRegex.test(libraryLetter.letter));
    this.latinContent = this.content?.filter(libraryLetter => this.latinRegex.test(libraryLetter.letter));
    this.otherContent = this.content?.filter(libraryLetter =>
        !this.latinRegex.test(libraryLetter.letter) && !this.cyrillicRegex.test(libraryLetter.letter)
    );
    if (this.content) {
      this.contentGroups.set(new GroupLabel("A-Z"), this.latinContent);
      this.contentGroups.set(new GroupLabel("А-Я"), this.slavicContent);
      this.contentGroups.set(new GroupLabel("0-9!@#$%^&*():\"?<>|\\,."), this.otherContent);
    }
  }

  loadLetterArtists(letter: LibraryLetter) {
    if (!letter.artists || letter.artists.length === 0) {
      this.artistsAreLoading = true;
      this.http.get(`/library/letters?value=${letter.letter}`)
          .subscribe(result  => {
            letter.artists = (result as string[]).map(artist => ({artistName: artist, audioTracks: []}));
            this.artistsAreLoading = false;
          })
    }

  }
}

class GroupLabel {
  label: string;

  constructor(label: string) {
    this.label = label;
  }
}
