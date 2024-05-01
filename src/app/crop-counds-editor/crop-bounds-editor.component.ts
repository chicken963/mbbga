import {Component, ElementRef, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild} from '@angular/core';
import {BackgroundRectangle} from "../interfaces/blank/background";
import {delay, fromEvent, interval, Observable, takeUntil, tap} from "rxjs";
import {MatButton} from "@angular/material/button";

@Component({
    selector: 'app-crop-bounds-editor',
    templateUrl: './crop-bounds-editor.component.html',
    styleUrls: ['./crop-bounds-editor.component.scss']
})
export class CropBoundsEditorComponent {

    @Input()
    backgroundArea: BackgroundRectangle;

    @Input()
    imageWidth: number;

    @Input()
    imageHeight: number;

    @Output() areaSizeChanged: EventEmitter<BackgroundRectangle> = new EventEmitter<BackgroundRectangle>();

    private intervalId: any;
    private loggingInterval = 100;


    startXExceeded(): boolean {
        return this.backgroundArea.startX <= 0;
    }

    endXExceeded(): boolean {
        return this.backgroundArea.startX + this.backgroundArea.width >= this.imageWidth;
    }

    startYExceeded(): boolean {
        return this.backgroundArea.startY <= 0;
    }

    endYExceeded(): boolean {
        return this.backgroundArea.startY + this.backgroundArea.height >= this.imageHeight;
    }

    incrementStartX() {
        this.takeUntilMouseUp(() => this.backgroundArea.startX += 1, () => this.endXExceeded())
    }

    decrementStartX() {
        this.takeUntilMouseUp(() => this.backgroundArea.startX -= 1, () => this.startXExceeded())
    }

    incrementStartY() {
        this.takeUntilMouseUp(() => this.backgroundArea.startY += 1, () => this.endYExceeded())
    }

    decrementStartY() {
        this.takeUntilMouseUp(() => this.backgroundArea.startY -= 1, () => this.startYExceeded())
    }

    onDimensionsChange() {
        if (this.startXExceeded()) {
            this.backgroundArea.startX = 0;
        } else if (this.endXExceeded()) {
            this.backgroundArea.startX = this.imageWidth - this.backgroundArea.width;
        } else if (this.startYExceeded()) {
            this.backgroundArea.startY = 0;
        } else if (this.endYExceeded()) {
            this.backgroundArea.startY = this.imageHeight - this.backgroundArea.height;
        }
        this.areaSizeChanged.emit(this.backgroundArea);
    }


    onSizeChange() {
        if (this.widthExceeded()) {
            this.backgroundArea.width = this.imageWidth - this.backgroundArea.startX;
        } else if (this.heightExceeded()) {
            this.backgroundArea.height = this.imageHeight - this.backgroundArea.startY;
        }
        this.areaSizeChanged.emit(this.backgroundArea);
    }

    stopHeldChange() {
        clearInterval(this.intervalId);
    }

    takeUntilMouseUp(callback: () => void, predicate: () => boolean) {
        clearInterval(this.intervalId);
        callback();
        this.areaSizeChanged.emit(this.backgroundArea);
        this.intervalId = setInterval(() => {
            callback();
            this.areaSizeChanged.emit(this.backgroundArea);
            if (predicate()) {
                clearInterval(this.intervalId);
            }
        }, this.loggingInterval);
    }

    widthExceeded(): boolean {
        return this.backgroundArea.startX + this.backgroundArea.width > this.imageWidth;
    }

    heightExceeded(): boolean {
        return this.backgroundArea.startY + this.backgroundArea.height > this.imageHeight;
    }

    incrementWidth() {
        this.takeUntilMouseUp(() => this.backgroundArea.width += 1, () => this.widthExceeded());
    }

    decrementWidth() {
        this.takeUntilMouseUp(() => this.backgroundArea.width -= 1, () => this.backgroundArea.width <= 0);
    }

    incrementHeight() {
        this.takeUntilMouseUp(() => this.backgroundArea.height += 1, () => this.heightExceeded());
    }

    decrementHeight() {
        this.takeUntilMouseUp(() => this.backgroundArea.height -= 1, () => this.backgroundArea.height <= 0);
    }
}
