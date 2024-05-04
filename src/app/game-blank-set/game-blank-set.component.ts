import {Component} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {GameBlankSet} from "../interfaces/blank/game-blank-set";
import {Location} from "@angular/common";
import {BackgroundService} from "../services/background.service";
import * as JSZip from "jszip";

@Component({
    selector: 'app-game-blank-set',
    templateUrl: './game-blank-set.component.html',
    styleUrls: ['./game-blank-set.component.css', './../common-styles/tabs.scss']
})
export class GameBlankSetComponent {

    blankSet: GameBlankSet;
    blankSetId: string;
    archiveLoadInProgress: boolean = false;
    zip: JSZip;
    loadPercents: number = 0;

    constructor(private route: ActivatedRoute,
                private location: Location,
                private backgroundService: BackgroundService) {
        this.blankSetId = this.route.snapshot.params["blankSetId"];
        if (this.backgroundService.getCurrentGameSet().value) {
            this.blankSet = this.backgroundService.getCurrentGameSet().value!;
        } else if (sessionStorage.getItem("gameBlankSet") != null) {
            let gameBlankSetAsString: string = sessionStorage.getItem("gameBlankSet")!;
            this.blankSet = JSON.parse(gameBlankSetAsString) as GameBlankSet;
        }
    }

    backToBlankSetList() {
        this.location.back();
    }
}
