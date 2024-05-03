import {Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {Blank} from "../interfaces/blank/blank";
import {BlankItem} from "../interfaces/blank/blank-item";
import {StrikeCriterion} from "../interfaces/blank/strike-criterion";
import {BackgroundRectangle, BlankBackground} from "../interfaces/blank/background";
import {BackgroundService} from "../services/background.service";
import {AreaType} from "./AreaType";
import html2canvas from "html2canvas";

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

    @ViewChild("blankName")
    blankName: ElementRef;

    @ViewChild("blankNumber")
    blankNumber: ElementRef;

    @ViewChild("blankItems")
    blankItems: ElementRef;

    @Output() blankRendered: EventEmitter<any> = new EventEmitter<any>();

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

    ngAfterViewInit() {
        this.applyPosition(this.blankName, this.blankNameRectangle!);
        this.applyPosition(this.blankNumber, this.blankNumberRectangle!);
        this.applyPosition(this.blankItems, this.blankItemsRectangle!);
        this.blankRendered.emit(true);
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

    calculateHeight() {
        return `${100 / this.rowsCount}%`;
    }

    applyPosition(element: ElementRef, blankRectangle: BackgroundRectangle) {
        element.nativeElement.style.position= 'absolute';
        element.nativeElement.style.top = `${blankRectangle.startY * this.zipQuotient}px`;
        element.nativeElement.style.left = `${blankRectangle.startX * this.zipQuotient}px`;
        element.nativeElement.style.width = `${blankRectangle.width * this.zipQuotient}px`;
        element.nativeElement.style.height = `${blankRectangle.height * this.zipQuotient}px`;
        element.nativeElement.style.fontFamily = blankRectangle.font;
        element.nativeElement.style.fontSize = `${blankRectangle.fontSize * this.zipQuotient}px`;
        element.nativeElement.style.display = 'flex';
        element.nativeElement.style.alignItems = 'center';
        element.nativeElement.style.justifyContent = blankRectangle.backgroundAreaType === AreaType.ROUND_NAME ? "start" : "center";
    }
}
