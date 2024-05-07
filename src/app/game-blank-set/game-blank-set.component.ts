import {Component, QueryList, ViewChild, ViewChildren} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {GameBlankSet} from "../interfaces/blank/game-blank-set";
import {Location} from "@angular/common";
import {BackgroundService} from "../services/background.service";
import * as JSZip from "jszip";
import {MatTabChangeEvent, MatTabGroup} from "@angular/material/tabs";
import {RoundBlankSetComponent} from "../round-blank-set/round-blank-set.component";

@Component({
    selector: 'app-game-blank-set',
    templateUrl: './game-blank-set.component.html',
    styleUrls: ['./game-blank-set.component.scss', './../common-styles/tabs.scss', './../common-styles/overlay.scss']
})
export class GameBlankSetComponent {

    blankSet: GameBlankSet;
    blankSetId: string;
    archiveLoadInProgress: boolean = false;
    zip: JSZip;
    loadPercents: number = 0;
    imagesZipped: number = 0;

    @ViewChild(MatTabGroup) tabGroup: MatTabGroup;

    @ViewChildren(RoundBlankSetComponent) roundBlankSetComponents: QueryList<RoundBlankSetComponent>;

    constructor(private route: ActivatedRoute,
                private location: Location,
                private backgroundService: BackgroundService) {
        this.blankSetId = this.route.snapshot.params["blankSetId"];
        this.blankSet = this.backgroundService.getCachedCurrentGameSet()!;
    }

    backToBlankSetList() {
        this.location.back();
    }

    saveAllBlanks() {
        let currentTabIndex = 0;
        this.archiveLoadInProgress = true;
        this.loadPercents = 0;
        let totalImagesNumber = this.blankSet.roundBlankSets[0].blanks.length * this.blankSet.roundBlankSets.length;
        let imageZipSubscription = this.backgroundService.getImageZipped().subscribe(value => {
            this.imagesZipped++;
            this.loadPercents = Math.round((100 * this.imagesZipped) / totalImagesNumber);
            if (this.imagesZipped === totalImagesNumber) {
                this.archiveLoadInProgress = false;
                imageZipSubscription.unsubscribe();
            }
        });
        this.tabGroup.selectedIndex = currentTabIndex;
        this.roundBlankSetComponents.get(currentTabIndex)?.saveAllBlanks();
        let subscription = this.backgroundService.getRoundBlanksScreenshotsFinished().subscribe(roundBlankSet => {
            if (currentTabIndex < this.blankSet.roundBlankSets.length - 1) {
                currentTabIndex++;
                this.tabGroup.selectedIndex = currentTabIndex;
                let renderSubscription = this.backgroundService.getRoundBlankSetComponentRendered().subscribe(rbs => {
                    this.roundBlankSetComponents.get(currentTabIndex)?.saveAllBlanks();
                    renderSubscription.unsubscribe();
                });
            } else {
                subscription.unsubscribe();
            }
        });
    }

    onTabChanged($event: MatTabChangeEvent) {
        setTimeout(() => this.backgroundService.setRoundBlankSetComponentRendered(this.blankSet.roundBlankSets[$event.tab.origin!]), 1000);
    }
}
