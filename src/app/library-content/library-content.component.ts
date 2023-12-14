import {Component, Input, OnInit} from '@angular/core';
import {Artist, LibraryLetter} from "../interfaces/library";
import {NotificationService} from "../utils/notification.service";
import {HttpClient} from "@angular/common/http";
import {AudioTrack} from "../interfaces/audiotrack";
import {LocalAudioTrack} from "../local-audio/local-audio-track";

@Component({
  selector: 'app-library-content',
  templateUrl: './library-content.component.html',
  styleUrls: ['./library-content.component.css']
})
export class LibraryContentComponent{

  constructor(private notificationService: NotificationService, private http: HttpClient) {
  }
  private index: number = 0;
  private latinRegex = /^[a-zA-Z]$/;
  private cyrillicRegex = /^[а-яА-Я]$/;
  artistsAreLoading: boolean = false;
  tracksAreLoading: boolean = false;

  @Input("content")
  content: LibraryLetter[];

  slavicContent: LibraryLetter[];
  latinContent: LibraryLetter[];
  otherContent: LibraryLetter[];

  ngOnInit(): void {
/*    setInterval(() => {
      if (this.index % 2 == 0) {
        this.notificationService.pushNotification(
            `Track ${this.index++} was not added to library.`, "error", 5000);
      } else {
        this.notificationService.pushNotification(
            `Track ${this.index++} was successfully added to library.`, "success", 5000);
      }

    }, 2000)*/
  }

  ngOnChanges(): void {
    this.slavicContent = this.content?.filter(libraryLetter => this.cyrillicRegex.test(libraryLetter.letter));
    this.latinContent = this.content?.filter(libraryLetter => this.latinRegex.test(libraryLetter.letter));
    this.otherContent = this.content?.filter(libraryLetter =>
        !this.latinRegex.test(libraryLetter.letter) && !this.cyrillicRegex.test(libraryLetter.letter)
    );
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

  loadArtistTracks(artist: Artist) {
    if (!artist.audioTracks || artist.audioTracks.length === 0) {
      this.tracksAreLoading = true;
      this.http.get(`/library/artists?value=${artist.artistName}`)
          .subscribe(result  => {
            artist.audioTracks = result as LocalAudioTrack[];
            this.tracksAreLoading = false;
          })
    }
  }
}
