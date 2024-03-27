import {Component, Input, OnInit, ViewChildren} from '@angular/core';
import {RoundBlankSet} from "../interfaces/blank/round-blank-set";
import {Blank} from "../interfaces/blank/blank";
import {BlankMiniatureComponent} from "../blank-miniature/blank-miniature.component";

@Component({
    selector: 'app-round-blank-set',
    templateUrl: './round-blank-set.component.html',
    styleUrls: ['./round-blank-set.component.scss']
})
export class RoundBlankSetComponent implements OnInit {

    @Input()
    roundBlankSet: RoundBlankSet;

    @ViewChildren(BlankMiniatureComponent)
    blankMiniatures: BlankMiniatureComponent[];

    hoveredBlank: Blank | null;
    clickedBlank: Blank | null;

    ngOnInit(): void {

    }


    setCurrentBlank($event: Blank | null) {
        if (!this.clickedBlank) {
            this.hoveredBlank = $event;
        }
    }

    setClickedBlank($event: any) {
        if (this.clickedBlank === $event) {
            this.clickedBlank = null;
            return;
        }
        this.clickedBlank = $event;
    }
}
