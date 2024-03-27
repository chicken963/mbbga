import {Component, Input, OnChanges, OnInit} from '@angular/core';
import {Blank} from "../interfaces/blank/blank";
import {BlankItem} from "../interfaces/blank/blank-item";
import {StrikeCriterion} from "../interfaces/blank/strike-criterion";
import {BackgroundRectangle, BlankBackground, defaultBackground} from "../interfaces/blank/background";

@Component({
    selector: 'app-blank',
    templateUrl: './blank.component.html',
    styleUrls: ['./blank.component.scss']
})
export class BlankComponent implements OnInit {

    @Input()
    blank: Blank;

    @Input()
    strikeCriterion: StrikeCriterion;

    @Input()
    columnsCount: number;

    @Input()
    rowsCount: number;

    @Input()
    roundName: string;

    @Input()
    blankBackground: BlankBackground;

    blankNameRectangle?: BackgroundRectangle;
    blankNumberRectangle?: BackgroundRectangle;
    blankItemsRectangle?: BackgroundRectangle;

    ngOnInit() {
        if (!this.blankBackground) {
            this.blankBackground = defaultBackground;
        }
        this.blankNumberRectangle = this.blankBackground?.areas.find(area => area.backgroundAreaType === "BLANK_NUMBER");
        this.blankNameRectangle = this.blankBackground?.areas.find(area => area.backgroundAreaType === "BLANK_NAME");
        this.blankItemsRectangle = this.blankBackground?.areas.find(area => area.backgroundAreaType === "BLANK_ITEMS");
    }


    getItemContent(item: BlankItem): string {
        if (this.strikeCriterion === StrikeCriterion.ARTIST) {
            return item.audioTrack.artist;
        } else if (this.strikeCriterion === StrikeCriterion.NAME) {
            return item.audioTrack.title;
        }
        throw new Error("not matching strike criterion");

    }

    calculateWidth() {
        return `${100 / this.columnsCount}%`;
    }

    calculatePosition(blankRectangle: BackgroundRectangle): Object {
        return {
            'position': 'absolute',
            'top': `${blankRectangle.startY}px`,
            'left': `${blankRectangle.startX}px`,
            'width': `${blankRectangle.width}px`,
            'height': `${blankRectangle.height}px`
        };
    }
}
