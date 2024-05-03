import {
    Component,
    ElementRef,
    EventEmitter,
    Input,
    NgZone,
    Output,
    Renderer2,
    SimpleChange,
    ViewChild
} from '@angular/core';
import {BackgroundRectangle} from "../interfaces/blank/background";
import {CdkDragEnd, CdkDragMove} from "@angular/cdk/drag-drop";
import {AreaType} from "../blank/AreaType";

@Component({
    selector: 'app-transformed-area',
    templateUrl: './transformed-area.component.html',
    styleUrls: ['./transformed-area.component.scss']
})
export class TransformedAreaComponent {

    @Input()
    area: BackgroundRectangle;

    @Input()
    basicStyle: any;

    @Input()
    imageWidth: number;

    @Input()
    imageHeight: number;

    @Input()
    selected: boolean;

    @Output() areaPositionChanged: EventEmitter<BackgroundRectangle> = new EventEmitter<BackgroundRectangle>();

    @ViewChild('resizeBox') resizeBox: ElementRef;
    @ViewChild('dragHandleCorner') dragHandleCorner: ElementRef;
    @ViewChild('dragHandleRight') dragHandleRight: ElementRef;
    @ViewChild('dragHandleBottom') dragHandleBottom: ElementRef;

    @ViewChild('textContainer') textContainer: ElementRef;

    constructor(private ngZone: NgZone, private renderer: Renderer2, private elementRef: ElementRef) {
    }

    ngAfterViewInit(): void {
        this.setAllHandleTransform();
        this.justifySampleTextCenter();
    }

    ngOnChanges(changes: SimpleChange) {
        console.log(changes);
    }

    get resizeBoxElement(): HTMLElement {
        return this.resizeBox.nativeElement;
    }

    get dragHandleCornerElement(): HTMLElement {
        return this.dragHandleCorner.nativeElement;
    }

    get dragHandleRightElement(): HTMLElement {
        return this.dragHandleRight.nativeElement;
    }

    get dragHandleBottomElement(): HTMLElement {
        return this.dragHandleBottom.nativeElement;
    }

    setAllHandleTransform() {
        const rect = this.resizeBoxElement.getBoundingClientRect();
        rect.width = this.resizeBoxElement.clientWidth;
        rect.height = this.resizeBoxElement.clientHeight;
        this.setHandleTransform(this.dragHandleCornerElement, rect, 'both');
        this.setHandleTransform(this.dragHandleRightElement, rect, 'x');
        this.setHandleTransform(this.dragHandleBottomElement, rect, 'y');
    }

    setHandleTransform(
        dragHandle: HTMLElement,
        targetRect: ClientRect | DOMRect,
        position: 'x' | 'y' | 'both') {
        const dragRect = dragHandle.getBoundingClientRect();
        const translateX = targetRect.width - dragRect.width;
        const translateY = targetRect.height - dragRect.height;

        if (position === 'x') {
            dragHandle.style.transform = `translate(${translateX}px, 0)`;
        }

        if (position === 'y') {
            dragHandle.style.transform = `translate(0, ${translateY}px)`;
        }

        if (position === 'both') {
            dragHandle.style.transform = `translate(${translateX}px, ${translateY}px)`;
        }
    }

    dragMove(dragHandle: HTMLElement, $event: CdkDragMove<any>) {
        this.ngZone.runOutsideAngular(() => {
            this.resize(dragHandle, this.resizeBoxElement);
        });
    }

    resize(dragHandle: HTMLElement, target: HTMLElement) {
        const dragRect = dragHandle.getBoundingClientRect();
        const targetRect = target.getBoundingClientRect();

        let width = dragRect.left - targetRect.left + dragRect.width;
        let height = dragRect.top - targetRect.top + dragRect.height;

        target.style.width = width + 'px';
        target.style.height = height + 'px';
        this.mapSizesToArea(target);
        this.setAllHandleTransform();
        this.justifySampleTextCenter();
    }

    endDragBatya(resizeBox: HTMLDivElement, $event: CdkDragEnd) {
        this.area.startX += $event.distance.x;
        this.area.startY += $event.distance.y;
        resizeBox.style.transform = "none";
        console.log(resizeBox.style.transform)
        console.log($event.distance)
        this.areaPositionChanged.emit(this.area);
    }

    private mapSizesToArea(resizeBoxElement: HTMLElement) {
        this.area.width = +resizeBoxElement.offsetWidth;
        this.area.height = +resizeBoxElement.offsetHeight;
    }

    moveSmoothly(resizeBox: HTMLDivElement, $event: CdkDragMove) {
        this.resizeBoxElement.style.transform = `translate3d(${$event.distance.x}px, ${$event.distance.y}px, 0)`
    }

    getSampleText(backgroundAreaType: AreaType): string {
        if (backgroundAreaType === AreaType.ROUND_NAME) {
            return "Round name";
        } else if (backgroundAreaType === AreaType.ITEMS_FIELD) {
            return "Some artist/song";
        }
        return "A100";
    }

    justifySampleTextCenter() {
        if (this.area.backgroundAreaType !== AreaType.ROUND_NAME) {
            const computedWidth = this.textContainer.nativeElement.offsetWidth;
            const marginLeft = (this.area.width - computedWidth) / 2;
            console.log(computedWidth);
            this.renderer.setStyle(this.textContainer.nativeElement, 'margin-left', `${marginLeft}px`);
        }
    }
}
