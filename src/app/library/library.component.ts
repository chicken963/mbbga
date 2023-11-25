import {Component, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {LibraryLetter} from "../interfaces/library";
import {LibraryService} from "../library-content/library.service";
import {AudioTrack} from "../interfaces/audiotrack";

@Component({
    selector: 'app-library',
    templateUrl: './library.component.html',
    styleUrls: ['./library.component.scss']
})
export class LibraryComponent implements OnInit {


    constructor(private http: HttpClient,
                private libraryService: LibraryService) {
    }

    content: LibraryLetter[];

    ngOnInit(): void {
        this.http.get("/library")
            .subscribe(response => {
                    this.content = response as LibraryLetter[];
                },
                error => {
                    console.error("Error fetching library: ", error);
                });
        this.libraryService.event$.subscribe((audioTrack: AudioTrack) => {
            this.libraryService.add(this.content, audioTrack);
        });
    }
}
