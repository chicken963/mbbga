import {Component, ElementRef, Input, OnInit, Renderer2, ViewChild, ViewChildren} from '@angular/core';
import {RoundBlankSet} from "../interfaces/blank/round-blank-set";
import {Blank} from "../interfaces/blank/blank";
import {BlankMiniatureComponent} from "../blank-miniature/blank-miniature.component";
import {BackgroundService} from "../services/background.service";
import html2canvas from "html2canvas";
import {Subject} from "rxjs";
import * as JSZip from "jszip";

@Component({
    selector: 'app-round-blank-set',
    templateUrl: './round-blank-set.component.html',
    styleUrls: ['./round-blank-set.component.scss']
})
export class RoundBlankSetComponent implements OnInit {

    @Input()
    roundBlankSet: RoundBlankSet;

    @ViewChildren(BlankMiniatureComponent)
    blankMiniatures: ElementRef<BlankMiniatureComponent>[];

    @ViewChild("blankContainer")
    blankContainer: ElementRef;

    @ViewChild('canvas') canvas: ElementRef<HTMLCanvasElement>;
    @ViewChild('downloadLink', { static: true }) downloadLink: ElementRef<HTMLAnchorElement>;

    blankRendered: Subject<number> = new Subject<number>();

    hoveredBlank: Blank | null;
    clickedBlank: Blank | null;

    imageHeight: number;
    imageWidth: number;
    previewHeight: number = 600;
    imageUrl: string;
    currentBlankIndex: number = 0;
    archiveLoadInProgress: boolean = false;
    zip: JSZip;
    loadPercents: number = 0;

    constructor(private backgroundService: BackgroundService) {


    }


    ngOnInit(): void {
        this.getImageDimensions(this.roundBlankSet.blankBackground.image as string).then(({width, height}) => {
            this.imageWidth = width;
            this.imageHeight = height;
            this.blankContainer.nativeElement.style.aspectRatio = width / height;
        });
        this.imageUrl = this.roundBlankSet.blankBackground.image as string;
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
        this.blankRendered.subscribe(index => {
            if (index < this.roundBlankSet.blanks.length) {
                this.hoveredBlank = this.roundBlankSet.blanks[index];
                this.loadPercents = Math.round((100 * index) / this.roundBlankSet.blanks.length);
            } else {
                this.archiveLoadInProgress = false;
                this.zip.generateAsync({ type: 'blob' }).then(blob => {
                    this.saveZipFile(blob, `${this.roundBlankSet.round.name}.zip`);
                });
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
}
