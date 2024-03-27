import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Blank} from "../interfaces/blank/blank";

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

  @Output()
  blankHovered: EventEmitter<Blank | null> = new EventEmitter<Blank | null>();

  @Output()
  blankClicked: EventEmitter<Blank> = new EventEmitter<Blank>();

  setCurrentBlank() {
    this.blankHovered.emit(this.blank);
  }

  setClickedBlank() {
    this.blankClicked.emit(this.blank);
  }

  clearCurrentBlank() {
    this.blankHovered.emit(null);
  }
}
