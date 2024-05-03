import {Component, ElementRef, Input, OnInit, ViewChild, ViewChildren} from '@angular/core';
import {RoundBlankSet} from "../interfaces/blank/round-blank-set";
import {Blank} from "../interfaces/blank/blank";
import {BlankMiniatureComponent} from "../blank-miniature/blank-miniature.component";
import {BackgroundService} from "../services/background.service";
import html2canvas from "html2canvas";

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

    @ViewChild("blankContainer")
    blankContainer: ElementRef;

    @ViewChild('canvas') canvas: ElementRef<HTMLCanvasElement>;
    @ViewChild('downloadLink', { static: true }) downloadLink: ElementRef<HTMLAnchorElement>;

    hoveredBlank: Blank | null;
    clickedBlank: Blank | null;

    imageHeight: number;
    imageWidth: number;
    previewHeight: number = 600;
    imageUrl: string;

    constructor(private backgroundService: BackgroundService) {


    }


    ngOnInit(): void {
        if (!this.roundBlankSet.blankBackground) {
            this.roundBlankSet.blankBackground = this.backgroundService.defaultBackground;
        }
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
        const content = this.blankContainer.nativeElement;
        html2canvas(content, {scale: this.imageHeight / this.previewHeight}).then(canvas => {
            const canvasImage = canvas.toDataURL('image/png');
            this.downloadImage(canvasImage);
        });
    }

    downloadImage(imageDataUrl: string) {
        const link = document.createElement('a');
        link.href = imageDataUrl;
        link.download = 'component_image.png';
        link.click();
        link.remove();
    }
}
