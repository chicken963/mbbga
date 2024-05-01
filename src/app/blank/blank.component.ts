import {Component, Input, OnInit} from '@angular/core';
import {Blank} from "../interfaces/blank/blank";
import {BlankItem} from "../interfaces/blank/blank-item";
import {StrikeCriterion} from "../interfaces/blank/strike-criterion";
import {BackgroundRectangle, BlankBackground} from "../interfaces/blank/background";
import {BackgroundService} from "../services/background.service";
import {AreaType} from "./AreaType";

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

    @Input()
    zipQuotient: number;

    blankNameRectangle?: BackgroundRectangle;
    blankNumberRectangle?: BackgroundRectangle;
    blankItemsRectangle?: BackgroundRectangle;

    constructor(private backgroundService: BackgroundService) {

    }

    ngOnInit() {
        if (!this.blankBackground) {
            this.blankBackground = this.backgroundService.defaultBackground;
        }
        this.blankNumberRectangle = this.blankBackground?.areas.find(area => area.backgroundAreaType === AreaType.BLANK_NUMBER);
        this.blankNameRectangle = this.blankBackground?.areas.find(area => area.backgroundAreaType === AreaType.ROUND_NAME);
        this.blankItemsRectangle = this.blankBackground?.areas.find(area => area.backgroundAreaType === AreaType.ITEMS_FIELD);
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

    async calculatePosition(blankRectangle: BackgroundRectangle) {
        return {
            'position': 'absolute',
            'top': `${blankRectangle.startY * this.zipQuotient}px`,
            'left': `${blankRectangle.startX * this.zipQuotient}px`,
            'width': `${blankRectangle.width * this.zipQuotient}px`,
            'height': `${blankRectangle.height * this.zipQuotient}px`
        };
    }
}
