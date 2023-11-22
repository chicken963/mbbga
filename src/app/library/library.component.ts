import {Component, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {LibraryLetter} from "../interfaces/library";

@Component({
  selector: 'app-library',
  templateUrl: './library.component.html',
  styleUrls: ['./library.component.css']
})
export class LibraryComponent implements OnInit {


  constructor(private http: HttpClient) {
  }

  content: LibraryLetter[];

  ngOnInit(): void {
    setTimeout(() => this.http.get("/library")
        .subscribe(response => {
              this.content = response as LibraryLetter[];
            },
            error => {
              console.error("Error fetching library: ", error);
            }), 2000);
  }
}
