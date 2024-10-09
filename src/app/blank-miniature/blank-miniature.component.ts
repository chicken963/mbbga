import {Component, ElementRef, EventEmitter, HostBinding, Input, Output, Renderer2} from '@angular/core';
import {Blank} from "../interfaces/blank/blank";
import {BlankStatus} from "../interfaces/gameplay/blank-status";
import {DomSanitizer} from "@angular/platform-browser";

@Component({
  selector: 'app-blank-miniature',
  templateUrl: './blank-miniature.component.html',
  styleUrls: ['./blank-miniature.component.scss']
})
export class BlankMiniatureComponent {

  @Input()
  blank: Blank;

  @Input()
  clickedBlank: Blank | null;

  @Input()
  blankStatus: BlankStatus | null;

  @Output()
  blankHovered: EventEmitter<Blank | null> = new EventEmitter<Blank | null>();

  @Output()
  blankClicked: EventEmitter<Blank> = new EventEmitter<Blank>();

  @HostBinding("attr.style")
  public get valueAsStyle(): any {
    let nextProgress = this.blankStatus ? Math.round(this.blankStatus.nextProgress) : 0;
    return this.sanitizer.bypassSecurityTrustStyle(`--nextProgress: ${nextProgress}%`);
  }

  setCurrentBlank() {
    this.blankHovered.emit(this.blank);
  }

  setClickedBlank() {
    this.blankClicked.emit(this.blank);
  }

  clearCurrentBlank() {
    this.blankHovered.emit(null);
  }

  constructor(public el: ElementRef, private renderer: Renderer2, private sanitizer: DomSanitizer) {}

  ngOnInit() {

  }

  addDynamicKeyframes() {
    let nextProgress = this.blankStatus ? Math.round(this.blankStatus.nextProgress) : 0;
    const progressValue = `${nextProgress}%`;
    this.renderer.setStyle(this.el.nativeElement, '--nextProgress', progressValue);
  }
}
