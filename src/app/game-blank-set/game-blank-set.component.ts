import { Component } from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {GameBlankSet} from "../interfaces/blank/game-blank-set";
import {HttpClient} from "@angular/common/http";
import {Location} from "@angular/common";
import {BackgroundService} from "../services/background.service";

@Component({
  selector: 'app-game-blank-set',
  templateUrl: './game-blank-set.component.html',
  styleUrls: ['./game-blank-set.component.css', './../common-styles/tabs.scss']
})
export class GameBlankSetComponent {

  blankSet: GameBlankSet;
  blankSetId: string;

  constructor(private route: ActivatedRoute,
              private location: Location,
              private backgroundService: BackgroundService,
              private http: HttpClient) {
    this.blankSetId = this.route.snapshot.params["blankSetId"];
    this.blankSet = this.backgroundService.getCurrentGameSet().value!;

  }

  backToBlankSetList() {
    this.location.back();
  }
}
