import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Artist} from "../interfaces/library";
import {AudioTrack} from "../interfaces/audio-track";
import {HttpClient} from "@angular/common/http";
import {DialogService} from "../utils/dialog.service";
import {NotificationService} from "../utils/notification.service";

@Component({
    selector: 'app-library-artist',
    templateUrl: './library-artist.component.html',
    styleUrls: ['./library-artist.component.css']
})
export class LibraryArtistComponent {

    @Input("artist")
    artist: Artist;

    @Output() onArtistDelete = new EventEmitter<Artist>();

    tracksAreLoading: boolean = false;

    constructor(private dialogServide: DialogService,
                private http: HttpClient,
                private notificationService: NotificationService) {
    }

  loadArtistTracks(artist: Artist) {
        if (!artist.audioTracks || artist.audioTracks.length === 0) {
            this.tracksAreLoading = true;
            this.http.get(`/library/artists?value=${artist.artistName}`)
                .subscribe(result => {
                    artist.audioTracks = result as AudioTrack[];
                    artist.audioTracks.forEach(audioTrack => audioTrack.mode = "view")
                    this.tracksAreLoading = false;
                })
        }
    }

    deleteFromLibrary(audioTrack: AudioTrack) {
      this.http.delete(`/audio-tracks?id=${audioTrack.id}`).subscribe((response) => {
        const index = this.artist.audioTracks?.indexOf(audioTrack, 0);
        if (index || index === 0) {
            this.artist.audioTracks?.splice(index, 1);
            this.notificationService.pushNotification(
                `Audio track ${audioTrack.artist} - ${audioTrack.name} was successfully deleted from library`,
                "success");
            if (this.artist.audioTracks?.length === 0) {
                this.onArtistDelete.emit(this.artist);
            }
        }
      }, (error) => {
          this.dialogServide.showOkPopup("Error", "Failed to delete audio track from library.")
      })

    }
}
