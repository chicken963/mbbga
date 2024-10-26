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

  currentProgress: number;
  nextProgress: number;

  @HostBinding("attr.style")
  public get valueAsStyle(): any {
    this.nextProgress = this.blankStatus ? Math.round(this.blankStatus.nextProgress) : 0;
    this.currentProgress = this.blankStatus ? Math.round(this.blankStatus.currentProgress) : 0;
    let deltaProgress = this.nextProgress - this.currentProgress;
    let blinkingColor = this.nextProgress === 100 || this.currentProgress == 100 ? '#c2185b' : '#095c79';
    return this.sanitizer.bypassSecurityTrustStyle(`
      --nextProgress: ${this.nextProgress}%; 
      --currentProgress: ${this.currentProgress}%; 
      --deltaProgress: ${deltaProgress}%;
      --blinkingColor: ${blinkingColor}
    `);
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
}
