import { Component } from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {GameBlankSet} from "../interfaces/blank/game-blank-set";
import {HttpClient} from "@angular/common/http";

@Component({
  selector: 'app-game-blank-set',
  templateUrl: './game-blank-set.component.html',
  styleUrls: ['./game-blank-set.component.css', './../common-styles/tabs.scss']
})
export class GameBlankSetComponent {

  blankSet: GameBlankSet;
  blankSetId: string;

  constructor(private route: ActivatedRoute,
              private http: HttpClient) {
    this.blankSetId = this.route.snapshot.params["blankSetId"];
    this.http.get<any>(`/blanks/${this.blankSetId}`).subscribe(response => {
      this.blankSet = response;
    });
  }

}
