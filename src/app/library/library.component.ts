import {Component, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {LibraryLetter} from "../interfaces/library";
import {LibraryService} from "../library-content/library.service";
import {LocalAudioTrack} from "../local-audio/local-audio-track";

@Component({
    selector: 'app-library',
    templateUrl: './library.component.html',
    styleUrls: ['./library.component.scss']
})
export class LibraryComponent {

    content: LibraryLetter[];

    constructor(private http: HttpClient,
                private libraryService: LibraryService) {
        this.http.get("/library/all")
            .subscribe(response => {
                    let letters = response as string[];
                    this.content = letters.map(l => ({letter: l, artists: []}));
                },
                error => {
                    console.error("Error fetching library: ", error);
                });
        this.libraryService.event$.subscribe((audioTrack: LocalAudioTrack) => {
            this.libraryService.add(this.content, audioTrack);
        });
    }



}
