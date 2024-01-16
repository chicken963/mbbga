import {Component, EventEmitter, Inject, Input, OnInit, Optional, Output, ViewChild} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Artist, LibraryLetter} from "../interfaces/library";
import {LibraryService} from "../library-content/library.service";
import {AudioTrack} from "../interfaces/audio-track";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {debounceTime, Subject, takeUntil} from "rxjs";
import {LibraryContentComponent} from "../library-content/library-content.component";
import {MAT_DIALOG_DATA} from "@angular/material/dialog";
import {RoundTableItem} from "../interfaces/round-table-item";
import {Round} from "../interfaces/round";

@Component({
    selector: 'app-library',
    templateUrl: './library.component.html',
    styleUrls: ['./library.component.scss']
})
export class LibraryComponent implements OnInit {

    content: LibraryLetter[];
    notFilteredContent: LibraryLetter[];
    filterForm: FormGroup;

    searchQuery: string = '';

    @ViewChild("libraryContent")
    libraryContent: LibraryContentComponent;

    @Input("round")
    round: Round;

    @Output()
    versionSelected: EventEmitter<RoundTableItem> = new EventEmitter<RoundTableItem>();

    private filterChanged = new Subject<string>();
    private ngUnsubscribe = new Subject<void>();
    expanded: boolean = false;

    constructor(private http: HttpClient,
                private libraryService: LibraryService,
                private fb: FormBuilder) {
        this.loadContent();
        this.libraryService.addedToLibraryTrackList$.subscribe((audioTrack: AudioTrack) => {
            this.libraryService.add(this.content, audioTrack);
        });
    }

    loadContent() {
        this.http.get("/library/all")
            .subscribe(response => {
                    let letters = response as string[];
                    letters.sort((a, b) => a.localeCompare(b));
                    this.content = letters.map(l => ({letter: l, artists: []}));
                    this.notFilteredContent = this.content;
                },
                error => {
                    console.error("Error fetching library: ", error);
                });
    }

    ngOnInit(): void {
        this.filterForm = this.fb.group({
            filterLibrary: ['', [Validators.minLength(3)]]
        });

        this.filterForm.get('filterLibrary')?.valueChanges
            .pipe(
                debounceTime(1000),
                takeUntil(this.ngUnsubscribe)
            )
            .subscribe(filterValue => {
                this.filterChanged.next(filterValue);
            });
        this.filterChanged.pipe(takeUntil(this.ngUnsubscribe)).subscribe(filterValue => {
            this.getFilteredAudioTracks(filterValue);
        });
    }

    getFilteredAudioTracks(filterValue: string) {
        if (filterValue.length < 3) {
            this.content = this.notFilteredContent;
            this.expanded = false;
            this.searchQuery = '';
        } else {
            this.http.get(`/library?filter=${filterValue}`).subscribe(response => {
                this.content = response as LibraryLetter[];

                this.flatten(this.content).forEach(audioTrack => audioTrack.mode = "view");
                this.expanded = true;
                this.searchQuery = filterValue;
            });
        }
    }

    ngOnDestroy() {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }

    get f() {
        return this.filterForm.controls;
    }

    private flatten(content: LibraryLetter[]): AudioTrack[] {
        let flattenedAudioTracks: AudioTrack[] = [];
        content.forEach(libraryLetter => libraryLetter.artists?.forEach((artist: Artist) =>
            artist.audioTracks?.forEach(audioTrack => flattenedAudioTracks.push(audioTrack))));
        return flattenedAudioTracks;
    }

    onVersionSelected(version: RoundTableItem) {
        this.versionSelected.emit(version);
    }
}
