import {ElementRef, Injectable} from '@angular/core';
import {Overlay} from "@angular/cdk/overlay";
import {ComponentPortal} from "@angular/cdk/portal";
import {OverlayComponent} from "./overlay/overlay.component";
import {Observable, Subscription} from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class OverlayService {

    constructor(
        private overlay: Overlay,
    ) {
    }

    overlayRef: any


    showLoader(elementRef: ElementRef) {
        this.overlayRef = this.overlay.create({
            positionStrategy: this.overlay.position()
                .flexibleConnectedTo(elementRef)
                .withPositions(
                    [
                        {
                            originX: "center",
                            originY: "center",
                            overlayX: "center",
                            overlayY: "center"
                        }
                    ]
                ),
            width: elementRef.nativeElement.offsetWidth,
            height: elementRef.nativeElement.offsetHeight,
        })
        this.overlayRef.attach(new ComponentPortal(OverlayComponent));
    };

    hideLoader() {
        this.overlayRef.detach()
    }
}
