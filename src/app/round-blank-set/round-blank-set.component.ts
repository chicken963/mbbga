import {
    AfterViewInit,
    Component,
    ElementRef,
    EventEmitter,
    Input,
    OnInit,
    Output, QueryList,
    Renderer2,
    ViewChild,
    ViewChildren
} from '@angular/core';
import {RoundBlankSet} from "../interfaces/blank/round-blank-set";
import {Blank} from "../interfaces/blank/blank";
import {BlankMiniatureComponent} from "../blank-miniature/blank-miniature.component";
import {BackgroundService} from "../services/background.service";
import html2canvas from "html2canvas";
import {Subject} from "rxjs";
import * as JSZip from "jszip";
import {RoundPlay} from "../interfaces/gameplay/round-play";
import {BlankStatus} from "../interfaces/gameplay/blank-status";

@Component({
    selector: 'app-round-blank-set',
    templateUrl: './round-blank-set.component.html',
    styleUrls: ['./round-blank-set.component.scss', './../common-styles/scrollbar.css']
})
export class RoundBlankSetComponent implements OnInit, AfterViewInit {

    @Input()
    roundBlankSet: RoundBlankSet;

    @Input()
    roundPlay: RoundPlay;

    @ViewChildren(BlankMiniatureComponent)
    blankMiniatures: BlankMiniatureComponent[];

    @ViewChild("blankContainer")
    blankContainer: ElementRef;

    @ViewChild("scrollableContainer")
    scrollableContainer: ElementRef;

    @ViewChild('canvas') canvas: ElementRef<HTMLCanvasElement>;
    @ViewChild('downloadLink', { static: true }) downloadLink: ElementRef<HTMLAnchorElement>;

    blankRendered: Subject<number> = new Subject<number>();

    hoveredBlank: Blank | null;
    clickedBlank: Blank | null;

    imageHeight: number;
    imageWidth: number;
    previewHeight: number = 565;
    imageUrl: string;
    currentBlankIndex: number = 0;
    archiveLoadInProgress: boolean = false;
    zip: JSZip;
    loadPercents: number = 0;

    constructor(private backgroundService: BackgroundService,
                private renderer: Renderer2) {


    }


    ngOnInit(): void {
        this.getImageDimensions(this.roundBlankSet.blankBackground.image as string).then(({width, height}) => {
            this.imageWidth = width;
            this.imageHeight = height;
            this.scrollableContainer.nativeElement.style.minWidth = `${width * this.previewHeight / height + 16}px`
            this.blankContainer.nativeElement.style.aspectRatio = width / height;
        });
        this.imageUrl = this.roundBlankSet.blankBackground.image as string;
    }

    ngAfterViewInit(): void {
        this.blankMiniatures.forEach((blankMiniature: BlankMiniatureComponent) => {
            const matCardElement = blankMiniature.el.nativeElement.querySelector('mat-card');
            if (matCardElement) {
                this.renderer.addClass(matCardElement, 'animated-bg');
            }
        });
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

    getImageDimensions(base64String: string): Promise<{ width: number, height: number }> {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => {
                const width = img.width;
                const height = img.height;
                resolve({width, height});
            };
            img.src = base64String;
        });
    }


    captureComponentView() {
        if (!this.archiveLoadInProgress) {
            return;
        }
        const content = this.blankContainer.nativeElement;
        html2canvas(content, {scale: this.imageHeight / this.previewHeight}).then(canvas => {
            const context = canvas.getContext('2d', {willReadFrequently: true});
            const canvasImage = canvas.toDataURL('image/png');
            this.zipImage(canvasImage.split(',')[1]);
            this.blankRendered.next(++this.currentBlankIndex);
        });
    }

    zipImage(imageBaseString: string) {
        this.zip.file(`${this.roundBlankSet.blanks[this.currentBlankIndex].number}.png`, imageBaseString, { base64: true });
    }

    saveAllBlanks() {
        this.zip = new JSZip();
        this.currentBlankIndex = 0;
        this.archiveLoadInProgress = true;
        let subscription = this.blankRendered.subscribe(index => {
            if (index < this.roundBlankSet.blanks.length) {
                this.hoveredBlank = this.roundBlankSet.blanks[index];
                this.loadPercents = Math.round((100 * index) / this.roundBlankSet.blanks.length);
                this.backgroundService.setImageZipped(true);
            } else {
                this.archiveLoadInProgress = false;
                this.zip.generateAsync({ type: 'blob' }).then(blob => {
                    this.saveZipFile(blob, `${this.roundBlankSet.round.name}.zip`);
                });
                this.backgroundService.setRoundBlanksScreenshotsFinished(this.roundBlankSet);
                subscription.unsubscribe();
            }
        });
        this.blankRendered.next(this.currentBlankIndex);
    }

    saveZipFile(blob: Blob, fileName: string): void {
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = fileName;
        link.click();
    }

    getBlankStatus(blank: Blank): BlankStatus | null {
        return this.roundPlay
            ? this.roundPlay.blankStatuses.find(blankStatus => blankStatus.blank.id === blank.id)!
            : null;
    }
}
