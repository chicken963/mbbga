import { Injectable } from '@angular/core';
import { Overlay, OverlayConfig } from '@angular/cdk/overlay';
import { MatSpinner } from '@angular/material/progress-spinner';
import { ComponentPortal } from '@angular/cdk/portal';

@Injectable({
  providedIn: 'root',
})
export class LoadingService {
  private overlayRef = this.createOverlay();

  constructor(private overlay: Overlay) {}

  private createOverlay(): any {
    const overlayConfig = new OverlayConfig();

    overlayConfig.hasBackdrop = true;
    overlayConfig.backdropClass = 'dark-backdrop';
    overlayConfig.positionStrategy = this.overlay.position().global().centerHorizontally().centerVertically();

    return this.overlay.create(overlayConfig);
  }

  show(): void {
    this.overlayRef.attach(new ComponentPortal(MatSpinner));
  }

  hide(): void {
    this.overlayRef.detach();
  }
}